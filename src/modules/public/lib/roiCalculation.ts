/**
 * ROI calculation — Final Addendum §13, Todo 26.3.
 *
 * Pure, client-side, no backend round-trip. The funnel-page user
 * gets their estimate without anything leaving the browser; the
 * "Book a demo" CTA is the only path that hands data to Amber.
 *
 * Formulas (per the brief)
 * ========================
 *
 *   unclaimed_income_annual    = waiting_list_size * avg_asf_rate
 *
 *   project_silk_annual_cost   = LICENSE_FEE_BASE
 *                              + waiting_list_size * MONTHLY_PER_LEARNER * 12
 *
 *   net_benefit_annual         = unclaimed_income_annual − project_silk_annual_cost
 *
 *   payback_weeks              = project_silk_annual_cost
 *                              / (unclaimed_income_annual / 52)
 *
 *   five_year_benefit          = Σ (net_benefit_annual * 1.03^i) for i in 0..4
 *                                (3% inflation compounding, year 1 = base)
 *
 * Pricing placeholders
 * ====================
 *
 * The brief calls out license_fee_base = £5,000 and
 * monthly_per_learner = £15 as placeholders. They live as named
 * constants here so a future pricing change is one diff — the
 * result display reads them via the public `PRICING` export so a
 * tooltip / assumptions block can render "based on £5,000 +
 * £15/learner/month" without re-deriving.
 *
 * Edge cases
 * ==========
 *
 *   - waiting_list_size = 0 → every downstream metric is 0;
 *     payback_weeks is Infinity (no income to amortise against);
 *     the result display gates on a `has_result` boolean and
 *     hides the headline when there's nothing meaningful to say.
 *   - avg_asf_rate = 0 → same Infinity payback. Same gate.
 *   - net_benefit_annual < 0 (cost exceeds income) →
 *     surfaced as a negative number; the result display flips
 *     the headline tone to a "won't pay back" framing. Better
 *     than silently clamping to zero and over-selling.
 *   - 5-year compounding always uses the FIRST year's net as
 *     the base. We don't recompute waiting_list_size growth —
 *     the brief is explicit about the formula, and presuming
 *     waiting-list growth would invent an assumption the user
 *     can't see.
 */

import type { RoiInputValues } from "./roiInputs";

// ─────────────────────────────────────────────────────────────────────
// Pricing placeholders — brief §13. Update here, not at use sites.
// ─────────────────────────────────────────────────────────────────────

export const PRICING = {
  /** Annual platform license — flat fee that doesn't scale with cohort size. */
  license_fee_base: 5_000,
  /** Per-learner per-month variable cost. £15/mo × 12 × N learners. */
  monthly_per_learner: 15,
  /** Inflation factor used for the 5-year compounding projection. */
  five_year_inflation_rate: 0.03,
  /** Projection horizon — matches the brief's `five_year_benefit`. */
  projection_years: 5,
} as const;

// ─────────────────────────────────────────────────────────────────────
// Result shape
// ─────────────────────────────────────────────────────────────────────

export interface RoiResult {
  /** True when both required inputs are positive — gate for the display. */
  has_result: boolean;
  unclaimed_income_annual: number;
  project_silk_annual_cost: number;
  net_benefit_annual: number;
  /** Whole weeks; +Infinity when payback can't be computed. */
  payback_weeks: number;
  five_year_benefit: number;
  /**
   * Final Addendum §13 — "Funding protected vs risk of clawback:
   * estimated ASF at risk without compliant evidence, shown as a
   * risk figure alongside the gain figure." We surface the college's
   * CURRENT annual ASF claim (current_throughput × rate) — that's
   * the funding whose evidence trail an audit examines, and the
   * figure platform-grade RARPA/ILR evidence protects. 0 when the
   * user left current throughput blank (the risk card hides).
   */
  funding_at_risk_annual: number;
  /**
   * Bar-chart series. `current` uses
   * current_throughput_per_year × avg_asf_rate (zero when the
   * user left throughput blank); `potential` is the addressable
   * total (current + waiting-list). The "gap" between bars is
   * the brief's unclaimed_income_annual.
   */
  bar_chart: {
    current_annual_income: number;
    potential_annual_income: number;
  };
}

