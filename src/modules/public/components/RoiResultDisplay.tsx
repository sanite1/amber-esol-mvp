/**
 * ROI result display — Final Addendum §13, Todo 26.3.
 *
 * Pure presentation. Consumes a pre-computed `RoiResult` and the
 * source `RoiInputValues` for the assumptions footnote. Re-renders
 * cheaply on every keystroke (debouncing lives upstream in the
 * page).
 *
 * Layout
 * ======
 *
 *   1. Headline — "£X,XXX,XXX of unclaimed ASF funding per year"
 *      in a large, scannable type. Tone flips when net_benefit is
 *      negative (the model says the platform wouldn't pay back at
 *      this scale; honest framing beats over-selling).
 *   2. Three metric cards — net annual benefit, payback weeks,
 *      5-year net benefit.
 *   3. Bar chart — current vs potential annual income, with the
 *      delta visualising the brief's unclaimed pool.
 *   4. Assumptions — small print listing the constants the user
 *      should be able to challenge.
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - The recharts BarChart wraps a `role="img"` with an
 *     aria-label restating the key insight, so SR users get the
 *     answer without parsing the SVG.
 *   - Currency cells carry an aria-label restating the metric
 *     ("Net annual benefit: £67,000") so SR readers don't have
 *     to infer from the surrounding card label.
 *   - Tone changes use icon + colour + text — colour alone never
 *     carries meaning (WCAG 1.4.1).
 *   - The whole result section is wrapped in an aria-live="polite"
 *     region so live updates as the user types are announced to
 *     screen readers without being interruptive.
 */

import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  formatGbp,
  formatPayback,
  PRICING,
  type RoiResult,
} from "../lib/roiCalculation";
import type { RoiInputValues } from "../lib/roiInputs";
import { useState } from "react";
import RoiPdfDownloadButton from "./RoiPdfDownloadButton";
import RoiContactCaptureModal from "./RoiContactCaptureModal";

export interface RoiResultDisplayProps {
  inputs: RoiInputValues;
  result: RoiResult;
  /**
   * Phase 2 / Final Addendum §13 (BE-G) — passed through to the
   * embedded RoiContactCaptureModal. Fired after a successful
   * submission (with-contact or anonymous). The org-admin
   * onboarding-embed path uses it to stamp
   * `org_onboarding_completed_at`; public callers leave it unset.
   */
  onSubmissionPosted?: () => void;
}

