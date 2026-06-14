/**
 * Org-admin Audit Log page — Final Addendum §6.
 *
 * Two consumers:
 *   - The Audit Log tab on the dashboard (no learner pre-filter,
 *     full org view).
 *   - The Compliance Timeline tab on the learner detail page
 *     (learner_id pre-filtered + the learner-picker control hidden).
 *
 * The `embedded` prop drives the per-learner mode: when true the
 * component skips its page chrome (header, action button) and locks
 * the learner_id filter to the caller's prop.
 *
 * WCAG 2.1 AA:
 *   - Filter inputs grouped under a labelled fieldset.
 *   - Table headers carry `scope="col"`; the sort column carries
 *     `aria-sort="descending"` (the only sort the API offers).
 *   - Expand affordances use `aria-expanded` + a descriptive
 *     `aria-label` naming the action being expanded.
 *   - The reason field is rendered in bold so it's the most visually
 *     prominent text in each row.
 */

import { useEffect, useMemo, useState } from "react";
import { FileDown, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useOrgAdminAuditLog } from "../../api/orgAdminApi";
import type {
  OrgAdminAuditLogRow,
  OrgAdminAuditLogQuery,
} from "../../lib/types/orgAdmin";

const KNOWN_ACTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "All actions" },
  { value: "learner_registered", label: "Learner registered" },
  { value: "learner_bulk_imported", label: "Learner bulk imported" },
  { value: "forskills_imported", label: "ForSkills imported" },
  {
    value: "historical_session_imported",
    label: "Historical session imported",
  },
  { value: "eligibility_declared", label: "Eligibility declared" },
  { value: "uln_recorded", label: "ULN recorded" },
  { value: "session_started", label: "Session started" },
  { value: "session_completed", label: "Session completed" },
  { value: "rarpa_stage_advanced", label: "RARPA stage advanced" },
  { value: "ilr_record_generated", label: "ILR record generated" },
  { value: "mis_push_completed", label: "MIS push completed" },
  { value: "mis_push_held", label: "MIS push held" },
  { value: "green_light_passed", label: "Green-light passed" },
  { value: "safeguarding_alert_raised", label: "Safeguarding alert raised" },
  { value: "safeguarding_ai_only_flag", label: "Safeguarding AI-only flag" },
  { value: "teacher_review_logged", label: "Teacher review logged" },
  { value: "teacher_message_sent", label: "Teacher message sent" },
  { value: "pathway_override_set", label: "Pathway override set" },
  { value: "pathway_override_expired", label: "Pathway override expired" },
  { value: "level_change_confirmed", label: "Level change confirmed" },
  { value: "level_change_rejected", label: "Level change rejected" },
  { value: "placement_completed", label: "Placement completed" },
  { value: "stage5_review_generated", label: "Stage 5 review generated" },
  { value: "progression_ready_flagged", label: "Progression ready flagged" },
  { value: "cohort_status_changed", label: "Cohort status changed" },
  { value: "learner_nudge_sent", label: "Learner nudge sent" },
];

const ACTOR_LABEL: Record<string, string> = {
  amber_admin: "Amber admin",
  org_admin: "Org admin",
  teacher: "Teacher",
  learner: "Learner",
  system: "System",
};

export interface AuditLogProps {
  /** When set, pre-filters to this learner and hides the learner picker. */
  learnerId?: string;
  /** When true, skips page chrome — used by the Compliance Timeline tab. */
  embedded?: boolean;
}

