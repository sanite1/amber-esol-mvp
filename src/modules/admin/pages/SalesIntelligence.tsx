/**
 * Amber-admin Sales Intelligence — Final Addendum §13.
 *
 * Route: /admin/sales-intelligence
 *
 * Layout:
 *   1. Header — title + Export-CSV button.
 *   2. Four metric cards: total / pending / contacted / pipeline £.
 *   3. Filter strip — contacted toggle, from/to dates, org-type
 *      dropdown.
 *   4. Table — paginated, sortable by submitted_at, with a
 *      "Mark contacted" CTA per row.
 */

import { useMemo, useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  Download,
  Inbox,
  Mail,
  PoundSterling,
  Loader2,
} from "lucide-react";

import {
  useMarkRoiSubmissionContacted,
  useRoiSubmissions,
} from "../api/salesIntelligenceApi";
import type {
  ListRoiSubmissionsQuery,
  RoiOrgType,
  RoiSubmissionRow,
} from "../lib/types/salesIntelligence";

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
const formatGbp = (n: number): string => GBP.format(n);

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (iso: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ORG_TYPE_LABEL: Record<RoiOrgType, string> = {
  college: "FE college",
  council: "Council",
  charity: "Charity",
  employer: "Employer",
};

// ── CSV export ──

const CSV_COLUMNS: Array<{
  header: string;
  pick: (r: RoiSubmissionRow) => string;
}> = [
  { header: "Submitted at", pick: (r) => r.submitted_at },
  { header: "Org name", pick: (r) => r.org_name ?? "" },
  { header: "Org type", pick: (r) => r.org_type ?? "" },
  { header: "Contact name", pick: (r) => r.contact_name ?? "" },
  { header: "Contact email", pick: (r) => r.contact_email ?? "" },
  { header: "Waiting list", pick: (r) => String(r.waiting_list_size) },
  { header: "ASF rate (£)", pick: (r) => String(r.avg_asf_rate) },
  {
    header: "Current throughput",
    pick: (r) => String(r.current_throughput_per_year),
  },
  {
    header: "Unclaimed annual (£)",
    pick: (r) => String(r.unclaimed_income_annual),
  },
  {
    header: "Payback (weeks)",
    pick: (r) => (r.payback_weeks == null ? "" : String(r.payback_weeks)),
  },
  { header: "Contacted at", pick: (r) => r.contacted_at ?? "" },
  { header: "Contacted by", pick: (r) => r.contacted_by_name ?? "" },
];

const csvCell = (raw: string): string => {
  if (/[",\n\r]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
};

const buildCsv = (rows: RoiSubmissionRow[]): string => {
  const lines = [CSV_COLUMNS.map((c) => csvCell(c.header)).join(",")];
  for (const r of rows) {
    lines.push(CSV_COLUMNS.map((c) => csvCell(c.pick(r))).join(","));
  }
  return lines.join("\r\n");
};

const downloadCsv = (rows: RoiSubmissionRow[]): void => {
  const csv = buildCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `roi_submissions_${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  caption: string;
  tone?: "default" | "warning" | "success";
}

const TONE_BORDER: Record<
  NonNullable<MetricCardProps["tone"]>,
  string | undefined
> = {
  default: undefined,
  warning: "#d97706",
  success: "#059669",
};

function MetricCard({
  icon,
  label,
  value,
  caption,
  tone = "default",
}: MetricCardProps) {
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
        <div className="h-9 w-20 rounded bg-[#0B2343]/[0.08] animate-pulse" />
      ) : (
        <p
          aria-label={`${label}: ${value}`}
          className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tabular-nums leading-tight"
        >
          {value}
        </p>
      )}
      <p className="text-[11px] text-[#0B2343]/55 mt-1 leading-snug">
        {caption}
      </p>
    </div>
  );
}

export default function SalesIntelligencePage() {
  const [contacted, setContacted] = useState<"" | "true" | "false">("false");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [orgType, setOrgType] = useState<RoiOrgType | "">("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    setPage(1);
  }, [contacted, from, to, orgType]);

  const query: ListRoiSubmissionsQuery = useMemo(
    () => ({
      contacted: contacted || undefined,
      from: from || undefined,
      to: to || undefined,
      org_type: orgType || undefined,
      page,
      limit: rowsPerPage,
    }),
    [contacted, from, to, orgType, page, rowsPerPage],
  );

  const listQuery = useRoiSubmissions(query);
  const markMutation = useMarkRoiSubmissionContacted();

  const data = listQuery.data?.data;
  const submissions = data?.submissions ?? [];
  const aggregates = data?.aggregates;
  const total = data?.pagination.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));

  const [announce, setAnnounce] = useState("");
  useEffect(() => {
    if (listQuery.isFetching) return;
    const bits: string[] = [`${total} submission${total === 1 ? "" : "s"}`];
    if (contacted === "false") bits.push("pending follow-up");
    if (contacted === "true") bits.push("already contacted");
    if (orgType) bits.push(ORG_TYPE_LABEL[orgType]);
    setAnnounce(`Showing ${bits.join(", ")}.`);
  }, [total, contacted, orgType, listQuery.isFetching]);

  return (
    <main
      aria-labelledby="sales-intel-heading"
      className="space-y-4 sm:space-y-5"
    >
      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="min-w-0">
            <h1
              id="sales-intel-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight"
            >
              Sales intelligence
            </h1>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed">
              ROI calculator submissions — outstanding leads first.
            </p>
          </div>
          <button
            type="button"
            onClick={() => downloadCsv(submissions)}
            disabled={submissions.length === 0}
            aria-label="Download the current page of submissions as CSV"
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors whitespace-nowrap"
          >
            <Download size={14} aria-hidden="true" />
            Export CSV ({submissions.length})
          </button>
        </div>
      </section>

      {listQuery.isError && (
        <div
          role="status"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          Couldn't load submissions. Try refreshing in a moment.
        </div>
      )}

      {/* SR-only live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announce}
      </div>

      {/* ── Aggregate strip ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          icon={<Inbox size={16} aria-hidden="true" />}
          label="Total in scope"
          value={aggregates ? String(aggregates.total_count) : null}
          caption="Matching the current filters."
        />
        <MetricCard
          icon={<Clock size={16} aria-hidden="true" />}
          label="Pending follow-up"
          value={aggregates ? String(aggregates.pending_count) : null}
          caption="Not yet marked as contacted."
          tone="warning"
        />
        <MetricCard
          icon={<CheckCircle2 size={16} aria-hidden="true" />}
          label="Already contacted"
          value={aggregates ? String(aggregates.contacted_count) : null}
          caption="Followed up by an Amber admin."
          tone="success"
        />
        <MetricCard
          icon={<PoundSterling size={16} aria-hidden="true" />}
          label="Pipeline (unclaimed)"
          value={
            aggregates ? formatGbp(aggregates.total_unclaimed_pipeline) : null
          }
          caption="Sum of unclaimed annual ASF across the filter set."
        />
      </div>

      {/* ── Filters ── */}
      {/* min-w-0 overrides the fieldset UA default min-inline-size:
          min-content (prevents viewport overflow); flex-wrap lets the
          controls drop rows instead of stretching. */}
      <fieldset className="min-w-0 rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5">
        <legend className="sr-only">Submission filters</legend>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <label className="block sm:min-w-[180px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Status
            </span>
            <select
              value={contacted}
              onChange={(e) =>
                setContacted((e.target.value as "" | "true" | "false") ?? "")
              }
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            >
              <option value="">All</option>
              <option value="false">Pending follow-up</option>
              <option value="true">Already contacted</option>
            </select>
          </label>

          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              From
            </span>
            <input
              type="date"
              value={from}
              max={to || undefined}
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
              min={from || undefined}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            />
          </label>

          <label className="block sm:min-w-[200px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Org type
            </span>
            <select
              value={orgType}
              onChange={(e) =>
                setOrgType((e.target.value as RoiOrgType | "") ?? "")
              }
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
            >
              <option value="">All</option>
              <option value="college">FE college</option>
              <option value="council">Council</option>
              <option value="charity">Charity</option>
              <option value="employer">Employer</option>
            </select>
          </label>
        </div>
      </fieldset>

      {/* ── Table ── */}
      <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table
            aria-labelledby="sales-intel-heading"
            aria-busy={listQuery.isFetching}
            className="w-full min-w-[1000px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Submitted
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Organisation
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="text-right px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Waiting list
                </th>
                <th
                  scope="col"
                  className="text-right px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Unclaimed / yr
                </th>
                <th
                  scope="col"
                  className="text-right px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Payback
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="text-right px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {listQuery.isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={`sk-${i}`}
                    className="border-t border-[#0B2343]/[0.06]"
                  >
                    <td colSpan={8} className="px-3 py-3">
                      <div className="h-5 rounded bg-[#0B2343]/[0.08] animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : submissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-sm text-[#0B2343]/55"
                  >
                    No submissions match the current filters.
                  </td>
                </tr>
              ) : (
                submissions.map((r) => {
                  const isContacted = Boolean(r.contacted_at);
                  const isPending =
                    markMutation.isPending &&
                    markMutation.variables?.submissionId === r._id;
                  return (
                    <tr
                      key={r._id}
                      aria-busy={isPending}
                      className={`border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc] ${
                        isContacted ? "" : "bg-amber-50/30"
                      }`}
                    >
                      <td className="align-top px-3 py-3">
                        <p className="text-sm text-[#0B2343]">
                          {formatDate(r.submitted_at)}
                        </p>
                        <p className="text-[11px] text-[#0B2343]/55">
                          {formatDateTime(r.submitted_at).split(" · ")[0]}
                        </p>
                      </td>
                      <td className="align-top px-3 py-3">
                        <p className="font-bold text-[#0B2343]">
                          {r.org_name ?? "(anonymous)"}
                        </p>
                        {r.org_type && (
                          <p className="text-[11px] text-[#0B2343]/55">
                            {ORG_TYPE_LABEL[r.org_type]}
                          </p>
                        )}
                      </td>
                      <td className="align-top px-3 py-3">
                        {r.contact_email ? (
                          <>
                            <p className="text-sm text-[#0B2343]">
                              {r.contact_name ?? "(no name)"}
                            </p>
                            <a
                              href={`mailto:${r.contact_email}`}
                              className="text-[11px] text-[#ff7c22] hover:text-[#e56a10] block"
                            >
                              {r.contact_email}
                            </a>
                          </>
                        ) : (
                          <p className="text-[11px] text-[#0B2343]/55">
                            Anonymous submission
                          </p>
                        )}
                      </td>
                      <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                        {r.waiting_list_size.toLocaleString("en-GB")}
                      </td>
                      <td className="align-top px-3 py-3 text-right">
                        <span className="font-bold text-[#0B2343] tabular-nums">
                          {formatGbp(r.unclaimed_income_annual)}
                        </span>
                      </td>
                      <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
                        {r.payback_weeks == null ? "—" : `${r.payback_weeks}w`}
                      </td>
                      <td className="align-top px-3 py-3">
                        {isContacted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200 whitespace-nowrap">
                            <CheckCircle2 size={11} aria-hidden="true" />
                            Contacted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-amber-50 text-amber-800 border-amber-200 whitespace-nowrap">
                            <Clock size={11} aria-hidden="true" />
                            Pending
                          </span>
                        )}
                        {isContacted && (
                          <p className="text-[10px] text-[#0B2343]/55 mt-1">
                            {r.contacted_by_name ?? "Amber admin"} ·{" "}
                            {formatDate(r.contacted_at)}
                          </p>
                        )}
                      </td>
                      <td className="align-top px-3 py-3 text-right">
                        {isContacted ? (
                          r.contact_email ? (
                            <a
                              href={`mailto:${r.contact_email}?subject=Following%20up%20on%20your%20Project%20Silk%20ROI%20analysis`}
                              title="Send another note"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] rounded-lg text-[#0B2343] text-xs font-bold hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
                            >
                              <Mail size={12} aria-hidden="true" />
                              Email
                            </a>
                          ) : (
                            <span className="text-[11px] text-[#0B2343]/55">
                              —
                            </span>
                          )
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              markMutation.mutate({ submissionId: r._id })
                            }
                            disabled={isPending}
                            aria-label={`Mark ${r.org_name ?? "this submission"} as contacted`}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 transition-colors whitespace-nowrap"
                          >
                            {isPending ? (
                              <Loader2
                                size={12}
                                aria-hidden="true"
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2 size={12} aria-hidden="true" />
                            )}
                            {isPending ? "Marking…" : "Mark contacted"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
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
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10) || 50);
                    setPage(1);
                  }}
                  className="rounded-md border border-[#0B2343]/[0.12] bg-white px-2 py-1 text-xs text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
                >
                  {[25, 50, 100, 200].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <span className="text-[#0B2343]/45">·</span>
              <span aria-live="polite" className="tabular-nums">
                {`${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, total)} of ${total}`}
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
    </main>
  );
}
