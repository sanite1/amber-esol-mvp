/**
 * Amber-admin GLH Analytics — Final Addendum §12.
 *
 * Route: /admin/glh-analytics
 *
 * Cross-platform window-scoped view of the GLH split (AI tutor +
 * pre-platform + teacher contact). The page answers the
 * "is the funding-model shape healthy?" question — target teacher
 * GLH ratio is 10-20% of total GLH.
 *
 * Layout
 *   1. Header — title + date range pickers + org filter.
 *   2. Four summary cards: total / ai / pre-platform / teacher.
 *      The teacher card carries a coloured ratio chip.
 *   3. Stacked area chart — trend over time, three series.
 *   4. Per-org bar chart — total GLH per org, sorted desc.
 *
 * Accessibility (WCAG 2.1 AA)
 *   - Semantic landmarks: <main>, <section> with aria-labelledby.
 *   - Native <input type="date"> with visible labels.
 *   - Charts wrap a `role="img"` element with an aria-label that
 *     announces the key insight.
 *   - Summary cards' big numbers carry an aria-label restating the
 *     metric.
 *   - Colour is supplementary on the ratio chip — text label always
 *     accompanies it.
 */

import { useMemo, useState } from "react";
import { Bot, ClipboardList, Database, Sigma } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useGlhAnalytics } from "../api/glhAnalyticsApi";
import { useAdminOrgsOverview } from "../api/adminOrgsApi";

const SERIES_COLOUR = {
  ai_glh: "#2E7D32",
  pre_platform_glh: "#9E9E9E",
  teacher_contact_glh: "#1565C0",
} as const;

const RATIO_TARGET_MIN = 0.1;
const RATIO_TARGET_MAX = 0.2;

const SERIES_LABELS = {
  ai_glh: "AI tutor",
  pre_platform_glh: "Pre-platform",
  teacher_contact_glh: "Teacher contact",
} as const;

const toIsoDay = (d: Date): string => d.toISOString().slice(0, 10);

const defaultFromDate = (): string => {
  const today = new Date();
  const past = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
  return toIsoDay(past);
};

const defaultToDate = (): string => toIsoDay(new Date());

const formatHour = (h: number): string => `${h.toFixed(1)} h`;
const formatPercent = (r: number): string => `${(r * 100).toFixed(1)}%`;

const sharePercent = (part: number, total: number): string =>
  total > 0 ? `${((part / total) * 100).toFixed(1)}% of total` : "—";

interface RatioBadge {
  label: string;
  tone: "success" | "warning";
  tooltip: string;
}

const buildRatioBadge = (ratio: number): RatioBadge => {
  if (ratio >= RATIO_TARGET_MIN && ratio <= RATIO_TARGET_MAX) {
    return {
      label: "On target",
      tone: "success",
      tooltip: `Teacher contact is ${formatPercent(ratio)} of total GLH — inside the 10–20% funding-model target band.`,
    };
  }
  return {
    label: ratio < RATIO_TARGET_MIN ? "Below target" : "Above target",
    tone: "warning",
    tooltip:
      ratio < RATIO_TARGET_MIN
        ? `Teacher contact is ${formatPercent(ratio)} of total GLH — below the 10% funder threshold.`
        : `Teacher contact is ${formatPercent(ratio)} of total GLH — above the 20% upper band.`,
  };
};

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  caption?: string;
  tone: "default" | "ai" | "pre" | "teacher";
  ratioBadge?: RatioBadge | null;
}

const TONE_BORDER: Record<SummaryCardProps["tone"], string | undefined> = {
  default: undefined,
  ai: SERIES_COLOUR.ai_glh,
  pre: SERIES_COLOUR.pre_platform_glh,
  teacher: SERIES_COLOUR.teacher_contact_glh,
};

