/**
 * ROI PDF document — Final Addendum §13, Todo 26.5.
 *
 * Renders the calculator's result as a single-page A4 PDF using
 * @react-pdf/renderer. The same calculation helper drives both
 * the on-page result display and this PDF, so a salesperson
 * who downloads the PDF carries the same numbers the user saw
 * on screen — byte for byte.
 *
 * Why @react-pdf/renderer (not pdf-lib / pdfkit)
 * ==============================================
 *
 * The brief calls it out: declarative React components → PDF
 * pages. We get React composition (one `<MetricCard>` reused
 * three times), Flexbox-style layout via `StyleSheet`, and
 * built-in @react-pdf/charts compatibility — no manual `text(x,
 * y)` coordinate maths.
 *
 * Chart strategy
 * ==============
 *
 * @react-pdf/charts exists but pulls a heavy SVG renderer into
 * the bundle, and the page's recharts BarChart isn't directly
 * exportable to react-pdf. We render the bar chart NATIVELY in
 * react-pdf primitives (two `<View>` rectangles with width
 * proportional to value, drawn against a baseline) — pixel-
 * perfect with no extra dependency. The headline-comparison
 * "current vs potential" only ever has two bars, so the simple
 * primitive approach scales fine.
 *
 * Accessibility
 * =============
 *
 * PDF accessibility is a different layer from web a11y — screen
 * readers parse the PDF's tagged structure, not aria-*. We rely
 * on react-pdf's default Tagged-PDF output (semantic heading
 * order, paragraph flow) and avoid `position: absolute` for
 * anything informational so the reading order matches the
 * visual order.
 *
 * Font note
 * =========
 *
 * react-pdf's built-in Helvetica covers ASCII + Latin-1; we
 * stick to it to keep the bundle small and avoid the
 * Font.register() round-trip. Currency strings use `£` (U+00A3)
 * which is inside Latin-1, so we're safe without a custom font.
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { formatGbp, formatPayback, PRICING } from "../lib/roiCalculation";
import type { RoiResult } from "../lib/roiCalculation";
import type { RoiInputValues } from "../lib/roiInputs";

// ─────────────────────────────────────────────────────────────────────
// Brand palette — duplicated from the web side rather than imported
// from a theme module so the PDF renders identically if the web
// theme later forks (e.g. dark mode). PDF colour stays brand-fixed.
// ─────────────────────────────────────────────────────────────────────

const COLOUR = {
  navy: "#0B2343",
  navyMuted: "#0B234399", // 60%
  navySoft: "#0B234366", // 40%
  navyHairline: "#0B23431A", // 10%
  orange: "#ff7c22",
  white: "#FFFFFF",
  danger: "#d32f2f",
  paper: "#FFFFFF",
  panelTint: "#F5F7FA",
} as const;

// ─────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLOUR.paper,
    color: COLOUR.navy,
    fontFamily: "Helvetica",
    padding: 40,
    fontSize: 10,
  },
  // ── Header ───────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOUR.navyHairline,
    marginBottom: 24,
  },
  brand: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  brandWord: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navy,
    letterSpacing: 0.2,
  },
  brandTag: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navySoft,
    marginLeft: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: COLOUR.navyHairline,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  headerMeta: {
    fontSize: 8,
    color: COLOUR.navySoft,
  },

  // ── Org block ────────────────────────────────────────────────────
  reportTag: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.orange,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  orgName: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navy,
    marginBottom: 4,
  },
  orgSub: {
    fontSize: 10,
    color: COLOUR.navyMuted,
    marginBottom: 24,
  },

  // ── Headline ─────────────────────────────────────────────────────
  headlineBlock: {
    backgroundColor: COLOUR.panelTint,
    padding: 18,
    borderRadius: 6,
    marginBottom: 18,
  },
  headlineLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navySoft,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  headlineNumber: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.orange,
    letterSpacing: -0.5,
  },
  headlineNumberNegative: {
    color: COLOUR.danger,
  },

  // ── Metric strip ─────────────────────────────────────────────────
  metricRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 22,
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: 0,
    padding: 12,
    borderWidth: 1,
    borderColor: COLOUR.navyHairline,
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navySoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navy,
    marginBottom: 4,
  },
  metricValueDanger: {
    color: COLOUR.danger,
  },
  metricCaption: {
    fontSize: 8,
    color: COLOUR.navyMuted,
    lineHeight: 1.4,
  },

  // ── Chart ────────────────────────────────────────────────────────
  sectionHeading: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navy,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 9,
    color: COLOUR.navyMuted,
    marginBottom: 12,
  },
  chartCard: {
    borderWidth: 1,
    borderColor: COLOUR.navyHairline,
    borderRadius: 4,
    padding: 16,
    marginBottom: 22,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chartRowLabel: {
    width: 72,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navy,
  },
  chartBarTrack: {
    flexGrow: 1,
    height: 22,
    backgroundColor: COLOUR.navyHairline,
    borderRadius: 3,
    position: "relative",
  },
  chartBarFill: {
    height: "100%",
    borderRadius: 3,
    justifyContent: "center",
    paddingLeft: 8,
  },
  chartBarFillCurrent: {
    backgroundColor: COLOUR.navy,
    opacity: 0.35,
  },
  chartBarFillPotential: {
    backgroundColor: COLOUR.orange,
  },
  chartBarLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.white,
  },
  chartBarLabelOutside: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.navy,
    marginLeft: 8,
  },

  // ── Methodology ──────────────────────────────────────────────────
  methodologyCard: {
    backgroundColor: COLOUR.panelTint,
    padding: 14,
    borderRadius: 4,
    marginBottom: 22,
  },
  methodologyPara: {
    fontSize: 9,
    color: COLOUR.navy,
    lineHeight: 1.5,
  },

  // ── Next steps + footer ──────────────────────────────────────────
  ctaBlock: {
    backgroundColor: COLOUR.navy,
    padding: 16,
    borderRadius: 4,
    color: COLOUR.white,
  },
  ctaHeading: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLOUR.white,
    marginBottom: 4,
  },
  ctaSub: {
    fontSize: 9,
    color: "#FFFFFFB3",
    marginBottom: 10,
    lineHeight: 1.4,
  },
  ctaList: {
    fontSize: 9,
    color: COLOUR.white,
    lineHeight: 1.6,
  },
  ctaLink: {
    color: COLOUR.orange,
    textDecoration: "underline",
  },

  // ── Page footer ──────────────────────────────────────────────────
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 7,
    color: COLOUR.navySoft,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLOUR.navyHairline,
  },
});

// ─────────────────────────────────────────────────────────────────────
// Helper — proportional bar width as a percentage of the max
// ─────────────────────────────────────────────────────────────────────

const barPercent = (value: number, max: number): string => {
  if (max <= 0) return "0%";
  // Cap at 100% so a future "potential = max" rounding edge can't
  // overflow the track and clip the value label outside the card.
  return `${Math.min(100, Math.max(0, (value / max) * 100))}%`;
};

// ─────────────────────────────────────────────────────────────────────
// Date formatter
// ─────────────────────────────────────────────────────────────────────

const formatDateForReport = (d: Date): string =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ─────────────────────────────────────────────────────────────────────
// Public component
// ─────────────────────────────────────────────────────────────────────

export interface RoiPdfDocumentProps {
  inputs: RoiInputValues;
  result: RoiResult;
  /**
   * Generation timestamp. Injected from the page so a single render
   * has one consistent timestamp across header + footer.
   */
  generatedAt?: Date;
}

