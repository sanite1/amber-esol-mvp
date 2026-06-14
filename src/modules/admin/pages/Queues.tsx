/**
 * Amber-admin Queues page — Final Addendum §1.
 *
 * Route: /admin/queues  (this page, NOT Bull Board itself — Bull
 * Board is mounted at the same path on the backend without the
 * React-Router shell so the path is shared by design.)
 *
 * Layout:
 *   1. Header + explainer paragraph naming the nine queues.
 *   2. Top-of-page totals strip (waiting / active / failed / delayed
 *      / completed across every queue).
 *   3. Per-queue table with each queue's counts and a "needs
 *      attention" highlight on rows with failures or backlog.
 *   4. "Open Bull Board" button that fetches the signed link and
 *      opens it in a new tab.
 *
 * Polling: useQueueSummary refetches every 5s while the tab is
 * visible. Totals are `aria-live="polite"`.
 */

import { ExternalLink, Activity, AlertOctagon } from "lucide-react";
import { useQueueSummary, useBullBoardLink } from "../api/queuesApi";
import type {
  QueueCounts,
  QueueName,
  QueueSummaryRow,
} from "../lib/types/queues";

const QUEUE_DESCRIPTIONS: Record<QueueName, string> = {
  "esol-session":
    "Live AI tutor session events — turn grading, evidence capture, vocab ledger updates.",
  "rarpa-evidence":
    "Per-learner RARPA stage compiles and consolidated evidence-report PDF generation.",
  "ilr-export":
    "Monthly ILR CSV + companion-JSON exports for the ESFA submission window.",
  "compliance-validation":
    "Green-light validation of artefacts before MIS push.",
  "mis-push":
    "ProSolution / Maytas / EBS submission jobs for validated artefacts.",
  "priority-queue": "Daily progression sweeps + teacher prep scoring.",
  "delta-sync": "MIS delta sync — incremental learner updates.",
  notifications:
    "Email + in-app + SMS notification dispatch (incl. safeguarding alerts).",
  "cache-refresh":
    "Long-running cache loads — postcode dataset and FALA whitelist.",
};

const ALL_QUEUE_NAMES: QueueName[] = [
  "esol-session",
  "rarpa-evidence",
  "ilr-export",
  "compliance-validation",
  "mis-push",
  "priority-queue",
  "delta-sync",
  "notifications",
  "cache-refresh",
];

// ── Totals strip ──

interface TotalsTileProps {
  label: string;
  value: number;
  emphasis?: "danger" | "warn" | "neutral";
}

function TotalsTile({ label, value, emphasis = "neutral" }: TotalsTileProps) {
  const tone =
    emphasis === "danger"
      ? "text-red-700"
      : emphasis === "warn"
        ? "text-amber-700"
        : "text-[#0B2343]";
  return (
    <div className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
        {label}
      </p>
      <p
        className={`text-xl sm:text-2xl font-extrabold tabular-nums leading-tight mt-0.5 ${tone}`}
        aria-live="polite"
      >
        {value.toLocaleString("en-GB")}
      </p>
    </div>
  );
}

function TotalsStrip({ totals }: { totals: QueueCounts }) {
  return (
    <div
      role="group"
      aria-label="Platform-wide queue totals"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
    >
      <TotalsTile label="Waiting" value={totals.waiting} />
      <TotalsTile label="Active" value={totals.active} />
      <TotalsTile
        label="Failed"
        value={totals.failed}
        emphasis={totals.failed > 0 ? "danger" : "neutral"}
      />
      <TotalsTile
        label="Delayed"
        value={totals.delayed}
        emphasis={totals.delayed > 50 ? "warn" : "neutral"}
      />
      <TotalsTile label="Completed" value={totals.completed} />
    </div>
  );
}

// ── Per-queue row helper ──

