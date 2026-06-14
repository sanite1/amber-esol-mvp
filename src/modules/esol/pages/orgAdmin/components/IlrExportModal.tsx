/**
 * ILR export modal — brief Function 13 To-Do 4 frontend wiring.
 *
 * Flow:
 *   1. User clicks "Export ILR" → modal opens.
 *   2. Academic year defaults to the current UK academic year
 *      (Aug–Jul). Period dates default to the last 28 days but the
 *      user can pick any window inside the chosen academic year.
 *      `force_refresh` is OFF by default — the backend's cache
 *      lookup short-circuits on identical (year, start, end) triples.
 *   3. Submit → POST /org-admin/export/ilr.
 *        - 200 cached: skip polling, go straight to "complete" with
 *          download buttons enabled.
 *        - 202 enqueued: capture `job_id`, poll `/status` every 2s.
 *   4. Polling renders a progress bar (BullMQ progress %).
 *   5. status === "completed" → expose two download buttons (CSV +
 *      JSON companion). Also surface rows_exported / errors_count /
 *      warnings_count so the admin sees validation health.
 *   6. status === "failed" → error alert + "Try again" resets to
 *      the form state.
 *
 * Mirrors EvidenceReportModal's state machine.
 *
 * Date handling — replaced @mui/x-date-pickers with native
 * `<input type="date">`. Native pickers expose the same a11y
 * affordances (label, keyboard nav, screen-reader support) and
 * remove a chunky dependency. The form stores ISO YYYY-MM-DD strings
 * directly — no Date wrapping needed.
 *
 * WCAG 2.1 AA:
 *   - The dialog is labelled by its title + described by an
 *     instructional paragraph.
 *   - All inputs carry visible labels.
 *   - Phase transitions announce via aria-live=polite.
 *   - In-flight jobs block backdrop / Escape close so the job-id
 *     isn't lost mid-poll.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Download as DownloadIcon,
  FileSpreadsheet,
  FileJson,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Modal from "../../../../../components/Modal";
import {
  useTriggerIlrExport,
  useIlrExportJobStatus,
  downloadIlrExport,
} from "../../../api/ilrExportApi";

// ── Helpers ──

const todayYmd = (): string => {
  const d = new Date();
  return ymdLocal(d);
};

const ymdLocal = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const daysAgoYmd = (n: number): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return ymdLocal(d);
};

/**
 * UK ESFA academic year — Aug 1 to Jul 31. So "2025/26" runs
 * from 2025-08-01 to 2026-07-31. This helper returns the *current*
 * year in YYYY/YY form for the default value.
 */
const currentAcademicYear = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = Jan, 7 = Aug
  const startYear = month >= 7 ? year : year - 1;
  const endYear = startYear + 1;
  return `${startYear}/${String(endYear).slice(2)}`;
};

const ACADEMIC_YEAR_RE = /^\d{4}\/\d{2}$/;

// ── State machine ──

type Phase = "form" | "submitting" | "polling" | "complete" | "failed";

interface IlrExportModalProps {
  open: boolean;
  onClose: () => void;
  /** Used to build the suggested download filename. */
  orgName?: string;
}

