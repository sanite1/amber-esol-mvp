import { useEffect, useMemo, useState } from "react";
import {
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  useListAlerts,
  type SafeguardingAlert,
  type SafeguardingAlertStatus,
  type SafeguardingTriggerCategory,
} from "../../lib/api/esolSafeguarding";
import {
  formatDateTime,
  safeguardingLevelColours,
} from "../../lib/utils/esolHelpers";
import type { SafeguardingLevel } from "../../lib/types/esol";
import ReviewAlertModal from "../../components/admin/orgs/ReviewAlertModal";

const PER_PAGE = 20;

/**
 * Short, triage-friendly label for each backend trigger category.
 * Mirrors amber-esol-backend/src/models/SafeguardingAlert.ts enum.
 */
const CATEGORY_LABEL: Record<SafeguardingTriggerCategory, string> = {
  self_harm: "Self-harm",
  domestic_abuse: "DV",
  radicalisation: "Radicalisation",
  child_concern: "Child concern",
  child_protection: "Child concern", // legacy alias from Gemini
  exploitation: "Exploitation",
  mental_health_crisis: "Mental health",
};

/**
 * SLA windows for OPEN alerts, in minutes. Past warningMin, the row
 * shows an amber left border + dot. Past breachMin, red + pulsing.
 * Resolved / reviewed / dismissed alerts are untouched.
 */
const SLA_WARNING_MIN = 5;
const SLA_BREACH_MIN = 15;

type SlaState = "ok" | "warning" | "breach";

const slaState = (alert: SafeguardingAlert): SlaState => {
  if (alert.status !== "open") return "ok";
  const ageMin = (Date.now() - new Date(alert.createdAt).getTime()) / 60_000;
  if (ageMin >= SLA_BREACH_MIN) return "breach";
  if (ageMin >= SLA_WARNING_MIN) return "warning";
  return "ok";
};

