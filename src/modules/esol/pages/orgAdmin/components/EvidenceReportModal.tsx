/**
 * Evidence-report generation modal — brief Function 14 To-Do 4
 * frontend wiring.
 *
 * Flow:
 *   1. User clicks "Generate funding report" → modal opens.
 *   2. Date range pickers default to the last 28 days. User can
 *      adjust within the rolling 12-month window.
 *   3. On submit: POST /api/org-admin/evidence-report.
 *        - 200 cached → skip polling, jump straight to auto-download.
 *        - 202 enqueued → start polling /status every 2 s.
 *   4. Polling renders a progress bar (BullMQ job.progress).
 *   5. status === "completed" → auto-trigger download, then show
 *      a "Download again" button so a slow click can retry.
 *   6. status === "failed" → error alert + "Try again" resets to
 *      the form state.
 *
 * Date handling — replaced @mui/x-date-pickers with native
 * `<input type="date">`. Form stores ISO YYYY-MM-DD strings.
 *
 * WCAG 2.1 AA:
 *   - The dialog is labelled by its title and described by an
 *     instructional paragraph.
 *   - Date pickers carry visible labels + helper text.
 *   - Phase transitions announce via aria-live=polite so screen-
 *     reader users hear "Generating" / "Complete" without focus
 *     being yanked.
 */

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Download as DownloadIcon,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Modal from "../../../../../components/Modal";
import {
  useTriggerEvidenceReport,
  useEvidenceReportJobStatus,
  downloadEvidenceReportPdf,
} from "../../../api/evidenceReportApi";

// ── Date helpers ──

const ymdLocal = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayYmd = (): string => ymdLocal(new Date());

const daysAgoYmd = (n: number): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return ymdLocal(d);
};

const twelveMonthsAgoYmd = (): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - 365);
  return ymdLocal(d);
};

// ── State machine ──

type Phase =
  | "form" // user editing the date range
  | "submitting" // trigger POST in flight
  | "polling" // 202 received; polling /status
  | "downloading" // PDF blob fetch in flight
  | "complete" // download triggered; allow re-download
  | "failed"; // backend or network error

interface EvidenceReportModalProps {
  open: boolean;
  onClose: () => void;
  /** Used to build the suggested download filename. */
  orgName?: string;
}

