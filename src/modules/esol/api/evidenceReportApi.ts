/**
 * TanStack Query wrappers for the evidence-report endpoints — brief
 * Function 14 To-Do 4 frontend.
 *
 * Backend routes:
 *   POST  /org-admin/evidence-report               trigger
 *   GET   /org-admin/evidence-report/:jobId/status status
 *   GET   /org-admin/evidence-report/:reportId/download   PDF (blob)
 *
 * Three pieces:
 *   1. `useTriggerEvidenceReport`  — mutation. Returns either a 200
 *      cached payload or a 202 enqueued payload (same envelope).
 *   2. `useEvidenceReportJobStatus(jobId)` — polling query at 2s while
 *      the job is non-terminal. Stops polling automatically on
 *      `completed | failed`.
 *   3. `downloadEvidenceReportPdf(reportId, filename)` — imperative
 *      helper that fetches the binary, builds an object URL, and
 *      triggers the browser download via a transient anchor. Used
 *      on `status === "completed"` to auto-download.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import { axios } from "../../../lib/network/axios";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

// ─────────────────────────────────────────────────────────────────────
// Request / response shapes
// ─────────────────────────────────────────────────────────────────────

export interface TriggerEvidenceReportRequest {
  period_start: string; // YYYY-MM-DD
  period_end: string; // YYYY-MM-DD
}

export interface TriggerEvidenceReportResponse {
  report_id: string;
  /** Present on 200 cached responses (no job was enqueued). */
  cached?: boolean;
  /** Present on cached responses; status is "completed" already. */
  status?: "completed";
  /** Present on 202 enqueued responses. */
  job_id?: string;
  status_url?: string;
  download_url: string;
}

export type EvidenceJobStatus = "waiting" | "active" | "completed" | "failed";

export interface EvidenceJobStatusResponse {
  job_id: string;
  status: EvidenceJobStatus;
  progress: number;
  report_id?: string;
  download_url?: string;
  failed_reason?: string;
}

// ─────────────────────────────────────────────────────────────────────
// 1. Trigger mutation
// ─────────────────────────────────────────────────────────────────────

export const useTriggerEvidenceReport = () =>
  useMutation<
    ApiResponse<TriggerEvidenceReportResponse>,
    ApiError,
    TriggerEvidenceReportRequest
  >({
    mutationFn: (body) =>
      api.post<ApiResponse<TriggerEvidenceReportResponse>>(
        "/org-admin/evidence-report",
        body,
      ),
  });

// ─────────────────────────────────────────────────────────────────────
// 2. Status poll
// ─────────────────────────────────────────────────────────────────────

/**
 * Polls `/org-admin/evidence-report/:jobId/status` every 2s while
 * the job is non-terminal. Returns the most recent envelope so the
 * UI can render `progress` and react to `status` transitions.
 *
 * Pass `enabled: false` (or `jobId: undefined`) to suspend polling —
 * eg. on cached completion we never enqueue a job and so never poll.
 */
export const useEvidenceReportJobStatus = (
  jobId: string | undefined,
  options: { enabled?: boolean } = {},
) =>
  useQuery<ApiResponse<EvidenceJobStatusResponse>, ApiError>({
    queryKey: ["orgAdmin", "evidenceReport", "status", jobId],
    queryFn: () =>
      api.get<ApiResponse<EvidenceJobStatusResponse>>(
        `/org-admin/evidence-report/${jobId}/status`,
      ),
    enabled: Boolean(jobId) && options.enabled !== false,
    // Refetch every 2s, but ONLY while the job is non-terminal.
    // TanStack passes the latest Query to the refetchInterval fn so
    // we can read the current status off the cached envelope.
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 2000;
    },
    // The poll cadence is the source of truth; don't double-fire on
    // window focus mid-polling.
    refetchOnWindowFocus: false,
  });

// ─────────────────────────────────────────────────────────────────────
// 3. PDF download (imperative — outside TanStack on purpose)
// ─────────────────────────────────────────────────────────────────────

/**
 * Fetch the cached PDF as a blob and trigger the browser download.
 *
 * Why not use `<a href target="_blank">`? The endpoint requires the
 * Bearer token in the Authorization header, which a plain anchor
 * navigation can't supply. So: fetch with the configured axios
 * instance (interceptor attaches the token), wrap the response in a
 * Blob URL, and synthesise an anchor click to drive the download.
 *
 * The object URL is revoked on the next tick — long enough for the
 * browser to start the download, short enough that we don't leak
 * memory if the user repeats the action.
 */
export const downloadEvidenceReportPdf = async (
  reportId: string,
  filename: string,
): Promise<void> => {
  const response = await axios.get(
    `/org-admin/evidence-report/${reportId}/download`,
    { responseType: "blob" },
  );
  const blob = new Blob([response.data as BlobPart], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick — most browsers have already begun the
  // download by then. setTimeout(0) is enough; we don't need the
  // ergonomics of queueMicrotask here.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
