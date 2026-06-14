/**
 * MIS Sync section for the OrgDetail page —
 * Phase 4 / Final Addendum §7 (BE-D).
 *
 * Three sub-sections:
 *   1. Header row — last successful push timestamp + "Sync now" CTA
 *   2. Conflicts panel — unresolved FailedJob rows with "Resolve" action
 *   3. Recent activity — paginated audit log of MIS-related events
 *
 * Accessibility (WCAG 2.1 AA)
 * ==========================
 *
 *   - Card is a <section> with aria-labelledby tied to its h2.
 *   - Summary chips carry text labels alongside colour (colour-alone
 *     fails 1.4.1).
 *   - Each row's "Resolve" button has an aria-label including a human
 *     reference ("Resolve conflict for ULN …" / "for batch of N records").
 *   - Loading + error states use role="status"/"alert" so they're
 *     announced when react-query swaps in.
 */

import { useState } from "react";
import {
  RefreshCw,
  AlertTriangle,
  ScrollText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Modal from "../../../components/Modal";

import {
  useMisSyncLogs,
  useMisConflicts,
  useTriggerMisSyncNow,
  useResolveMisConflict,
  type MisConflictRow,
  type MisSyncLogRow,
} from "../api/misSyncApi";

const ACTION_LABEL: Record<string, string> = {
  mis_push_completed: "Push completed",
  mis_push_held: "Push held by validation",
  mis_delta_discrepancy: "Delta-sync discrepancy",
  mis_delta_unknown_learner: "Delta-sync unknown learner",
  mis_settings_updated: "Settings updated",
  mis_test_connection_attempted: "Test connection",
};

const actionLabel = (a: string): string =>
  ACTION_LABEL[a] ??
  a
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

const formatTimestamp = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

interface Props {
  orgId: string;
}

export default function MisSyncSection({ orgId }: Props) {
  const [logsPage, setLogsPage] = useState(1);
  const [conflictsPage, setConflictsPage] = useState(1);

  const logsQuery = useMisSyncLogs(orgId, { page: logsPage, limit: 10 });
  const conflictsQuery = useMisConflicts(orgId, {
    page: conflictsPage,
    limit: 10,
  });

  const triggerMutation = useTriggerMisSyncNow(orgId);
  const resolveMutation = useResolveMisConflict(orgId);

  const [resolveTarget, setResolveTarget] = useState<MisConflictRow | null>(
    null,
  );
  const [resolveNote, setResolveNote] = useState("");

  const onTriggerSync = () => {
    triggerMutation.mutate({});
  };

  const openResolve = (row: MisConflictRow) => {
    setResolveTarget(row);
    setResolveNote("");
  };
  const closeResolve = () => {
    setResolveTarget(null);
    setResolveNote("");
  };
  const confirmResolve = () => {
    if (!resolveTarget) return;
    resolveMutation.mutate(
      { conflictId: resolveTarget._id, note: resolveNote.trim() || undefined },
      {
        onSettled: () => {
          closeResolve();
        },
      },
    );
  };

  const summary = logsQuery.data?.data?.summary;
  const lastPushedAt = summary?.last_pushed_at ?? null;
  const conflictCount = conflictsQuery.data?.data?.pagination?.total ?? 0;

  return (
    <section
      aria-labelledby="mis-sync-heading"
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6 mt-4"
    >
      {/* ── Header row ── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-9 h-9 rounded-xl bg-[#0B2343]/[0.06] text-[#0B2343]/65 flex items-center justify-center"
            >
              <RefreshCw size={16} />
            </span>
            <h2
              id="mis-sync-heading"
              className="text-base sm:text-lg font-extrabold text-[#0B2343]"
            >
              MIS sync
            </h2>
          </div>
          <p className="text-sm text-[#0B2343]/60 mt-1 leading-relaxed max-w-2xl">
            Manual sync triggers, unresolved conflicts, and the audit trail of
            every MIS-related event for this organisation.
          </p>
          {/* Summary chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${
                lastPushedAt
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-white text-[#0B2343]/70 border-[#0B2343]/[0.12]"
              }`}
            >
              <CheckCircle2 size={11} aria-hidden="true" />
              {lastPushedAt
                ? `Last pushed ${formatTimestamp(lastPushedAt)}`
                : "Never pushed"}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap ${
                conflictCount > 0
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-white text-[#0B2343]/70 border-[#0B2343]/[0.12]"
              }`}
            >
              <AlertTriangle size={11} aria-hidden="true" />
              {conflictCount} open conflict{conflictCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onTriggerSync}
          disabled={triggerMutation.isPending}
          aria-label="Trigger an immediate MIS push for every eligible ULN in this organisation"
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors whitespace-nowrap"
        >
          {triggerMutation.isPending ? (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          ) : (
            <RefreshCw size={14} aria-hidden="true" />
          )}
          {triggerMutation.isPending ? "Enqueueing…" : "Sync now"}
        </button>
      </div>

      {/* ── Conflicts panel ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle
            size={14}
            aria-hidden="true"
            className="text-[#0B2343]/65"
          />
          <h3 className="text-sm font-extrabold text-[#0B2343]">
            Open conflicts
          </h3>
        </div>

        {conflictsQuery.isLoading && (
          <div className="flex justify-center py-6" role="status">
            <Loader2
              size={20}
              aria-label="Loading conflicts"
              className="animate-spin text-[#0B2343]/45"
            />
          </div>
        )}
        {conflictsQuery.isError && !conflictsQuery.isLoading && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            Could not load conflicts. Try refreshing the page.
          </div>
        )}
        {!conflictsQuery.isLoading &&
          !conflictsQuery.isError &&
          conflictCount === 0 && (
            <div
              role="status"
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
            >
              No open conflicts for this organisation.
            </div>
          )}
        {!conflictsQuery.isLoading && conflictCount > 0 && (
          <ConflictsTable
            rows={conflictsQuery.data?.data?.rows ?? []}
            page={conflictsPage}
            totalPages={conflictsQuery.data?.data?.pagination?.total_pages ?? 1}
            onPrev={() => setConflictsPage((p) => Math.max(1, p - 1))}
            onNext={() => setConflictsPage((p) => p + 1)}
            onResolve={openResolve}
          />
        )}
      </div>

      {/* ── Recent activity panel ── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ScrollText
            size={14}
            aria-hidden="true"
            className="text-[#0B2343]/65"
          />
          <h3 className="text-sm font-extrabold text-[#0B2343]">
            Recent activity
          </h3>
        </div>

        {logsQuery.isLoading && (
          <div className="flex justify-center py-6" role="status">
            <Loader2
              size={20}
              aria-label="Loading activity log"
              className="animate-spin text-[#0B2343]/45"
            />
          </div>
        )}
        {logsQuery.isError && !logsQuery.isLoading && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            Could not load the activity log.
          </div>
        )}
        {!logsQuery.isLoading &&
          !logsQuery.isError &&
          (logsQuery.data?.data?.pagination?.total ?? 0) === 0 && (
            <div
              role="status"
              className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
            >
              No MIS activity recorded for this organisation yet.
            </div>
          )}
        {!logsQuery.isLoading &&
          (logsQuery.data?.data?.pagination?.total ?? 0) > 0 && (
            <ActivityTable
              rows={logsQuery.data?.data?.rows ?? []}
              page={logsPage}
              totalPages={logsQuery.data?.data?.pagination?.total_pages ?? 1}
              onPrev={() => setLogsPage((p) => Math.max(1, p - 1))}
              onNext={() => setLogsPage((p) => p + 1)}
            />
          )}
      </div>

      {/* ── Resolve-conflict modal ── */}
      <Modal
        open={resolveTarget !== null}
        onClose={closeResolve}
        title="Resolve conflict"
        titleId="resolve-dialog-title"
        size="sm"
        disableEscapeKey={resolveMutation.isPending}
        disableBackdropClick={resolveMutation.isPending}
      >
        <Modal.Body>
          <p className="text-sm text-[#0B2343]/75 leading-relaxed mb-3">
            Marking this conflict resolved dismisses it from the open queue. The
            underlying record is unchanged — this is purely an operator
            acknowledgement. The audit log will record your note (optional).
          </p>
          {resolveTarget && (
            <div
              role="status"
              className="rounded-xl border border-sky-200 bg-sky-50 p-3 mb-3"
            >
              <p className="text-xs font-mono text-sky-900 break-all">
                {resolveTarget.error}
              </p>
            </div>
          )}
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Resolution note (optional)
            </span>
            <textarea
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              rows={3}
              maxLength={500}
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22] resize-y"
            />
            <p className="text-[11px] text-[#0B2343]/55 mt-1">
              Stored verbatim in the audit log — up to 500 characters.
            </p>
          </label>
        </Modal.Body>
        <Modal.Actions>
          <button
            type="button"
            onClick={confirmResolve}
            disabled={resolveMutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
          >
            {resolveMutation.isPending && (
              <Loader2 size={14} aria-hidden="true" className="animate-spin" />
            )}
            {resolveMutation.isPending ? "Resolving…" : "Resolve"}
          </button>
          <button
            type="button"
            onClick={closeResolve}
            disabled={resolveMutation.isPending}
            className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </Modal.Actions>
      </Modal>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Sub-tables
// ─────────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-2 px-1">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
      >
        ‹ Previous
      </button>
      <span className="text-xs text-[#0B2343]/55 tabular-nums">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]"
      >
        Next ›
      </button>
    </div>
  );
}

