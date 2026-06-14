/**
 * Overview tab — level progression chart + key metrics + recent activity.
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import type { LearnerDetail } from "../../../../lib/types/orgAdmin";

const LEVEL_INDEX: Record<string, number> = {
  e1: 1,
  e2: 2,
  e3: 3,
  l1: 4,
  l2: 5,
};
const INDEX_LEVEL: Record<number, string> = {
  1: "E1",
  2: "E2",
  3: "E3",
  4: "L1",
  5: "L2",
};

interface Props {
  detail: LearnerDetail;
}

export default function OverviewTab({ detail }: Props) {
  const learner = detail.learner;

  const chartData = [
    {
      date: "Start",
      level: LEVEL_INDEX[learner.starting_level ?? ""] ?? 0,
      label: learner.starting_level?.toUpperCase() ?? "—",
    },
    ...detail.level_progression.map((lc) => ({
      date: new Date(lc.effectiveDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      level: LEVEL_INDEX[lc.toLevel] ?? 0,
      label: lc.toLevel.toUpperCase(),
    })),
  ];

  const recentAudit = detail.audit_log_entries.rows.slice(0, 5);

  return (
    <div className="space-y-4">
      {/* ── Level progression chart ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343] mb-3">
          Level progression
        </h2>

        {chartData.length <= 1 ? (
          <div
            role="status"
            className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
          >
            No level changes yet. The chart fills in as the learner progresses.
          </div>
        ) : (
          <div
            className="h-[240px]"
            aria-label="Level progression over time"
            role="img"
          >
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(v) => INDEX_LEVEL[v as number] ?? ""}
                />
                <RechartsTooltip
                  formatter={(_v, _n, props) => [
                    props.payload?.label ?? "",
                    "Level",
                  ]}
                />
                <Line
                  type="step"
                  dataKey="level"
                  stroke="#0b2343"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* ── Key metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KeyMetric label="Scenarios passed" value={learner.scenarios_passed} />
        <KeyMetric
          label="Total GLH"
          value={`${learner.total_glh.toFixed(1)} h`}
        />
        <KeyMetric
          label="AI tutor hours"
          value={`${learner.total_ai_hours.toFixed(1)} h`}
        />
        <KeyMetric
          label="Teacher contact"
          value={`${learner.teacher_contact_hours.toFixed(1)} h`}
        />
      </div>

      {/* ── Recent activity ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343] mb-3">
          Recent activity
        </h2>
        {recentAudit.length === 0 ? (
          <p className="text-sm text-[#0B2343]/55">No audit-log entries yet.</p>
        ) : (
          <ol className="space-y-2 list-none p-0 m-0">
            {recentAudit.map((row) => (
              <li key={row._id} className="flex items-start gap-3">
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/70 bg-white whitespace-nowrap">
                  {row.action.replace(/_/g, " ")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#0B2343]/85 leading-relaxed">
                    {row.reason}
                  </p>
                  <p className="text-[11px] text-[#0B2343]/55 mt-0.5 tabular-nums">
                    {new Date(row.timestamp).toLocaleString("en-GB")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

interface KeyMetricProps {
  label: string;
  value: string | number;
}

function KeyMetric({ label, value }: KeyMetricProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-3 sm:p-4 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tabular-nums leading-tight mt-1">
        {value}
      </p>
    </div>
  );
}
