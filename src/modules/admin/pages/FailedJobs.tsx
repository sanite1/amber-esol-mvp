/**
 * Amber-admin Failed Jobs review — Final Addendum §1.
 *
 * Route: /admin/failed-jobs
 *
 * Layout:
 *   1. Header + "Show dismissed" toggle.
 *   2. Per-queue chip strip (counts of unresolved failures) — clicking
 *      a chip filters to that queue.
 *   3. Date range filters (from / to).
 *   4. Table — newest first, grouped visually by queue. Each row
 *      expands on click to reveal the full error string and the
 *      `job_data` JSON.
 *   5. Per-row Retry + Dismiss buttons.
 */

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronRight,
  X as XIcon,
  Loader2,
} from "lucide-react";

import {
  useFailedJobs,
  useRetryFailedJob,
  useDismissFailedJob,
} from "../api/failedJobsApi";
import type { FailedJobRow } from "../lib/types/failedJobs";

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const truncate = (s: string, max = 120): string =>
  s.length <= max ? s : `${s.slice(0, max - 1)}…`;

const formatJobData = (v: unknown): string => {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
};

const groupByQueue = (
  rows: FailedJobRow[],
): Array<{ queue: string; rows: FailedJobRow[] }> => {
  const map = new Map<string, FailedJobRow[]>();
  for (const r of rows) {
    if (!map.has(r.queue_name)) map.set(r.queue_name, []);
    map.get(r.queue_name)!.push(r);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([queue, queueRows]) => ({ queue, rows: queueRows }));
};

function ExpandedDetail({ row }: { row: FailedJobRow }) {
  return (
    <div className="bg-[#fafbfc] border-t border-[#0B2343]/[0.06] p-4">
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
            Error
          </p>
          <pre className="text-xs font-mono text-[#0B2343]/85 whitespace-pre-wrap break-words mt-1 leading-relaxed">
            {row.error}
          </pre>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
            Job data
          </p>
          <pre className="text-xs font-mono bg-white border border-[#0B2343]/[0.06] rounded-md p-2 mt-1 max-h-72 overflow-auto leading-relaxed text-[#0B2343]/80">
            {formatJobData(row.job_data)}
          </pre>
        </div>
        {row.retried_at && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-2 text-xs text-sky-900">
            Re-enqueued at {formatDateTime(row.retried_at)}. The original
            failure row remains for audit.
          </div>
        )}
        {row.dismissed && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
            Dismissed at{" "}
            {row.dismissed_at ? formatDateTime(row.dismissed_at) : "—"}.
          </div>
        )}
      </div>
    </div>
  );
}

interface RowProps {
  row: FailedJobRow;
  expanded: boolean;
  onToggle: () => void;
  onRetry: () => void;
  onDismiss: () => void;
  retryingId: string | null;
  dismissingId: string | null;
}

function FailedJobTableRow({
  row,
  expanded,
  onToggle,
  onRetry,
  onDismiss,
  retryingId,
  dismissingId,
}: RowProps) {
  const isBusyRetry = retryingId === row._id;
  const isBusyDismiss = dismissingId === row._id;

  const rowTone = row.dismissed
    ? "opacity-55"
    : row.retried_at
      ? "bg-sky-50/30"
      : "";

  return (
    <>
      <tr
        onClick={onToggle}
        role="button"
        aria-expanded={expanded}
        className={`border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc] cursor-pointer ${rowTone}`}
      >
        <td className="align-top px-2 py-3 w-9">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label={expanded ? "Collapse row" : "Expand row"}
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[#0B2343]/55 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
          >
            {expanded ? (
              <ChevronDown size={14} aria-hidden="true" />
            ) : (
              <ChevronRight size={14} aria-hidden="true" />
            )}
          </button>
        </td>
        <td className="align-top px-3 py-3">
          <p className="text-xs font-mono text-[#0B2343]/85">{row.job_id}</p>
        </td>
        <td className="align-top px-3 py-3">
          <p
            title={row.error}
            className="text-xs text-[#0B2343]/85 max-w-[420px]"
          >
            {truncate(row.error)}
          </p>
        </td>
        <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/85">
          {row.attempts}
        </td>
        <td className="align-top px-3 py-3 text-xs text-[#0B2343]/70 whitespace-nowrap tabular-nums">
          {formatDateTime(row.created_at)}
        </td>
        <td className="align-top px-3 py-3">
          <div className="flex gap-1">
            {row.retried_at && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-sky-200 bg-sky-50 text-sky-800 whitespace-nowrap">
                Retried
              </span>
            )}
            {row.dismissed && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/55 bg-white whitespace-nowrap">
                Dismissed
              </span>
            )}
          </div>
        </td>
        <td
          className="align-top px-3 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={onRetry}
              disabled={isBusyRetry || isBusyDismiss}
              aria-label={`Retry failed job ${row.job_id}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] rounded-lg bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              {isBusyRetry ? (
                <Loader2
                  size={12}
                  aria-hidden="true"
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={12} aria-hidden="true" />
              )}
              Retry
            </button>
            <button
              type="button"
              onClick={onDismiss}
              disabled={isBusyRetry || isBusyDismiss || row.dismissed}
              aria-label={`Dismiss failed job ${row.job_id}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 min-h-[32px] rounded-lg bg-white border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 transition-colors"
            >
              {isBusyDismiss ? (
                <Loader2
                  size={12}
                  aria-hidden="true"
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={12} aria-hidden="true" />
              )}
              Dismiss
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="p-0 border-0">
            <ExpandedDetail row={row} />
          </td>
        </tr>
      )}
    </>
  );
}