export default function RoiPdfDocument({
  inputs,
  result,
  generatedAt = new Date(),
}: RoiPdfDocumentProps) {
  const orgName = inputs.org_name?.trim() || "Your organisation";
  const generatedLabel = formatDateForReport(generatedAt);
  const negativeNet = result.net_benefit_annual < 0;

  // Bar chart bounds — both bars share the same scale so the
  // visual comparison is honest. Max is the bigger of the two,
  // with a small floor to avoid divide-by-zero rendering issues.
  const chartMax = Math.max(
    result.bar_chart.current_annual_income,
    result.bar_chart.potential_annual_income,
    1,
  );

  return (
    <Document
      title={`ROI Analysis — ${orgName}`}
      author="Amber Training (Project Silk)"
      subject="ESOL funding ROI analysis"
      creator="Amber Training ROI calculator"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Header ───────────────────────────────────────────── */}
        <View style={styles.header} fixed>
          <View style={styles.brand}>
            <Text style={styles.brandWord}>Amber Training</Text>
            <Text style={styles.brandTag}>Project Silk</Text>
          </View>
          <Text style={styles.headerMeta}>ROI Analysis · {generatedLabel}</Text>
        </View>

        {/* ── Org block ────────────────────────────────────────── */}
        <Text style={styles.reportTag}>Funding ROI analysis</Text>
        <Text style={styles.orgName}>{orgName}</Text>
        <Text style={styles.orgSub}>
          Based on the numbers you entered into the Amber Training ROI
          calculator on {generatedLabel}.
        </Text>

        {/* ── Headline ─────────────────────────────────────────── */}
        <View style={styles.headlineBlock}>
          <Text style={styles.headlineLabel}>
            Unclaimed ASF funding per year
          </Text>
          <Text
            style={[
              styles.headlineNumber,
              negativeNet ? styles.headlineNumberNegative : {},
            ]}
          >
            {formatGbp(result.unclaimed_income_annual)}
          </Text>
        </View>

        {/* ── Metric row ───────────────────────────────────────── */}
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Net annual benefit</Text>
            <Text
              style={[
                styles.metricValue,
                negativeNet ? styles.metricValueDanger : {},
              ]}
            >
              {formatGbp(result.net_benefit_annual)}
            </Text>
            <Text style={styles.metricCaption}>
              {negativeNet
                ? "Cost exceeds claim at this scale."
                : "After Project Silk platform cost."}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Payback period</Text>
            <Text style={styles.metricValue}>
              {formatPayback(result.payback_weeks)}
            </Text>
            <Text style={styles.metricCaption}>
              Weeks of recovered funding to repay one year of platform cost.
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>5-year net benefit</Text>
            <Text
              style={[
                styles.metricValue,
                result.five_year_benefit < 0 ? styles.metricValueDanger : {},
              ]}
            >
              {formatGbp(result.five_year_benefit)}
            </Text>
            <Text style={styles.metricCaption}>
              Year-1 net × compounded{" "}
              {(PRICING.five_year_inflation_rate * 100).toFixed(0)}% inflation,
              summed over {PRICING.projection_years} years.
            </Text>
          </View>
        </View>

        {/* ── Clawback-risk strip (Final Addendum §13) ─────────── */}
        {result.funding_at_risk_annual > 0 && (
          <View style={styles.metricRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                Funding protected vs clawback risk
              </Text>
              <Text style={styles.metricValue}>
                {formatGbp(result.funding_at_risk_annual)}
              </Text>
              <Text style={styles.metricCaption}>
                Estimated ASF at risk in a funding audit without a compliant
                RARPA and ILR evidence trail — the figure the platform's
                evidence layer protects.
              </Text>
            </View>
          </View>
        )}

        {/* ── Bar chart ────────────────────────────────────────── */}
        <Text style={styles.sectionHeading}>
          Current vs potential annual income
        </Text>
        <Text style={styles.sectionSub}>
          The gap is the unclaimed funding above.
        </Text>
        <View style={styles.chartCard}>
          {/* Native primitives — two rows, each with a track and
              a proportionally-wide coloured fill. No chart lib
              dependency, no SVG rasterisation, no font issues. */}
          <View style={styles.chartRow}>
            <Text style={styles.chartRowLabel}>Current</Text>
            <View style={styles.chartBarTrack}>
              <View
                style={[
                  styles.chartBarFill,
                  styles.chartBarFillCurrent,
                  {
                    width: barPercent(
                      result.bar_chart.current_annual_income,
                      chartMax,
                    ),
                  },
                ]}
              >
                {result.bar_chart.current_annual_income > 0 && (
                  <Text style={styles.chartBarLabel}>
                    {formatGbp(result.bar_chart.current_annual_income)}
                  </Text>
                )}
              </View>
              {result.bar_chart.current_annual_income === 0 && (
                <Text
                  style={[
                    styles.chartBarLabelOutside,
                    { position: "absolute", left: 8, top: 6 },
                  ]}
                >
                  £0
                </Text>
              )}
            </View>
          </View>
          <View style={styles.chartRow}>
            <Text style={styles.chartRowLabel}>Potential</Text>
            <View style={styles.chartBarTrack}>
              <View
                style={[
                  styles.chartBarFill,
                  styles.chartBarFillPotential,
                  {
                    width: barPercent(
                      result.bar_chart.potential_annual_income,
                      chartMax,
                    ),
                  },
                ]}
              >
                <Text style={styles.chartBarLabel}>
                  {formatGbp(result.bar_chart.potential_annual_income)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Methodology ──────────────────────────────────────── */}
        <Text style={styles.sectionHeading}>How we got there</Text>
        <View style={styles.methodologyCard}>
          <Text style={styles.methodologyPara}>
            Unclaimed funding is{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              waiting-list size × ASF rate
            </Text>{" "}
            ({inputs.waiting_list_size.toLocaleString("en-GB")} ×{" "}
            {formatGbp(inputs.avg_asf_rate)} ={" "}
            {formatGbp(result.unclaimed_income_annual)}). Project Silk's annual
            cost is{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {formatGbp(PRICING.license_fee_base)}
            </Text>{" "}
            licence plus{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              £{PRICING.monthly_per_learner}/learner/month × 12
            </Text>{" "}
            ({formatGbp(result.project_silk_annual_cost)} on your waiting list).
            The 5-year projection compounds the year-1 net benefit at{" "}
            {(PRICING.five_year_inflation_rate * 100).toFixed(0)}% inflation per
            year and sums across {PRICING.projection_years} years. We don't
            model waiting-list growth — the figures above are what you'd unlock
            from today's backlog.
          </Text>
        </View>

        {/* ── Next steps ────────────────────────────────────────── */}
        <View style={styles.ctaBlock}>
          <Text style={styles.ctaHeading}>Next steps</Text>
          <Text style={styles.ctaSub}>
            A 30-minute call with the Amber team. We'll walk you through your
            live ILR file and show you exactly where the gaps are.
          </Text>
          <View style={styles.ctaList}>
            <Text>
              ·{" "}
              <Link
                src="mailto:hello@ambertraining.co.uk"
                style={styles.ctaLink}
              >
                hello@ambertraining.co.uk
              </Link>
            </Text>
            <Text>
              ·{" "}
              <Link
                src="https://calendly.com/amber-training/project-silk-demo"
                style={styles.ctaLink}
              >
                Book a 30-minute demo on Calendly
              </Link>
            </Text>
            <Text>
              ·{" "}
              <Link
                src="https://ambertraining.co.uk/roi-calculator"
                style={styles.ctaLink}
              >
                Re-run the calculator
              </Link>
            </Text>
          </View>
        </View>

        {/* ── Page footer ──────────────────────────────────────── */}
        <View style={styles.pageFooter} fixed>
          <Text>© Amber Training Ltd · Project Silk</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages} · Generated ${generatedLabel}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