export default function AdminSafeguardingAlerts() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    SafeguardingAlertStatus | "all"
  >("all");
  const [levelFilter, setLevelFilter] = useState<SafeguardingLevel | "all">(
    "all",
  );
  const [selected, setSelected] = useState<SafeguardingAlert | null>(null);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, levelFilter]);

  const { data, isLoading } = useListAlerts({
    page,
    limit: PER_PAGE,
    status: statusFilter === "all" ? undefined : statusFilter,
    alertLevel: levelFilter === "all" ? undefined : levelFilter,
  });

  // Separate fetch for the open-count pill so the count is consistent
  // across filter changes — the main `data` is filtered, this isn't.
  const { data: openCountData } = useListAlerts({
    status: "open",
    page: 1,
    limit: 1,
  });
  const openCount = openCountData?.data?.pagination?.total ?? 0;

  const alerts = useMemo(() => data?.data?.alerts ?? [], [data]);
  const pagination = data?.data?.pagination;

  // Tick the SLA cue once a minute so amber rings turn red without
  // requiring a refetch. The dependency is the tick counter — pure
  // visual state, no network.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const openAlertCountInList = useMemo(
    () => alerts.filter((a) => a.status === "open").length,
    [alerts],
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight flex items-center gap-3">
            Safeguarding alerts
            {openCount > 0 && (
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200"
                aria-label={`${openCount} open alerts`}
              >
                {openCount} open
              </span>
            )}
          </h1>
          <p className="text-sm text-[#0B2343]/50 mt-1">
            Welfare concerns flagged automatically during AI sessions.
            {openAlertCountInList > 0 && (
              <>
                {" "}
                Open rows breach SLA after {SLA_BREACH_MIN} minutes — amber
                indicator at {SLA_WARNING_MIN}, red after {SLA_BREACH_MIN}.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0B2343]/60">
          <Filter size={14} /> Filter:
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as SafeguardingAlertStatus | "all")
          }
          className="px-4 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="reviewed">Reviewed</option>
          <option value="escalated">Escalated</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select
          value={levelFilter}
          onChange={(e) =>
            setLevelFilter(e.target.value as SafeguardingLevel | "all")
          }
          className="px-4 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
        >
          <option value="all">All levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2
              size={24}
              className="text-[#ff7c22] animate-spin mx-auto mb-2"
            />
            <p className="text-sm text-[#0B2343]/40">Loading alerts…</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <ShieldAlert size={20} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-[#0B2343]">
              No alerts found
            </p>
            <p className="text-xs text-[#0B2343]/40 mt-1">
              No safeguarding concerns match these filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#0B2343]/[0.04]">
            {alerts.map((alert) => {
              const learner =
                typeof alert.learnerId === "object" ? alert.learnerId : null;
              const org = typeof alert.orgId === "object" ? alert.orgId : null;
              const levelColours = safeguardingLevelColours(alert.alertLevel);
              const sla = slaState(alert);
              const categoryLabel = alert.triggerCategory
                ? (CATEGORY_LABEL[alert.triggerCategory] ?? null)
                : null;

              // SLA left-border: marks open alerts past the SLA windows.
              // Reviewed/resolved/escalated/dismissed get no decoration.
              const slaBorder =
                sla === "breach"
                  ? "border-l-4 border-l-red-500"
                  : sla === "warning"
                    ? "border-l-4 border-l-amber-400"
                    : "border-l-4 border-l-transparent";

              return (
                <button
                  key={alert._id}
                  onClick={() => setSelected(alert)}
                  className={`w-full text-left px-6 py-4 hover:bg-[#0B2343]/[0.02] transition-colors flex items-start gap-4 ${slaBorder}`}
                  aria-label={
                    sla === "breach"
                      ? `Open alert past ${SLA_BREACH_MIN}-minute SLA — needs immediate action`
                      : sla === "warning"
                        ? `Open alert past ${SLA_WARNING_MIN} minutes`
                        : undefined
                  }
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${levelColours.bg} flex items-center justify-center shrink-0 relative`}
                  >
                    <ShieldAlert size={16} className={levelColours.text} />
                    {sla !== "ok" && (
                      <span
                        aria-hidden="true"
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                          sla === "breach"
                            ? "bg-red-500 animate-pulse"
                            : "bg-amber-400"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${levelColours.bg} ${levelColours.text} ${levelColours.border}`}
                      >
                        {alert.alertLevel}
                      </span>
                      {categoryLabel && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[#0B2343]/[0.06] text-[#0B2343]/70"
                          title={alert.triggerCategory ?? undefined}
                        >
                          {categoryLabel}
                        </span>
                      )}
                      <StatusBadge status={alert.status} />
                      <span className="text-[11px] text-[#0B2343]/40">
                        {formatDateTime(alert.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#0B2343]">
                      {learner
                        ? `${learner.firstname} ${learner.lastname}`
                        : "Unknown learner"}
                      {org && (
                        <span className="text-[#0B2343]/50 font-normal">
                          {" "}
                          — {org.name}
                        </span>
                      )}
                    </p>
                    {alert.claudeReasoning && (
                      <p className="text-xs text-[#0B2343]/60 mt-1 line-clamp-2">
                        {alert.claudeReasoning}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-[#0B2343]/[0.06] flex items-center justify-between bg-[#fafbfc]">
            <p className="text-xs text-[#0B2343]/50">
              Page {pagination.page} of {pagination.totalPages} ·{" "}
              {pagination.total} alerts
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-white transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-white transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ReviewAlertModal
        open={Boolean(selected)}
        alert={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: SafeguardingAlertStatus }) {
  const config = {
    open: { label: "Open", classes: "text-amber-700 bg-amber-50" },
    reviewed: {
      label: "Reviewed",
      classes: "text-blue-700 bg-blue-50",
    },
    escalated: {
      label: "Escalated",
      classes: "text-orange-700 bg-orange-50",
    },
    resolved: {
      label: "Resolved",
      classes: "text-emerald-700 bg-emerald-50",
    },
    dismissed: {
      label: "Dismissed",
      classes: "text-[#0B2343]/50 bg-[#0B2343]/[0.04]",
    },
  }[status];

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