function SummaryCard({
  icon,
  label,
  value,
  caption,
  tone,
  ratioBadge,
}: SummaryCardProps) {
  const borderColour = TONE_BORDER[tone];
  return (
    <div
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 h-full"
      style={
        borderColour ? { borderLeft: `4px solid ${borderColour}` } : undefined
      }
    >
      <div className="flex items-center gap-2 text-[#0B2343]/55 mb-1">
        <span aria-hidden="true">{icon}</span>
        <p className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </p>
      </div>
      {value === null ? (
        <div className="h-9 w-24 rounded bg-[#0B2343]/[0.08] animate-pulse" />
      ) : (
        <p
          aria-label={`${label}: ${value}`}
          className="text-2xl sm:text-3xl font-extrabold text-[#0B2343] tabular-nums leading-tight"
        >
          {value}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2 mt-1">
        {caption && <p className="text-[11px] text-[#0B2343]/55">{caption}</p>}
        {ratioBadge && (
          <span
            title={ratioBadge.tooltip}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${
              ratioBadge.tone === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {ratioBadge.label}
          </span>
        )}
      </div>
    </div>
  );
}

export default function GlhAnalyticsPage() {
  const [from, setFrom] = useState<string>(defaultFromDate());
  const [to, setTo] = useState<string>(defaultToDate());
  const [orgFilter, setOrgFilter] = useState<string>("");

  const orgsQuery = useAdminOrgsOverview();
  const orgOptions = useMemo(() => {
    const rows = orgsQuery.data?.data?.orgs ?? [];
    return rows
      .map((o) => ({ id: o.org_id, name: o.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [orgsQuery.data]);

  const query = useMemo(
    () => ({
      from,
      to,
      org_id: orgFilter || undefined,
    }),
    [from, to, orgFilter],
  );
  const analyticsQuery = useGlhAnalytics(query);
  const data = analyticsQuery.data?.data;

  return (
    <main
      aria-labelledby="glh-analytics-heading"
      className="space-y-4 sm:space-y-5"
    >
      {/* ── Header card + filters ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="min-w-0">
            <h1
              id="glh-analytics-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight"
            >
              GLH analytics
            </h1>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
              AI tutor + pre-platform + teacher-contact hours across the
              platform. Target teacher ratio:{" "}
              <strong className="font-bold text-[#0B2343]">10–20%</strong> of
              total GLH.
            </p>
          </div>

          <div
            role="group"
            aria-label="Analytics filters"
            className="flex flex-col sm:flex-row gap-2 sm:items-end"
          >
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                From
              </span>
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                To
              </span>
              <input
                type="date"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              />
            </label>
            <label className="block sm:min-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                Organisation
              </span>
              <select
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              >
                <option value="">All organisations</option>
                {orgOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {analyticsQuery.isError && (
        <div
          role="status"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          Couldn't load GLH analytics. Try refreshing in a moment.
        </div>
      )}

      {/* 1. Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard
          icon={<Sigma size={16} aria-hidden="true" />}
          label="Total GLH"
          value={data ? formatHour(data.totals.total_glh) : null}
          caption={data ? `${data.period.days} days` : undefined}
          tone="default"
        />
        <SummaryCard
          icon={<Bot size={16} aria-hidden="true" />}
          label="AI tutor GLH"
          value={data ? formatHour(data.totals.ai_glh) : null}
          caption={
            data
              ? sharePercent(data.totals.ai_glh, data.totals.total_glh)
              : undefined
          }
          tone="ai"
        />
        <SummaryCard
          icon={<Database size={16} aria-hidden="true" />}
          label="Pre-platform GLH"
          value={data ? formatHour(data.totals.pre_platform_glh) : null}
          caption={
            data
              ? sharePercent(
                  data.totals.pre_platform_glh,
                  data.totals.total_glh,
                )
              : undefined
          }
          tone="pre"
        />
        <SummaryCard
          icon={<ClipboardList size={16} aria-hidden="true" />}
          label="Teacher contact GLH"
          value={data ? formatHour(data.totals.teacher_contact_glh) : null}
          caption={
            data ? formatPercent(data.totals.ratio_teacher_to_total) : undefined
          }
          tone="teacher"
          ratioBadge={
            data ? buildRatioBadge(data.totals.ratio_teacher_to_total) : null
          }
        />
      </div>

      {/* 2. Trend area chart */}
      <section
        aria-labelledby="trend-heading"
        className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5"
      >
        <div className="flex items-baseline justify-between mb-3">
          <h2
            id="trend-heading"
            className="text-base sm:text-lg font-extrabold text-[#0B2343]"
          >
            Trend over time
          </h2>
          <p className="text-[11px] text-[#0B2343]/55">
            {data
              ? `${data.trend_interval === "weekly" ? "Weekly" : "Daily"} buckets · ${data.trend.length} points`
              : ""}
          </p>
        </div>
        {analyticsQuery.isLoading || !data ? (
          <div className="h-[300px] rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
        ) : (
          <div
            role="img"
            aria-label={`Stacked area chart of GLH over time. ${data.trend.length} buckets. Teacher contact ratio ${formatPercent(data.totals.ratio_teacher_to_total)}.`}
            className="h-[320px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.trend}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis
                  dataKey="bucket_start"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11 }} unit=" h" />
                <RechartsTooltip
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)} h`,
                    SERIES_LABELS[name as keyof typeof SERIES_LABELS] ?? name,
                  ]}
                />
                <Legend
                  formatter={(value: string) =>
                    SERIES_LABELS[value as keyof typeof SERIES_LABELS] ?? value
                  }
                />
                <Area
                  type="monotone"
                  dataKey="ai_glh"
                  stackId="glh"
                  stroke={SERIES_COLOUR.ai_glh}
                  fill={SERIES_COLOUR.ai_glh}
                  fillOpacity={0.7}
                />
                <Area
                  type="monotone"
                  dataKey="pre_platform_glh"
                  stackId="glh"
                  stroke={SERIES_COLOUR.pre_platform_glh}
                  fill={SERIES_COLOUR.pre_platform_glh}
                  fillOpacity={0.7}
                />
                <Area
                  type="monotone"
                  dataKey="teacher_contact_glh"
                  stackId="glh"
                  stroke={SERIES_COLOUR.teacher_contact_glh}
                  fill={SERIES_COLOUR.teacher_contact_glh}
                  fillOpacity={0.8}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* 3. Per-org bar chart */}
      <section
        aria-labelledby="per-org-heading"
        className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5"
      >
        <div className="flex items-baseline justify-between mb-3">
          <h2
            id="per-org-heading"
            className="text-base sm:text-lg font-extrabold text-[#0B2343]"
          >
            By organisation
          </h2>
          <p className="text-[11px] text-[#0B2343]/55">
            {data ? `${data.per_org.length} orgs in window` : ""}
          </p>
        </div>

        {analyticsQuery.isLoading || !data ? (
          <div
            className="rounded-xl bg-[#0B2343]/[0.06] animate-pulse"
            style={{ height: Math.max(180, 32 * 8) }}
          />
        ) : data.per_org.length === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
          >
            No GLH recorded for any organisation in this window.
          </div>
        ) : (
          <div
            role="img"
            aria-label={`Bar chart of GLH per organisation. ${data.per_org.length} organisations, sorted highest first.`}
            style={{ height: Math.max(220, 36 * data.per_org.length) }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.per_org}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 32, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.4}
                  horizontal={false}
                />
                <XAxis type="number" unit=" h" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="org_name"
                  tick={{ fontSize: 11 }}
                  width={140}
                />
                <RechartsTooltip
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)} h`,
                    SERIES_LABELS[name as keyof typeof SERIES_LABELS] ?? name,
                  ]}
                />
                <Legend
                  formatter={(value: string) =>
                    SERIES_LABELS[value as keyof typeof SERIES_LABELS] ?? value
                  }
                />
                <Bar
                  dataKey="ai_glh"
                  stackId="glh"
                  fill={SERIES_COLOUR.ai_glh}
                />
                <Bar
                  dataKey="pre_platform_glh"
                  stackId="glh"
                  fill={SERIES_COLOUR.pre_platform_glh}
                />
                <Bar
                  dataKey="teacher_contact_glh"
                  stackId="glh"
                  fill={SERIES_COLOUR.teacher_contact_glh}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </main>
  );
}