function ConflictsTable({
  rows,
  page,
  totalPages,
  onPrev,
  onNext,
  onResolve,
}: {
  rows: MisConflictRow[];
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onResolve: (row: MisConflictRow) => void;
}) {
  return (
    <>
      <div className="rounded-xl border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table
            aria-label="Open MIS conflicts for this organisation"
            className="w-full min-w-[640px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Surfaced
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Target
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Error
                </th>
                <th
                  scope="col"
                  className="text-right px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Attempts
                </th>
                <th
                  scope="col"
                  className="text-center px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55 w-28"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const targetLabel =
                  r.job_summary.kind === "push-batch"
                    ? `Batch (${r.job_summary.ulns_count ?? "—"} ULNs)`
                    : (r.job_summary.uln ?? "—");
                return (
                  <tr
                    key={r._id}
                    className="border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc]"
                  >
                    <td className="align-top px-3 py-3 whitespace-nowrap text-xs text-[#0B2343]/70 tabular-nums">
                      <time dateTime={r.created_at}>
                        {formatTimestamp(r.created_at)}
                      </time>
                    </td>
                    <td className="align-top px-3 py-3 text-[#0B2343]/85">
                      {targetLabel}
                    </td>
                    <td className="align-top px-3 py-3">
                      <p className="text-xs font-mono text-[#0B2343]/80 break-all">
                        {r.error.length > 120
                          ? `${r.error.slice(0, 120)}…`
                          : r.error}
                      </p>
                    </td>
                    <td className="align-top px-3 py-3 text-right tabular-nums text-[#0B2343]/80">
                      {r.attempts}
                    </td>
                    <td className="align-top px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onResolve(r)}
                        aria-label={`Resolve conflict for ${targetLabel}`}
                        className="inline-flex items-center px-3 py-1.5 min-h-[32px] rounded-lg bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}

function ActivityTable({
  rows,
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  rows: MisSyncLogRow[];
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="rounded-xl border border-[#0B2343]/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table
            aria-label="Recent MIS-related events for this organisation"
            className="w-full min-w-[680px] border-collapse text-sm"
          >
            <thead className="bg-[#fafbfc]">
              <tr>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  When
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Actor
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Learner
                </th>
                <th
                  scope="col"
                  className="text-left px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0B2343]/55"
                >
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r._id}
                  className="border-t border-[#0B2343]/[0.06] hover:bg-[#fafbfc]"
                >
                  <td className="align-top px-3 py-3 whitespace-nowrap text-xs text-[#0B2343]/70 tabular-nums">
                    <time dateTime={r.timestamp}>
                      {formatTimestamp(r.timestamp)}
                    </time>
                  </td>
                  <td className="align-top px-3 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#0B2343]/[0.12] text-[#0B2343]/70 bg-white whitespace-nowrap">
                      {actionLabel(r.action)}
                    </span>
                  </td>
                  <td className="align-top px-3 py-3 text-xs text-[#0B2343]/85">
                    {r.actor_name ?? r.actor_type}
                  </td>
                  <td className="align-top px-3 py-3 text-xs text-[#0B2343]/85">
                    {r.learner_name ?? "—"}
                  </td>
                  <td className="align-top px-3 py-3 text-xs text-[#0B2343]/85 whitespace-pre-wrap">
                    {r.reason || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
}