export default function AuditLog({
  learnerId,
  embedded = false,
}: AuditLogProps) {
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1); // 1-indexed
  const [pageSize, setPageSize] = useState(50);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Reset to page 1 whenever a filter changes — otherwise paginating
  // from page 5 of one filter into a smaller result set strands the
  // user on an empty page.
  useEffect(() => {
    setPage(1);
  }, [action, from, to, learnerId, pageSize]);

  const query: OrgAdminAuditLogQuery = useMemo(
    () => ({
      learner_id: learnerId,
      action: action || undefined,
      from: from || undefined,
      to: to || undefined,
      page,
      limit: pageSize,
    }),
    [learnerId, action, from, to, page, pageSize],
  );

  const { data, isLoading, isError, error } = useOrgAdminAuditLog(query);
  const rows = data?.data?.rows ?? [];
  const total = data?.data?.pagination.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const colCount = learnerId ? 5 : 6;

  const toggle = (id: string) =>
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Embedded mode skips outer chrome and uses a transparent <div>,
  // matching the original `Box component="div"` behaviour. No page
  // padding in either mode — MainLayout's content wrapper already
  // applies p-4 sm:p-6 lg:p-8.
  const Wrapper = embedded ? "div" : "main";
  const wrapperClass = embedded ? "space-y-3" : "space-y-4 sm:space-y-5";

  return (
    <Wrapper className={wrapperClass}>
      {/* ── Header (skipped when embedded) ── */}
      {!embedded && (
        <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight">
            Audit log
          </h1>
          <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
            Every state change in your organisation, in chronological order. The{" "}
            <strong className="font-bold text-[#0B2343]">reason</strong> column
            is what an inspector reads first.
          </p>
        </section>
      )}

      {/* ── Filter bar — sr-only legend keeps the a11y group name; a
          styled <legend> would float on the fieldset border. */}
      {/* min-w-0 overrides the fieldset UA default min-inline-size:
          min-content (prevents viewport overflow). */}
      <fieldset className="min-w-0 rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5">
        <legend className="sr-only">Filters</legend>
        <p
          aria-hidden="true"
          className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-3"
        >
          Filters
        </p>
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-end gap-3">
          {/* Action select */}
          <label className="flex flex-col gap-1 min-w-0 md:min-w-[240px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Action
            </span>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            >
              {KNOWN_ACTIONS.map((a) => (
                <option key={a.value || "all"} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>

          {/* From date */}
          <label className="flex flex-col gap-1 min-w-0 md:min-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              From
            </span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="From date"
              className="rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            />
          </label>

          {/* To date */}
          <label className="flex flex-col gap-1 min-w-0 md:min-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              To
            </span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="To date"
              className="rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            />
          </label>

          {/* TODO: Learner picker (autocomplete by name). Hidden when
              embedded for one learner; placeholder for now. */}

          <div className="flex-1" />

          {/* Export PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Export the filtered audit log as PDF via browser print"
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
          >
            <FileDown size={14} aria-hidden="true" />
            Export PDF
          </button>
        </div>
      </fieldset>

      {/* ── Error banner ── */}
      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error?.message ?? "Could not load the audit log."}
        </div>
      )}

      {/* ── Table ── */}
      <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table
            aria-label="Org audit log"
            className="w-full min-w-[720px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <th scope="col" aria-hidden="true" className="w-9 px-2 py-3" />
                <th
                  scope="col"
                  aria-sort="descending"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Actor
                </th>
                {!learnerId && (
                  <th
                    scope="col"
                    className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                  >
                    Learner
                  </th>
                )}
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && rows.length === 0 ? (
                <tr>
                  <td colSpan={colCount} className="py-10 text-center">
                    <Loader2
                      size={28}
                      aria-label="Loading audit log"
                      className="inline-block animate-spin text-[#0B2343]/45"
                    />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={colCount}
                    className="py-10 text-center text-sm text-[#0B2343]/55"
                  >
                    No audit-log entries match the current filters.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <AuditRow
                    key={row._id}
                    row={row}
                    expanded={expanded.has(row._id)}
                    onToggle={() => toggle(row._id)}
                    hideLearner={Boolean(learnerId)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-t border-[#0B2343]/[0.06] bg-[#fafbfc]">
            <div className="flex items-center gap-2 text-xs text-[#0B2343]/65">
              <label className="flex items-center gap-2">
                Rows per page:
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="rounded-md border border-[#0B2343]/[0.12] bg-white px-2 py-1 text-xs text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
                >
                  {[10, 25, 50, 100, 200].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-[#0B2343]/45">·</span>
              <span aria-live="polite" className="tabular-nums">
                {total === 0
                  ? "0 of 0"
                  : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#0B2343]/70 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
              >
                ‹
              </button>
              <span className="text-xs text-[#0B2343]/65 tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#0B2343]/70 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AuditRow — handles expand/collapse for one entry
// ─────────────────────────────────────────────────────────────────────

interface AuditRowProps {
  row: OrgAdminAuditLogRow;
  expanded: boolean;
  onToggle: () => void;
  hideLearner: boolean;
}

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const actionToLabel = (action: string): string =>
  action
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

function AuditRow({ row, expanded, onToggle, hideLearner }: AuditRowProps) {
  const colCount = hideLearner ? 5 : 6;
  return (
    <>
      <tr className="border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc]">
        <td className="align-top px-2 py-3">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={`audit-detail-${row._id}`}
            aria-label={
              expanded
                ? `Hide before/after detail for ${actionToLabel(row.action)}`
                : `Show before/after detail for ${actionToLabel(row.action)}`
            }
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[#0B2343]/55 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
          >
            {expanded ? (
              <ChevronUp size={14} aria-hidden="true" />
            ) : (
              <ChevronDown size={14} aria-hidden="true" />
            )}
          </button>
        </td>
        <td className="align-top px-3 py-3 whitespace-nowrap text-xs text-[#0B2343]/70 tabular-nums">
          {formatTime(row.timestamp)}
        </td>
        <td className="align-top px-3 py-3 text-xs">
          <span className="inline-block font-bold text-[#0B2343]">
            {row.actor_name ?? ACTOR_LABEL[row.actor_type] ?? row.actor_type}
          </span>
          <span className="ml-1.5 text-[10px] uppercase tracking-wider text-[#0B2343]/45 font-bold">
            {ACTOR_LABEL[row.actor_type] ?? row.actor_type}
          </span>
        </td>
        {!hideLearner && (
          <td className="align-top px-3 py-3 text-xs text-[#0B2343]/80">
            {row.learner_name ?? "—"}
          </td>
        )}
        <td className="align-top px-3 py-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ff7c22]/12 text-[#ff7c22]">
            {actionToLabel(row.action)}
          </span>
        </td>
        <td className="align-top px-3 py-3 text-sm font-bold text-[#0B2343]">
          {row.reason}
        </td>
      </tr>

      {expanded && (
        <tr id={`audit-detail-${row._id}`}>
          <td colSpan={colCount} className="p-0">
            <div className="bg-[#fafbfc] border-t border-[#0B2343]/[0.06] p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1">
                    Before
                  </p>
                  <pre className="text-xs bg-white border border-[#0B2343]/[0.06] p-2 rounded-md overflow-auto max-h-72 text-[#0B2343]/80">
                    {row.before_state == null
                      ? "(none)"
                      : JSON.stringify(row.before_state, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1">
                    After
                  </p>
                  <pre className="text-xs bg-white border border-[#0B2343]/[0.06] p-2 rounded-md overflow-auto max-h-72 text-[#0B2343]/80">
                    {row.after_state == null
                      ? "(none)"
                      : JSON.stringify(row.after_state, null, 2)}
                  </pre>
                </div>
              </div>
              {row.compliance_config_version !== null && (
                <div className="mt-3 pt-3 border-t border-[#0B2343]/[0.06]">
                  <p className="text-[11px] text-[#0B2343]/65">
                    Compliance config version:{" "}
                    <strong className="font-bold text-[#0B2343]">
                      {row.compliance_config_version}
                    </strong>
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
