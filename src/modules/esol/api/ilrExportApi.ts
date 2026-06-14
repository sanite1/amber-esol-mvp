/**
 * TanStack Query wrappers for the ILR export endpoints — brief
 * Function 13 To-Do 4 frontend.
 *
 * Backend routes (verified against
 *   amber-esol-backend/src/routes/ilrExport.routes.ts
 *   amber-esol-backend/src/controllers/ilrExport.controller.ts
 *   amber-esol-backend/src/services/ilrExportRoutes.service.ts
 * ):
 *
 *   POST  /org-admin/export/ilr                   trigger
 *   GET   /org-admin/export/ilr/:jobId/status     status
 *   GET   /org-admin/export/ilr/:exportId/download CSV (or ?format=json)
 *
 * Mirrors the evidence-report contract:
 *
 *   1. `useTriggerIlrExport` — POST mutation. Returns 200 (cached) or
 *      202 (enqueued); both envelopes carry `export_id` + `download_url`
 *      + `json_url`. Cached responses skip polling entirely; enqueued
 *      responses carry a `job_id` for the status query to track.
 *   2. `useIlrExportJobStatus(jobId)` — 2s polling query. Stops on
 *      `completed | failed`. Same pattern as the evidence-report
 *      hook; the page can read `progress`, `errors_count`,
 *      `warnings_count`, and `rows_exported` off the envelope to
 *      surface a meaningful status line.
 *   3. `downloadIlrExport(exportId, format, filename)` — imperative
 *      helper that streams the file from the download endpoint with
 *      the Bearer token attached (via the shared axios instance) and
 *      triggers the browser download. `format: "csv" | "json"` picks
 *      the file flavour — the same export id serves both, the
 *      backend reads the `?format=json` query param to switch.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import { axios } from "../../../lib/network/axios";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

// ─────────────────────────────────────────────────────────────────────
// Request / response shapes
// ─────────────────────────────────────────────────────────────────────

export interface TriggerIlrExportRequest {
  /** ESFA academic year in YYYY/YY form, e.g. "2025/26". */
  academic_year: string;
  /** Inclusive period start, YYYY-MM-DD. */
  period_start: string;
  /** Inclusive period end, YYYY-MM-DD. */
  period_end: string;
}

export interface TriggerIlrExportResponse {
  export_id: string;
  /** Cached responses set this true + status "completed". */
  cached?: boolean;
  status?: "completed";
  /** Present on 202 enqueued responses (cached returns have no job). */
  job_id?: string;
  status_url?: string;
  /** Always present — the download URL is stable across cached / enqueued. */
  download_url: string;
  /** JSON companion file (same export_id, different format). */
  json_url: string;
}

export type IlrExportJobStatus = "waiting" | "active" | "completed" | "failed";

export interface IlrExportJobStatusResponse {
  job_id: string;
  status: IlrExportJobStatus;
  /** 0–100. The backend worker updates this as it walks the cohort. */
  progress: number;
  /** Set on completed jobs — number of ILR rows in the CSV. */
  rows_exported?: number;
  /** Set on completed jobs — count of validation errors per the
   *  Function 13 row validator (severity: "error"). */
  errors_count?: number;
  /** Set on completed jobs — count of validation warnings. */
  warnings_count?: number;
  download_url?: string;
  json_url?: string;
  failed_reason?: string;
}

// ─────────────────────────────────────────────────────────────────────
// 1. Trigger mutation
// ─────────────────────────────────────────────────────────────────────

export const useTriggerIlrExport = () =>
  useMutation<
    ApiResponse<TriggerIlrExportResponse>,
    ApiError,
    TriggerIlrExportRequest & { force_refresh?: boolean }
  >({
    mutationFn: (body) => {
      const { force_refresh, ...rest } = body;
      const qs = force_refresh ? "?force_refresh=true" : "";
      return api.post<ApiResponse<TriggerIlrExportResponse>>(
        `/org-admin/export/ilr${qs}`,
        rest,
      );
    },
  });

// ─────────────────────────────────────────────────────────────────────
// 2. Status poll
// ─────────────────────────────────────────────────────────────────────

/**
 * Polls `/org-admin/export/ilr/:jobId/status` every 2s while the job
 * is non-terminal. Returns the most recent envelope so the UI can
 * render `progress` and react to `status` transitions.
 *
 * Pass `enabled: false` (or `jobId: undefined`) to suspend polling —
 * eg. on cached completion we never enqueue a job and so never poll.
 */
export const useIlrExportJobStatus = (
  jobId: string | undefined,
  options: { enabled?: boolean } = {},
) =>
  useQuery<ApiResponse<IlrExportJobStatusResponse>, ApiError>({
    queryKey: ["orgAdmin", "ilrExport", "status", jobId],
    queryFn: () =>
      api.get<ApiResponse<IlrExportJobStatusResponse>>(
        `/org-admin/export/ilr/${jobId}/status`,
      ),
    enabled: Boolean(jobId) && options.enabled !== false,
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 2000;
    },
    refetchOnWindowFocus: false,
  });

// ─────────────────────────────────────────────────────────────────────
// 3. Download (imperative — outside TanStack)
// ─────────────────────────────────────────────────────────────────────

/**
 * Fetch the export file as a blob and trigger the browser download.
 *
 * `format` picks CSV (the default ILR submission format) or JSON
 * (the companion file used by org admins for inspection /
 * reconciliation pre-submission). Same export_id; the backend reads
 * the `?format=json` query param.
 *
 * Why blob-and-anchor instead of `<a target="_blank">`? The download
 * endpoint requires the Bearer token in the Authorization header,
 * which a plain anchor navigation can't supply. The shared axios
 * instance attaches the token via its interceptor.
 */
export const downloadIlrExport = async (
  exportId: string,
  format: "csv" | "json",
  filename: string,
): Promise<void> => {
  const url =
    format === "json"
      ? `/org-admin/export/ilr/${exportId}/download?format=json`
      : `/org-admin/export/ilr/${exportId}/download`;
  const response = await axios.get(url, { responseType: "blob" });
  const mime = format === "json" ? "application/json" : "text/csv";
  const blob = new Blob([response.data as BlobPart], { type: mime });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