export default function IlrExportModal({
  open,
  onClose,
  orgName,
}: IlrExportModalProps) {
  // ── Form state ──
  const [academicYear, setAcademicYear] = useState(currentAcademicYear());
  const [startDate, setStartDate] = useState<string>(daysAgoYmd(28));
  const [endDate, setEndDate] = useState<string>(daysAgoYmd(0));
  const [forceRefresh, setForceRefresh] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");

  const [jobId, setJobId] = useState<string | undefined>();
  const [exportId, setExportId] = useState<string | undefined>();
  const [errorText, setErrorText] = useState<string | null>(null);

  // ── Form validation ──
  const validationError = useMemo<string | null>(() => {
    if (!ACADEMIC_YEAR_RE.test(academicYear)) {
      return "Academic year must be YYYY/YY (e.g. 2025/26)";
    }
    if (!startDate || !endDate) return "Choose both a start and end date";
    if (startDate > endDate) return "Start date must be on or before end date";
    const today = todayYmd();
    if (startDate > today || endDate > today) {
      return "Reporting period cannot extend into the future";
    }
    return null;
  }, [academicYear, startDate, endDate]);

  // ── API hooks ──
  const trigger = useTriggerIlrExport();
  const statusQuery = useIlrExportJobStatus(jobId, {
    enabled: phase === "polling",
  });

  // ── Filename helper ──
  const filenameFor = (format: "csv" | "json"): string => {
    const safeName = (orgName ?? "organisation")
      .replace(/[^A-Za-z0-9\-_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");
    const yearForFilename = academicYear.replace("/", "-");
    const ext = format === "json" ? "json" : "csv";
    return `ILR_${safeName}_${yearForFilename}_${startDate}_to_${endDate}.${ext}`;
  };

  // ── Submit handler ──
  const handleSubmit = async () => {
    if (validationError || !startDate || !endDate) return;
    setPhase("submitting");
    setErrorText(null);
    try {
      const res = await trigger.mutateAsync({
        academic_year: academicYear,
        period_start: startDate,
        period_end: endDate,
        force_refresh: forceRefresh,
      });
      const payload = res.data;
      setExportId(payload.export_id);

      if (payload.cached || payload.status === "completed") {
        setPhase("complete");
        toast.success("Cached export ready — pick your format below.");
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
        "Could not start the ILR export. Please try again.";
      setErrorText(message);
      setPhase("failed");
    }
  };

  // ── Auto-react to status transitions ──
  useEffect(() => {
    if (phase !== "polling") return;
    const status = statusQuery.data?.data?.status;
    if (status === "completed") {
      setPhase("complete");
      toast.success("ILR export ready — pick your format below.");
    } else if (status === "failed") {
      setErrorText(
        statusQuery.data?.data?.failed_reason ??
          "The ILR export job failed. Please try again.",
      );
      setPhase("failed");
    }
  }, [statusQuery.data, phase]);

  useEffect(() => {
    if (phase !== "polling") return;
    if (statusQuery.isError) {
      setErrorText(
        statusQuery.error?.message ??
          "Lost connection to the ILR status endpoint. Please try again.",
      );
      setPhase("failed");
    }
  }, [statusQuery.isError, statusQuery.error, phase]);

  // ── Reset state whenever the modal opens ──
  useEffect(() => {
    if (open) {
      setPhase("form");
      setJobId(undefined);
      setExportId(undefined);
      setErrorText(null);
      setAcademicYear(currentAcademicYear());
      setStartDate(daysAgoYmd(28));
      setEndDate(daysAgoYmd(0));
      setForceRefresh(false);
    }
  }, [open]);

  // ── Download triggers ──
  const handleDownload = async (format: "csv" | "json") => {
    if (!exportId) return;
    try {
      await downloadIlrExport(exportId, format, filenameFor(format));
      toast.success(`${format.toUpperCase()} downloaded`);
    } catch (err) {
      const message =
        (
          err as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ??
        (err as { message?: string }).message ??
        "Download failed. Try again.";
      toast.error(message);
    }
  };

  // ── Render helpers ──
  const progress =
    typeof statusQuery.data?.data?.progress === "number"
      ? statusQuery.data.data.progress
      : 0;

  const rowsExported = statusQuery.data?.data?.rows_exported;
  const errorsCount = statusQuery.data?.data?.errors_count;
  const warningsCount = statusQuery.data?.data?.warnings_count;

  const canCloseWhileWorking =
    phase === "form" || phase === "complete" || phase === "failed";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export ILR"
      titleId="ilr-export-dialog-title"
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
            <FileSpreadsheet size={16} />
          </span>
          <p
            id="ilr-export-dialog-description"
            className="text-sm text-[#0B2343]/75 leading-relaxed"
          >
            Generate an ESFA-format ILR CSV (and JSON companion) for the chosen
            academic year and reporting period. Cached exports return instantly
            — tick "Force refresh" to rebuild from current data.
          </p>
        </div>

        {/* ── Form ── */}
        {phase === "form" && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                Academic year
              </span>
              <input
                type="text"
                placeholder="2025/26"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value.trim())}
                maxLength={7}
                aria-label="Academic year in YYYY/YY format"
                className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
              />
              <p className="text-[11px] text-[#0B2343]/55 mt-1">
                YYYY/YY format. Defaults to the current UK academic year.
              </p>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
                  Period start
                </span>
                <input
                  type="date"
                  value={startDate}
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
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-label="Period end date"
                  className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
                />
              </label>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={forceRefresh}
                onChange={(e) => setForceRefresh(e.target.checked)}
                aria-label="Force refresh — bypass cache and rebuild from current data"
                className="w-4 h-4 rounded border-[#0B2343]/30 text-[#ff7c22] focus:ring-[#ff7c22] accent-[#ff7c22]"
              />
              <span className="text-sm text-[#0B2343]">
                Force refresh (skip cache)
              </span>
            </label>

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

        {/* ── Submitting / Polling ── */}
        {(phase === "submitting" || phase === "polling") && (
          <div className="space-y-3" role="status" aria-live="polite">
            <div className="flex items-center gap-2">
              <Loader2
                size={16}
                aria-hidden="true"
                className="animate-spin text-[#0B2343]/55"
              />
              <p className="text-sm text-[#0B2343]/80">
                {phase === "submitting"
                  ? "Starting the export…"
                  : `Generating — ${progress}%`}
              </p>
            </div>
            {phase === "polling" && (
              <div
                className="h-1.5 rounded-full bg-[#0B2343]/[0.08] overflow-hidden"
                role="progressbar"
                aria-label={`Export progress ${progress} percent`}
                aria-valuenow={progress}
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
        )}

        {/* ── Complete ── */}
        {phase === "complete" && (
          <div className="space-y-3" role="status" aria-live="polite">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              Export ready. Download the CSV for ESFA submission, or the JSON
              companion for inspection.
            </div>

            {(rowsExported !== undefined ||
              errorsCount !== undefined ||
              warningsCount !== undefined) && (
              <div className="flex flex-wrap gap-x-5 gap-y-1 py-1 text-xs">
                {rowsExported !== undefined && (
                  <p className="text-[#0B2343]/85">
                    <strong className="font-bold text-[#0B2343]">
                      {rowsExported}
                    </strong>{" "}
                    rows
                  </p>
                )}
                {errorsCount !== undefined && (
                  <p
                    className={
                      errorsCount > 0 ? "text-red-700" : "text-[#0B2343]/55"
                    }
                  >
                    <strong className="font-bold">{errorsCount}</strong> errors
                  </p>
                )}
                {warningsCount !== undefined && (
                  <p
                    className={
                      warningsCount > 0 ? "text-amber-700" : "text-[#0B2343]/55"
                    }
                  >
                    <strong className="font-bold">{warningsCount}</strong>{" "}
                    warnings
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleDownload("csv")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
              >
                <DownloadIcon size={14} aria-hidden="true" />
                Download CSV
              </button>
              <button
                type="button"
                onClick={() => handleDownload("json")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
              >
                <FileJson size={14} aria-hidden="true" />
                JSON companion
              </button>
            </div>
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
              {errorText ?? "Export failed."}
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
              disabled={Boolean(validationError)}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </>
        )}
        {phase === "complete" && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
          >
            Close
          </button>
        )}
        {phase === "failed" && (
          <>
            <button
              type="button"
              onClick={() => setPhase("form")}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </Modal.Actions>
    </Modal>
  );
}