function QueueRow({ row }: { row: QueueSummaryRow }) {
  const hasFailures = row.counts.failed > 0;
  return (
    <tr
      className={`border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc] ${
        row.needs_attention ? "bg-amber-50/40" : ""
      }`}
    >
      <td className="align-top px-4 sm:px-5 py-3">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-[#0B2343]">{row.name}</span>
          {row.needs_attention && (
            <span
              aria-label={
                hasFailures
                  ? "Queue has failed jobs"
                  : "Queue backlog exceeds threshold"
              }
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-200 bg-amber-50 text-amber-800 whitespace-nowrap"
            >
              <AlertOctagon size={10} aria-hidden="true" />
              {hasFailures ? "Failures" : "Backlog"}
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#0B2343]/55 leading-snug">
          {QUEUE_DESCRIPTIONS[row.name]}
        </p>
      </td>
      <td className="align-top px-4 sm:px-5 py-3 text-right tabular-nums text-[#0B2343]/85">
        {row.counts.waiting}
      </td>
      <td className="align-top px-4 sm:px-5 py-3 text-right tabular-nums text-[#0B2343]/85">
        {row.counts.active}
      </td>
      <td
        className={`align-top px-4 sm:px-5 py-3 text-right tabular-nums ${
          row.counts.failed > 0 ? "text-red-700 font-bold" : "text-[#0B2343]/85"
        }`}
      >
        {row.counts.failed}
      </td>
      <td className="align-top px-4 sm:px-5 py-3 text-right tabular-nums text-[#0B2343]/85">
        {row.counts.delayed}
      </td>
      <td className="align-top px-4 sm:px-5 py-3 text-right tabular-nums text-[#0B2343]/85">
        {row.counts.completed}
      </td>
    </tr>
  );
}

export default function AdminQueuesPage() {
  const { data, isLoading, isError, error } = useQueueSummary();
  const link = useBullBoardLink();

  const summary = data?.data;
  const linkUrl = link.data?.data?.url;

  const handleOpenBullBoard = () => {
    if (!linkUrl) return;
    window.open(linkUrl, "_blank", "noopener,noreferrer");
  };

  const rows: QueueSummaryRow[] =
    summary?.queues ??
    ALL_QUEUE_NAMES.map((name) => ({
      name,
      counts: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
      needs_attention: false,
    }));

  return (
    <main className="space-y-4 sm:space-y-5">
      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="w-9 h-9 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
              >
                <Activity size={16} />
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight">
                Queues
              </h1>
            </div>
            <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed max-w-3xl">
              Live BullMQ job counts across the nine background queues. The
              deep-dive UI is Bull Board — click below to open it in a new tab.
              Bull Board surfaces per-job payloads, retry history, manual retry
              / discard, and Redis-level metrics this summary page deliberately
              omits.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenBullBoard}
            disabled={!linkUrl}
            aria-label="Open the Bull Board admin UI in a new tab"
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors whitespace-nowrap"
          >
            <ExternalLink size={14} aria-hidden="true" />
            Open Bull Board
          </button>
        </div>
      </section>

      {link.data?.data?.notes && (
        <div
          role="status"
          className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
        >
          {link.data.data.notes}
        </div>
      )}

      {link.isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          Bull Board link unavailable:{" "}
          {link.error?.message ??
            "BULL_BOARD_TOKEN may not be configured on the server."}
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error?.message ?? "Failed to load queue summary."}
        </div>
      )}

      {/* ── Totals strip ── */}
      {isLoading || !summary ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[84px] rounded-2xl bg-[#0B2343]/[0.06] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <TotalsStrip totals={summary.totals} />
      )}

      {/* ── Per-queue table ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] overflow-hidden">
        <header className="px-5 sm:px-6 pt-5 pb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
            Per-queue counts
          </h2>
        </header>
        <div className="overflow-x-auto">
          <table
            aria-label="BullMQ queues"
            className="w-full min-w-[680px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <th
                  scope="col"
                  className="text-left px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 w-2/5"
                >
                  Queue
                </th>
                <th
                  scope="col"
                  className="text-right px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Waiting
                </th>
                <th
                  scope="col"
                  className="text-right px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Active
                </th>
                <th
                  scope="col"
                  className="text-right px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Failed
                </th>
                <th
                  scope="col"
                  className="text-right px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Delayed
                </th>
                <th
                  scope="col"
                  className="text-right px-4 sm:px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Completed
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? ALL_QUEUE_NAMES.map((n) => (
                    <tr
                      key={`s-${n}`}
                      className="border-t border-[#0B2343]/[0.06]"
                    >
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 sm:px-5 py-3">
                          <div className="h-3 rounded bg-[#0B2343]/[0.08] animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((row) => <QueueRow key={row.name} row={row} />)}
            </tbody>
          </table>
        </div>
      </section>

      {summary?.generated_at && (
        <p aria-live="polite" className="text-[11px] text-[#0B2343]/45">
          Updated {new Date(summary.generated_at).toLocaleString("en-GB")} —
          refreshes every 5 seconds.
        </p>
      )}
    </main>
  );
}
