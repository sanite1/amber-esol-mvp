/**
 * Amber-admin cross-organisation audit search — Final Addendum §6.
 *
 * The one audit surface that is NOT org-scoped: support and
 * compliance investigations can search every organisation's audit
 * trail in one place, filtered by org, action, learner id and date
 * range. Results carry the org name per row so a cross-org list is
 * readable at a glance.
 */
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ScrollText,
  Search,
} from "lucide-react";
import { useAdminAuditSearch } from "../api/auditSearchApi";
import { useAdminOrgsOverview } from "../api/adminOrgsApi";

const PER_PAGE = 50;

const KNOWN_ACTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "All actions" },
  { value: "learner_registered", label: "Learner registered" },
  { value: "learner_bulk_imported", label: "Learner bulk imported" },
  { value: "session_completed", label: "Session completed" },
  { value: "rarpa_stage_advanced", label: "RARPA stage advanced" },
  { value: "ilr_record_generated", label: "ILR record generated" },
  { value: "mis_push_completed", label: "MIS push completed" },
  { value: "mis_push_held", label: "MIS push held" },
  { value: "green_light_passed", label: "Green-light passed" },
  { value: "safeguarding_alert_raised", label: "Safeguarding alert raised" },
  { value: "teacher_review_logged", label: "Teacher review logged" },
  { value: "teacher_message_sent", label: "Teacher message sent" },
  { value: "pathway_override_set", label: "Pathway override set" },
  { value: "level_change_confirmed", label: "Level change confirmed" },
  { value: "placement_completed", label: "Placement completed" },
  { value: "stage5_review_generated", label: "Stage 5 review generated" },
  { value: "cohort_status_changed", label: "Cohort status changed" },
  { value: "learner_nudge_sent", label: "Learner nudge sent" },
];

const formatTimestamp = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AuditSearch() {
  const [orgId, setOrgId] = useState("");
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [orgId, action, from, to]);

  const { data: orgsData } = useAdminOrgsOverview();
  const orgs = orgsData?.data?.orgs ?? [];

  const { data, isLoading, isError } = useAdminAuditSearch({
    org_id: orgId || undefined,
    action: action || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    limit: PER_PAGE,
  });

  const rows = data?.data?.rows ?? [];
  const pagination = data?.data?.pagination;

  return (
    <main
      aria-labelledby="audit-search-heading"
      className="space-y-4 sm:space-y-5"
    >
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ScrollText size={18} className="text-[#ff7c22]" aria-hidden="true" />
          <h1
            id="audit-search-heading"
            className="text-xl sm:text-2xl font-extrabold text-[#0B2343] leading-tight"
          >
            Cross-organisation audit search
          </h1>
        </div>
        <p className="text-sm text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
          Every compliance event across every organisation, searchable in one
          place — for support, investigation, and compliance reporting. The
          audit trail is append-only; nothing here can be edited or deleted.
        </p>
      </section>

      {/* Filters */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 flex flex-wrap gap-3">
        <div>
          <label
            htmlFor="audit-org"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1"
          >
            Organisation
          </label>
          <select
            id="audit-org"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            className="px-3 py-2.5 min-h-[44px] rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors min-w-[180px]"
          >
            <option value="">All organisations</option>
            {orgs.map((o) => (
              <option key={o.org_id} value={o.org_id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="audit-action"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1"
          >
            Action
          </label>
          <select
            id="audit-action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="px-3 py-2.5 min-h-[44px] rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none cursor-pointer focus:border-[#ff7c22]/40 focus:bg-white transition-colors min-w-[180px]"
          >
            {KNOWN_ACTIONS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="audit-from"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1"
          >
            From
          </label>
          <input
            id="audit-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2.5 min-h-[44px] rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="audit-to"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1"
          >
            To
          </label>
          <input
            id="audit-to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2.5 min-h-[44px] rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
          />
        </div>
      </section>

      {/* Results */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2
              size={24}
              className="text-[#ff7c22] animate-spin mx-auto mb-2"
              aria-hidden="true"
            />
            <p className="text-sm text-[#0B2343]/40">
              Searching the audit trail…
            </p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-sm text-red-700">
            Audit search failed — check the filters and try again.
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">
            <Search
              size={20}
              className="text-[#0B2343]/25 mx-auto mb-2"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-[#0B2343]">
              No audit events match
            </p>
            <p className="text-xs text-[#0B2343]/40 mt-1">
              Widen the date range or clear a filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="w-full min-w-[900px] border-collapse text-sm"
              aria-label="Cross-organisation audit events"
            >
              <thead className="bg-[#fafbfc]">
                <tr>
                  {[
                    "When",
                    "Organisation",
                    "Action",
                    "Actor",
                    "Learner",
                    "Reason",
                    "Config v.",
                  ].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r._id}
                    className="border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc] align-top"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-[#0B2343]/75 tabular-nums">
                      {formatTimestamp(r.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-[#0B2343] font-semibold">
                      {r.org_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-[#0B2343]/[0.05] text-[11px] font-bold text-[#0B2343]/70 whitespace-nowrap">
                        {r.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#0B2343]/75 whitespace-nowrap">
                      {r.actor_name ?? r.actor_type}
                    </td>
                    <td className="px-4 py-3 text-[#0B2343]/75 whitespace-nowrap">
                      {r.learner_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#0B2343]/70 leading-snug max-w-[360px]">
                      {r.reason}
                    </td>
                    <td className="px-4 py-3 text-[#0B2343]/55 tabular-nums">
                      {r.compliance_config_version ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#0B2343]/[0.06]">
            <p className="text-xs text-[#0B2343]/50">
              Page {pagination.page} of {pagination.total_pages} ·{" "}
              {pagination.total} events
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
                className="p-2.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-[#fafbfc] transition-colors"
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={page >= pagination.total_pages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
                className="p-2.5 rounded-md border border-[#0B2343]/[0.08] disabled:opacity-30 hover:bg-[#fafbfc] transition-colors"
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