export default function RoiResultDisplay({
  inputs,
  result,
  onSubmissionPosted,
}: RoiResultDisplayProps) {
  // Capture modal — opened by the Download PDF button. Declared
  // at the top so the hook order is stable across renders; React
  // crashes if a hook is called conditionally (which the earlier
  // placement after the `if (!has_result) return` did).
  const [captureOpen, setCaptureOpen] = useState(false);

  // The page wraps this in an aria-live region. We still gate
  // the heavy visuals on has_result so the SR announcement stays
  // useful (no "£0 of unclaimed funding" pre-input babble).
  if (!result.has_result) {
    return (
      <div className="rounded-2xl bg-white border border-[#0B2343]/10 p-8 sm:p-10 shadow-sm">
        <p className="text-sm text-[#0B2343]/50 leading-relaxed">
          Fill in your waiting-list size and ASF rate above; your estimate will
          appear here as you type.
        </p>
      </div>
    );
  }

  const negativeNet = result.net_benefit_annual < 0;
  const headlineColour = negativeNet ? "text-[#d32f2f]" : "text-[#ff7c22]";
  const headlineNumber = formatGbp(result.unclaimed_income_annual);

  return (
    <div className="space-y-8">
      {/* ── 1. Headline ────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-[#0B2343]/10 p-8 sm:p-10 shadow-sm">
        <p className="text-sm font-bold text-[#0B2343]/55 uppercase tracking-wider">
          Unclaimed ASF funding per year
        </p>
        <p
          className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mt-3 ${headlineColour}`}
          aria-label={`Unclaimed ASF funding per year: ${headlineNumber}`}
        >
          {headlineNumber}
        </p>
        <p className="text-base text-[#0B2343]/65 mt-4 max-w-xl leading-relaxed">
          The funding your waiting-list represents at the ESFA Adult Skills Fund
          rate you entered. Project Silk is designed to unlock this gap.
        </p>
        {/* PDF download — placed inside the headline card so it
            sits with the most-glanceable result rather than at
            the bottom where it'd compete with the demo CTA.
            Hides itself when the result isn't computable. */}
        <div className="mt-6">
          <RoiPdfDownloadButton
            inputs={inputs}
            result={result}
            onDownloadClick={() => setCaptureOpen(true)}
          />
        </div>
      </div>

      {/* ── 2. Metric cards (3-up) ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          icon={
            negativeNet ? (
              <ArrowDownRight size={18} aria-hidden="true" />
            ) : (
              <ArrowUpRight size={18} aria-hidden="true" />
            )
          }
          label="Net annual benefit"
          value={formatGbp(result.net_benefit_annual)}
          tone={negativeNet ? "danger" : "success"}
          caption={
            negativeNet
              ? "Cost exceeds claim at this scale."
              : "After Project Silk platform cost."
          }
        />
        <MetricCard
          icon={<Calendar size={18} aria-hidden="true" />}
          label="Payback period"
          value={formatPayback(result.payback_weeks)}
          tone="default"
          caption="Weeks of recovered funding to repay one year of platform cost."
        />
        <MetricCard
          icon={<TrendingUp size={18} aria-hidden="true" />}
          label="5-year net benefit"
          value={formatGbp(result.five_year_benefit)}
          tone={result.five_year_benefit < 0 ? "danger" : "success"}
          caption={`Year-1 net × compounded ${(PRICING.five_year_inflation_rate * 100).toFixed(0)}% inflation, summed over ${PRICING.projection_years} years.`}
        />
      </div>

      {/* ── 2b. Clawback-risk strip (Final Addendum §13) ────────
          Only renders when the user told us their current funded
          throughput — that claim is what an evidence audit examines,
          and what platform-grade RARPA/ILR evidence protects. */}
      {result.funding_at_risk_annual > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 sm:p-6 flex items-start gap-3">
          <span
            aria-hidden="true"
            className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"
          >
            <ArrowDownRight size={16} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Funding protected vs clawback risk
            </p>
            <p
              className="text-2xl font-extrabold text-[#0B2343] mt-1 tabular-nums"
              aria-label={`Estimated ASF at risk without compliant evidence: ${formatGbp(result.funding_at_risk_annual)}`}
            >
              {formatGbp(result.funding_at_risk_annual)}
            </p>
            <p className="text-sm text-amber-900/80 mt-1 leading-relaxed max-w-xl">
              Your current annual ASF claim depends on audit-grade evidence.
              Without a compliant RARPA and ILR trail, this is the figure at
              risk in a funding audit — alongside the gain above, it's what the
              platform's evidence layer protects.
            </p>
          </div>
        </div>
      )}

      {/* ── 3. Bar chart — current vs potential ──────────────── */}
      <div className="rounded-2xl bg-white border border-[#0B2343]/10 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#0B2343]">
          Current vs potential annual income
        </h3>
        <p className="text-sm text-[#0B2343]/60 mt-1">
          The gap is the unclaimed funding above.
        </p>
        <div
          role="img"
          aria-label={`Bar chart. Current annual income: ${formatGbp(result.bar_chart.current_annual_income)}. Potential annual income: ${formatGbp(result.bar_chart.potential_annual_income)}.`}
          className="mt-6 h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                {
                  name: "Current",
                  value: result.bar_chart.current_annual_income,
                },
                {
                  name: "Potential",
                  value: result.bar_chart.potential_annual_income,
                },
              ]}
              margin={{ top: 24, right: 16, left: 8, bottom: 8 }}
              barCategoryGap="35%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.4}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 13, fontWeight: 600, fill: "#0B2343" }}
                tickLine={false}
                axisLine={{ stroke: "#0B2343", opacity: 0.15 }}
              />
              <YAxis
                tickFormatter={(v: number) =>
                  v >= 1_000_000
                    ? `£${(v / 1_000_000).toFixed(1)}m`
                    : v >= 1_000
                      ? `£${Math.round(v / 1_000)}k`
                      : `£${v}`
                }
                tick={{ fontSize: 11, fill: "#0B2343" }}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                formatter={(value: number) => [
                  formatGbp(value),
                  "Annual income",
                ]}
                cursor={{ fill: "rgba(11,35,67,0.04)" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {/* Current = muted navy; potential = brand orange so
                    the eye reads the gap as "this is what you'd
                    unlock". */}
                <Cell fill="#0B2343" fillOpacity={0.35} />
                <Cell fill="#ff7c22" />
                <LabelList
                  dataKey="value"
                  position="top"
                  // recharts' LabelFormatter receives the wider
                  // `RenderableText` union (string | number |
                  // undefined). We coerce to number before
                  // formatGbp; non-numeric values would only
                  // surface if recharts changed its bar-data
                  // shape contract, which would warrant a real
                  // fix here rather than a silent fallback.
                  formatter={(v) => formatGbp(Number(v))}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    fill: "#0B2343",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 4. Assumptions ─────────────────────────────────────── */}
      <details className="rounded-2xl bg-[#0B2343]/[0.03] border border-[#0B2343]/10 p-5">
        <summary className="cursor-pointer text-sm font-bold text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded">
          See the assumptions behind these numbers
        </summary>
        <dl className="mt-4 space-y-2 text-sm text-[#0B2343]/70 leading-relaxed">
          <div className="flex justify-between gap-4">
            <dt>Waiting-list size you entered</dt>
            <dd className="font-semibold text-[#0B2343]">
              {inputs.waiting_list_size.toLocaleString("en-GB")} learners
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>ASF rate you entered</dt>
            <dd className="font-semibold text-[#0B2343]">
              {formatGbp(inputs.avg_asf_rate)} per learner
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Current annual throughput</dt>
            <dd className="font-semibold text-[#0B2343]">
              {(inputs.current_throughput_per_year ?? 0).toLocaleString(
                "en-GB",
              )}{" "}
              learners/year
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Project Silk annual cost</dt>
            <dd className="font-semibold text-[#0B2343]">
              {formatGbp(result.project_silk_annual_cost)}
            </dd>
          </div>
          <div className="pt-3 mt-3 border-t border-[#0B2343]/10 text-xs text-[#0B2343]/55">
            <p>
              Platform cost ={" "}
              <strong>{formatGbp(PRICING.license_fee_base)}</strong> annual
              licence +{" "}
              <strong>£{PRICING.monthly_per_learner}/learner/month</strong> ×
              12. 5-year projection assumes{" "}
              <strong>
                {(PRICING.five_year_inflation_rate * 100).toFixed(0)}%
              </strong>{" "}
              annual inflation compounded. We don't model waiting-list growth —
              the number above is what you'd unlock from <em>today's</em>{" "}
              backlog.
            </p>
          </div>
        </dl>
      </details>

      {/* Final Addendum §13 — post-download contact-capture modal.
          Opens when the user clicks Download PDF; logs the
          submission either way (with email if they share, anonymous
          if they decline) so the funnel analytics aren't lopsided
          towards the "left a contact" cohort. */}
      <RoiContactCaptureModal
        open={captureOpen}
        onClose={() => setCaptureOpen(false)}
        inputs={inputs}
        result={result}
        onSubmissionPosted={onSubmissionPosted}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MetricCard — local, uniform tile for the 3-up metric strip
// ─────────────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
  tone: "default" | "success" | "danger";
}

const TONE_BORDER: Record<MetricCardProps["tone"], string> = {
  default: "border-[#0B2343]/10",
  success: "border-[#ff7c22]/40",
  danger: "border-[#d32f2f]/40",
};
const TONE_VALUE_COLOUR: Record<MetricCardProps["tone"], string> = {
  default: "text-[#0B2343]",
  success: "text-[#0B2343]",
  danger: "text-[#d32f2f]",
};

function MetricCard({ icon, label, value, caption, tone }: MetricCardProps) {
  return (
    <div
      className={`rounded-2xl bg-white border-2 ${TONE_BORDER[tone]} p-5 shadow-sm`}
    >
      <div className="flex items-center gap-2 text-[#0B2343]/55">
        {icon}
        <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
      </div>
      <p
        className={`text-3xl font-extrabold tracking-tight mt-2 ${TONE_VALUE_COLOUR[tone]}`}
        aria-label={`${label}: ${value}`}
      >
        {value}
      </p>
      <p className="text-xs text-[#0B2343]/55 mt-2 leading-relaxed">
        {caption}
      </p>
    </div>
  );
}
