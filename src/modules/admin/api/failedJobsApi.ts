/**
 * TanStack Query wrappers for the admin failed-jobs endpoints —
 * Final Addendum §1.
 *
 *   GET    /admin/failed-jobs            useFailedJobs(query)
 *   GET    /admin/failed-jobs/count      useFailedJobsCount()  (sidebar badge)
 *   POST   /admin/failed-jobs/:id/retry  useRetryFailedJob()
 *   DELETE /admin/failed-jobs/:id        useDismissFailedJob()
 *
 * Sidebar badge polling: 30 s. Enough to catch a new failure within
 * a screen-refresh window without burning requests.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  ListFailedJobsResponse,
  CountFailedJobsResponse,
  RetryFailedJobResponse,
  DismissFailedJobResponse,
} from "../lib/types/failedJobs";

export interface UseFailedJobsQuery {
  queue?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  include_dismissed?: boolean;
}

export const useFailedJobs = (query: UseFailedJobsQuery = {}) =>
  useQuery<ApiResponse<ListFailedJobsResponse>, ApiError>({
    queryKey: [
      "admin",
      "failedJobs",
      query.queue ?? "",
      query.from ?? "",
      query.to ?? "",
      query.page ?? 1,
      query.limit ?? 25,
      query.include_dismissed ? "1" : "0",
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query.queue) params.append("queue", query.queue);
      if (query.from) params.append("from", query.from);
      if (query.to) params.append("to", query.to);
      if (query.page) params.append("page", String(query.page));
      if (query.limit) params.append("limit", String(query.limit));
      if (query.include_dismissed) params.append("include_dismissed", "true");
      const qs = params.toString();
      return api.get<ApiResponse<ListFailedJobsResponse>>(
        `/admin/failed-jobs${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });

/**
 * Admin-only sidebar badge poller. The `enabled` flag MUST be set by
 * the caller (typically `isAdmin` from useAuth) — without it, every
 * non-admin user hammers /admin/failed-jobs/count every 30s and gets
 * 403s back, which fill the server log and may trigger the global
 * error toaster. Default `enabled: false` is the safe path; opt in
 * only where we know the user is an admin.
 */
export const useFailedJobsCount = (opts: { enabled?: boolean } = {}) =>
  useQuery<ApiResponse<CountFailedJobsResponse>, ApiError>({
    queryKey: ["admin", "failedJobs", "count"],
    queryFn: () =>
      api.get<ApiResponse<CountFailedJobsResponse>>("/admin/failed-jobs/count"),
    // Gated on caller-supplied role check. When false, react-query
    // doesn't fire the request AND doesn't poll.
    enabled: opts.enabled ?? false,
    // 30s — strikes a balance between sidebar freshness and request
    // volume. The user can hard-refresh by navigating to the page.
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

export const useRetryFailedJob = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<RetryFailedJobResponse>, ApiError, string>({
    mutationFn: (id) =>
      api.post<ApiResponse<RetryFailedJobResponse>>(
        `/admin/failed-jobs/${id}/retry`,
        {},
      ),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin", "failedJobs"] });
      toast.success(
        `Re-enqueued on ${res.data.queue_name} (new id: ${res.data.new_bull_job_id})`,
      );
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not retry the failed job");
    },
  });
};

export const useDismissFailedJob = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<DismissFailedJobResponse>, ApiError, string>({
    mutationFn: (id) =>
      api.delete<ApiResponse<DismissFailedJobResponse>>(
        `/admin/failed-jobs/${id}`,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "failedJobs"] });
      toast.success("Failed job dismissed");
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not dismiss the failed job");
    },
  });
};