// ─────────────────────────────────────────────────────────────────────
// Pure entry
// ─────────────────────────────────────────────────────────────────────

const safeNumber = (n: unknown): number => {
  if (typeof n !== "number" || !Number.isFinite(n) || n < 0) return 0;
  return n;
};

const round = (n: number): number => Math.round(n);

export const computeRoi = (input: RoiInputValues): RoiResult => {
  const waitingListSize = safeNumber(input.waiting_list_size);
  const avgAsfRate = safeNumber(input.avg_asf_rate);
  const currentThroughput = safeNumber(input.current_throughput_per_year);

  const has_result = waitingListSize > 0 && avgAsfRate > 0;

  const unclaimedIncomeAnnual = waitingListSize * avgAsfRate;
  const projectSilkAnnualCost =
    PRICING.license_fee_base +
    waitingListSize * PRICING.monthly_per_learner * 12;
  const netBenefitAnnual = unclaimedIncomeAnnual - projectSilkAnnualCost;

  // Weekly income from the unclaimed pool; payback is "how many
  // weeks of that pool repay the year's cost". When unclaimed is 0
  // the division yields NaN/Infinity — surface Infinity so the
  // display layer can render "n/a" rather than mid-formula NaNs.
  const weeklyIncome = unclaimedIncomeAnnual / 52;
  const paybackWeeksRaw =
    weeklyIncome > 0
      ? projectSilkAnnualCost / weeklyIncome
      : Number.POSITIVE_INFINITY;
  const payback_weeks = Number.isFinite(paybackWeeksRaw)
    ? round(paybackWeeksRaw)
    : Number.POSITIVE_INFINITY;

  // 5-year compounding — explicit loop rather than the closed-form
  // geometric series so the formula reads top-to-bottom. Also lets
  // a future per-year-tweak (different inflation per year) drop in
  // without re-deriving anything.
  let fiveYearBenefit = 0;
  for (let i = 0; i < PRICING.projection_years; i++) {
    fiveYearBenefit +=
      netBenefitAnnual * Math.pow(1 + PRICING.five_year_inflation_rate, i);
  }

  return {
    has_result,
    unclaimed_income_annual: round(unclaimedIncomeAnnual),
    project_silk_annual_cost: round(projectSilkAnnualCost),
    net_benefit_annual: round(netBenefitAnnual),
    payback_weeks,
    five_year_benefit: round(fiveYearBenefit),
    funding_at_risk_annual: round(currentThroughput * avgAsfRate),
    bar_chart: {
      current_annual_income: round(currentThroughput * avgAsfRate),
      potential_annual_income: round(
        (currentThroughput + waitingListSize) * avgAsfRate,
      ),
    },
  };
};

// ─────────────────────────────────────────────────────────────────────
// Formatters — keep visual concerns out of the page components
// ─────────────────────────────────────────────────────────────────────

const GBP_FORMATTER = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

/** Format a GBP integer as `£1,234,567`. Negative values keep the
 *  Intl convention (`-£1,234`) so a net-loss case reads honestly. */
export const formatGbp = (n: number): string =>
  Number.isFinite(n) ? GBP_FORMATTER.format(n) : "—";

/** "12 weeks" / "1 week" / "n/a" when payback isn't computable. */
export const formatPayback = (weeks: number): string => {
  if (!Number.isFinite(weeks)) return "n/a";
  if (weeks <= 0) return "Immediate";
  return weeks === 1 ? "1 week" : `${weeks.toLocaleString("en-GB")} weeks`;
};

// ─────────────────────────────────────────────────────────────────────
// Test exports
// ─────────────────────────────────────────────────────────────────────

export const __internals__ = { safeNumber, round };