export default function EvidenceReportModal({
  open,
  onClose,
  orgName,
}: EvidenceReportModalProps) {
  // ── Form state ──
  const [startDate, setStartDate] = useState<string>(daysAgoYmd(28));
  const [endDate, setEndDate] = useState<string>(daysAgoYmd(0));
  const [phase, setPhase] = useState<Phase>("form");

  // Job tracking — set after the POST returns. `reportId` is the
  // deterministic backend hash; we keep it independently of jobId so
  // we can drive the download even on the 200-cached path.
  const [jobId, setJobId] = useState<string | undefined>();
  const [reportId, setReportId] = useState<string | undefined>();
  const [errorText, setErrorText] = useState<string | null>(null);

  const minStartDate = twelveMonthsAgoYmd();
  const maxDate = todayYmd();

  // ── Form validation ──
  const validationError = useMemo<string | null>(() => {
    if (!startDate || !endDate) return "Choose both a start and end date";
    if (startDate >= endDate) return "Start date must be before end date";
    if (startDate < minStartDate || endDate < minStartDate) {
      return "Reports are limited to the most recent 12 months";
    }
    if (startDate > maxDate || endDate > maxDate) {
      return "Reporting period cannot extend into the future";
    }
    return null;
  }, [startDate, endDate, minStartDate, maxDate]);

  // ── API hooks ──
  const trigger = useTriggerEvidenceReport();
  const statusQuery = useEvidenceReportJobStatus(jobId, {
    enabled: phase === "polling",
  });

  // ── Filename helper ──
  const filenameFor = (): string => {
    const safeName = (orgName ?? "organisation")
      .replace(/[^A-Za-z0-9\-_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");
    return `RARPA_${safeName}_${startDate}_to_${endDate}.pdf`;
  };

  // ── Submit handler ──
  const handleSubmit = async () => {
    if (validationError || !startDate || !endDate) return;
    setPhase("submitting");
    setErrorText(null);
    try {
      const res = await trigger.mutateAsync({
        period_start: startDate,
        period_end: endDate,
      });
      const payload = res.data;
      setReportId(payload.report_id);

      if (payload.cached || payload.status === "completed") {
        await runDownload(payload.report_id);
        return;
      }

      if (payload.job_id) {
        setJobId(payload.job_id);
        setPhase("polling");
      } else {
        setErrorText("The server didn't return a job id. Please try again.");
        setPhase("failed");
      }
    } catch (err) {
      const message =
        (
          err as {
            message?: string;
            response?: { data?: { message?: string } };
          }
        )?.response?.data?.message ??
        (err as { message?: string }).message ??
        "Could not start the report generation. Please try again.";
      setErrorText(message);
      setPhase("failed");
    }
  };

  // ── Auto-react to status transitions ──
  useEffect(() => {
    if (phase !== "polling") return;
    const status = statusQuery.data?.data?.status;
    if (status === "completed") {
      const rid = statusQuery.data?.data?.report_id ?? reportId ?? undefined;
      if (rid) {
        void runDownload(rid);
      }
    } else if (status === "failed") {
      setErrorText(
        statusQuery.data?.data?.failed_reason ??
          "The report job failed. Please try again.",
      );
      setPhase("failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusQuery.data, phase]);

  useEffect(() => {
    if (phase !== "polling") return;
    if (statusQuery.isError) {
      setErrorText(
        statusQuery.error?.message ??
          "Lost connection to the report status endpoint. Please try again.",
      );
      setPhase("failed");
    }
  }, [statusQuery.isError, statusQuery.error, phase]);

  // ── Download (shared by cached + enqueued paths) ──
  const runDownload = async (rid: string) => {
    setPhase("downloading");
    try {
      await downloadEvidenceReportPdf(rid, filenameFor());
      setPhase("complete");
      toast.success("Funding report downloaded");
    } catch (err) {
      const message =
        (
          err as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ??
        (err as { message?: string }).message ??
        "The PDF was generated but could not be downloaded. Try again.";
      setErrorText(message);
      setPhase("failed");
    }
  };

  // ── Reset state whenever the modal opens ──
  useEffect(() => {
    if (open) {
      setPhase("form");
      setJobId(undefined);
      setReportId(undefined);
      setErrorText(null);
      setStartDate(daysAgoYmd(28));
      setEndDate(daysAgoYmd(0));
    }
  }, [open]);

  // ── Render helpers ──
  const progress =
    typeof statusQuery.data?.data?.progress === "number"
      ? statusQuery.data.data.progress
      : 0;

  const canCloseWhileWorking =
    phase === "form" || phase === "complete" || phase === "failed";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generate funding report"
      titleId="evidence-report-dialog-title"
      size="md"
      disableEscapeKey={!canCloseWhileWorking}
      disableBackdropClick={!canCloseWhileWorking}
    >
      <Modal.Body>
        <div className="flex items-start gap-2.5 mb-4">
          <span
            aria-hidden="true"
            className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
          >
            <FileText size={16} />
          </span>
          <p
            id="evidence-report-dialog-description"
            className="text-sm text-[#0B2343]/75 leading-relaxed"
          >
            Pick a reporting period in the last 12 months. The PDF consolidates
            RARPA Stages 1–5, teacher oversight, an ILR summary, and an
            aggregate safeguarding section.
          </p>
        </div>

        {/* ── Form phase ── */}
        {phase === "form" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                  Period start
                </span>
                <input
                  type="date"
                  value={startDate}
                  min={minStartDate}
                  max={maxDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  aria-label="Period start date"
                  className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                  Period end
                </span>
                <input
                  type="date"
                  value={endDate}
                  min={minStartDate}
                  max={maxDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-label="Period end date"
                  className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
                />
              </label>
            </div>
            {validationError && (
              <div
                role="alert"
                className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
              >
                {validationError}
              </div>
            )}
          </div>
        )}

        {/* ── Submitting / polling / downloading ── */}
        {(phase === "submitting" ||
          phase === "polling" ||
          phase === "downloading") && (
          <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="py-3"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2
                size={28}
                aria-hidden="true"
                className="animate-spin text-[#0B2343]/55"
              />
              <p className="text-sm text-[#0B2343]/70 text-center">
                {phase === "submitting" && "Queuing the report…"}
                {phase === "polling" &&
                  (progress > 0
                    ? `Generating the PDF — ${Math.round(progress)}% complete`
                    : "Generating the PDF — this usually takes 10–30 seconds")}
                {phase === "downloading" && "Downloading the PDF…"}
              </p>
              {phase === "polling" && (
                <div
                  className="w-full max-w-xs h-1.5 rounded-full bg-[#0B2343]/[0.08] overflow-hidden"
                  role="progressbar"
                  aria-label="Report generation progress"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-[#ff7c22] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Complete (download fired) ── */}
        {phase === "complete" && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3"
          >
            <DownloadIcon
              size={18}
              aria-hidden="true"
              className="shrink-0 mt-0.5 text-emerald-700"
            />
            <p className="text-sm text-emerald-900 leading-relaxed">
              Your funding report is downloading. If the file didn't open
              automatically, use the button below.
            </p>
          </div>
        )}

        {/* ── Failed ── */}
        {phase === "failed" && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3"
          >
            <AlertTriangle
              size={18}
              aria-hidden="true"
              className="shrink-0 mt-0.5 text-red-700"
            />
            <p className="text-sm text-red-800 leading-relaxed">
              {errorText ?? "Something went wrong. Please try again."}
            </p>
          </div>
        )}
      </Modal.Body>

      <Modal.Actions>
        {phase === "form" && (
          <>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={Boolean(validationError) || trigger.isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              <FileText size={14} aria-hidden="true" />
              Generate report
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close the funding report dialog"
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
        {phase === "complete" && reportId && (
          <>
            <button
              type="button"
              onClick={() => void runDownload(reportId)}
              aria-label="Download the funding report again"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              <DownloadIcon size={14} aria-hidden="true" />
              Download again
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close the funding report dialog"
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </>
        )}
        {phase === "failed" && (
          <>
            <button
              type="button"
              onClick={() => {
                setPhase("form");
                setJobId(undefined);
                setReportId(undefined);
                setErrorText(null);
              }}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 transition-colors"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close the funding report dialog"
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </>
        )}
        {(phase === "submitting" ||
          phase === "polling" ||
          phase === "downloading") && (
          <button
            type="button"
            disabled
            aria-label="Cancel disabled while job is in flight"
            className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343]/45 text-sm font-bold cursor-not-allowed"
          >
            Cancel
          </button>
        )}
      </Modal.Actions>
    </Modal>
  );
}