export default function FailedJobsPage() {
  const [queue, setQueue] = useState<string>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [includeDismissed, setIncludeDismissed] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useFailedJobs({
    queue: queue || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
    limit: 25,
    include_dismissed: includeDismissed,
  });

  const retry = useRetryFailedJob();
  const dismiss = useDismissFailedJob();

  const payload = data?.data;
  const grouped = useMemo(
    () => groupByQueue(payload?.jobs ?? []),
    [payload?.jobs],
  );

  return (
    <main className="space-y-4 sm:space-y-5">
      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center"
              >
                <AlertTriangle size={16} />
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight">
                Failed jobs
              </h1>
            </div>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
              BullMQ jobs that exhausted all retries. Each row is the durable
              audit record; retry re-enqueues a fresh copy with the same data.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <button
              type="button"
              role="switch"
              aria-checked={includeDismissed}
              aria-label="Include dismissed failures"
              onClick={() => {
                setIncludeDismissed((v) => !v);
                setPage(1);
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 ${
                includeDismissed ? "bg-[#ff7c22]" : "bg-[#0B2343]/15"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-1 inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-out ${
                  includeDismissed ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-[#0B2343]">Show dismissed</span>
          </label>
        </div>
      </section>

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error?.message ?? "Failed to load failed jobs."}
        </div>
      )}

      {/* ── Per-queue chip filters ── */}
      <div
        role="group"
        aria-label="Filter by queue"
        className="flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={queue === ""}
          onClick={() => {
            setQueue("");
            setPage(1);
          }}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 ${
            queue === ""
              ? "bg-[#ff7c22] text-white border-[#ff7c22]"
              : "bg-white text-[#0B2343]/70 border-[#0B2343]/[0.12] hover:border-[#ff7c22]/40 hover:bg-[#fff8ee]"
          }`}
        >
          All queues
        </button>
        {(payload?.by_queue ?? []).map((g) => {
          const active = queue === g.queue_name;
          return (
            <button
              key={g.queue_name}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setQueue(active ? "" : g.queue_name);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 ${
                active
                  ? "bg-[#ff7c22] text-white border-[#ff7c22]"
                  : "bg-white text-[#0B2343]/70 border-[#0B2343]/[0.12] hover:border-[#ff7c22]/40 hover:bg-[#fff8ee]"
              }`}
            >
              {g.queue_name} ({g.count})
              {active && <XIcon size={11} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* ── Date range ── */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <label className="block sm:min-w-[220px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            From
          </span>
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
          />
        </label>
        <label className="block sm:min-w-[220px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
            To
          </span>
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
          />
        </label>
        {(from || to) && (
          <button
            type="button"
            onClick={() => {
              setFrom("");
              setTo("");
              setPage(1);
            }}
            aria-label="Clear date range filters"
            className="text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 sm:mb-2.5"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table
            aria-label="Failed jobs"
            className="w-full min-w-[920px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <th scope="col" aria-hidden="true" className="w-9 px-2 py-3" />
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Job ID
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Error
                </th>
                <th
                  scope="col"
                  className="text-right px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Attempts
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Failed at
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading || !payload ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr
                    key={`s-${i}`}
                    className="border-t border-[#0B2343]/[0.06]"
                  >
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-3 rounded bg-[#0B2343]/[0.08] animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : grouped.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-sm text-[#0B2343]/55"
                  >
                    No failed jobs match the current filters.
                  </td>
                </tr>
              ) : (
                grouped.map((group) => (
                  <React.Fragment key={`grp-${group.queue}`}>
                    <tr className="bg-[#0B2343]/[0.04]">
                      <td colSpan={7} className="px-3 py-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/70">
                          {group.queue}{" "}
                          <span className="font-normal text-[#0B2343]/45">
                            ({group.rows.length} in this page)
                          </span>
                        </p>
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <FailedJobTableRow
                        key={row._id}
                        row={row}
                        expanded={expandedId === row._id}
                        onToggle={() =>
                          setExpandedId((cur) =>
                            cur === row._id ? null : row._id,
                          )
                        }
                        onRetry={() => retry.mutate(row._id)}
                        onDismiss={() => dismiss.mutate(row._id)}
                        retryingId={
                          retry.isPending ? (retry.variables ?? null) : null
                        }
                        dismissingId={
                          dismiss.isPending ? (dismiss.variables ?? null) : null
                        }
                      />
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {payload && payload.pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={payload.pagination.page <= 1}
            aria-label="Previous page"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#0B2343]/70 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
          >
            ‹
          </button>
          <span className="text-xs text-[#0B2343]/65 tabular-nums px-3">
            Page {payload.pagination.page} of {payload.pagination.total_pages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((p) => Math.min(payload.pagination.total_pages, p + 1))
            }
            disabled={payload.pagination.page >= payload.pagination.total_pages}
            aria-label="Next page"
            className="inline-flex items-center justify-center w-9 h-9 rounded-md text-[#0B2343]/70 hover:text-[#0B2343] hover:bg-[#0B2343]/[0.06] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
          >
            ›
          </button>
        </div>
      )}

      {payload && (
        <p aria-live="polite" className="text-[11px] text-[#0B2343]/45">
          {payload.pagination.total} failed job
          {payload.pagination.total === 1 ? "" : "s"} match the filters.
        </p>
      )}
    </main>
  );
}
