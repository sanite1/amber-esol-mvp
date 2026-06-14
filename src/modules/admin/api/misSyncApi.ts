/**
 * Admin MIS sync UI hooks — Phase 4 / Final Addendum §7 (BE-D).
 *
 *   GET   /admin/orgs/:id/mis/sync-logs                useMisSyncLogs
 *   GET   /admin/orgs/:id/mis/conflicts                useMisConflicts
 *   POST  /admin/orgs/:id/mis/sync-now                 useTriggerMisSyncNow
 *   POST  /admin/orgs/:id/mis/conflicts/:conflictId/resolve  useResolveMisConflict
 *
 * Mounted on the existing /admin/orgs/:id auth chain
 * (isAuthenticated + isAdmin). Drives the MisSyncSection on the
 * org detail page.
 *
 * The hooks pattern mirrors `misSettingsApi.ts` for consistency:
 *   - Query keys include the org id so two open OrgDetail tabs
 *     don't fight over each other's caches.
 *   - placeholderData keeps the previous page visible during a
 *     pagination flip.
 *   - Mutations invalidate the relevant queries on success +
 *     surface a sonner toast on error.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

// ─────────────────────────────────────────────────────────────────────
// Response shapes — kept inline to avoid a separate types file for
// just these four endpoints.
// ─────────────────────────────────────────────────────────────────────

export interface MisSyncLogRow {
  _id: string;
  timestamp: string;
  action: string;
  actor_type: string;
  actor_name: string | null;
  learner_id: string | null;
  learner_name: string | null;
  reason: string;
  before_state: unknown;
  after_state: unknown;
}

export interface MisSyncLogResponse {
  rows: MisSyncLogRow[];
  summary: {
    by_action: Record<string, number>;
    last_pushed_at: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface MisConflictRow {
  _id: string;
  queue_name: string;
  job_id: string;
  error: string;
  attempts: number;
  created_at: string;
  job_summary: {
    kind?: string;
    uln?: string | null;
    ulns_count?: number | null;
  };
  retried_at: string | null;
  dismissed: boolean;
}

export interface MisConflictsResponse {
  rows: MisConflictRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface TriggerSyncNowArgs {
  /** Optional explicit ULN list; when omitted the backend collects
   *  every student in the org with a non-null ULN. */
  ulns?: string[];
}

export interface TriggerSyncNowResponse {
  job_id: string;
  ulns_enqueued: number;
  capped: boolean;
}

export interface ResolveConflictArgs {
  conflictId: string;
  note?: string;
}

export interface ResolveConflictResponse {
  already_resolved: boolean;
  dismissed_at?: string;
}

export interface MisSyncQuery {
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────────────────────────────
// Query keys
// ─────────────────────────────────────────────────────────────────────

export const misSyncLogsKey = (orgId: string, q: MisSyncQuery) =>
  [
    "admin",
    "orgs",
    orgId,
    "mis-sync-logs",
    q.page ?? 1,
    q.limit ?? 50,
  ] as const;

export const misConflictsKey = (orgId: string, q: MisSyncQuery) =>
  [
    "admin",
    "orgs",
    orgId,
    "mis-conflicts",
    q.page ?? 1,
    q.limit ?? 50,
  ] as const;

// ─────────────────────────────────────────────────────────────────────
// GET hooks
// ─────────────────────────────────────────────────────────────────────

const buildQs = (q: MisSyncQuery): string => {
  const params = new URLSearchParams();
  if (q.page) params.append("page", String(q.page));
  if (q.limit) params.append("limit", String(q.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const useMisSyncLogs = (
  orgId: string | undefined,
  query: MisSyncQuery = {},
) =>
  useQuery<ApiResponse<MisSyncLogResponse>, ApiError>({
    queryKey: misSyncLogsKey(orgId ?? "", query),
    queryFn: () =>
      api.get<ApiResponse<MisSyncLogResponse>>(
        `/admin/orgs/${orgId}/mis/sync-logs${buildQs(query)}`,
      ),
    enabled: Boolean(orgId),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useMisConflicts = (
  orgId: string | undefined,
  query: MisSyncQuery = {},
) =>
  useQuery<ApiResponse<MisConflictsResponse>, ApiError>({
    queryKey: misConflictsKey(orgId ?? "", query),
    queryFn: () =>
      api.get<ApiResponse<MisConflictsResponse>>(
        `/admin/orgs/${orgId}/mis/conflicts${buildQs(query)}`,
      ),
    enabled: Boolean(orgId),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

// ─────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────

export const useTriggerMisSyncNow = (orgId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<TriggerSyncNowResponse>,
    ApiError,
    TriggerSyncNowArgs
  >({
    mutationFn: (args) =>
      api.post<ApiResponse<TriggerSyncNowResponse>>(
        `/admin/orgs/${orgId}/mis/sync-now`,
        // Send the body only when it has content; the backend
        // ignores `{}` but keeping it lean reads better in network
        // panel screenshots that admins paste into ops tickets.
        Array.isArray(args.ulns) && args.ulns.length > 0
          ? { ulns: args.ulns }
          : {},
      ),
    onSuccess: (res) => {
      const data = res.data;
      // Refresh the sync log so the new "manual trigger" audit row
      // appears at the top of the list without a manual reload.
      qc.invalidateQueries({
        queryKey: ["admin", "orgs", orgId, "mis-sync-logs"],
      });
      if (data?.ulns_enqueued === 0) {
        toast.info(
          "No eligible ULNs to push — every student in this org either has no ULN on file or the ULNs were filtered out.",
        );
      } else if (data?.capped) {
        toast.success(
          `Sync enqueued (capped at ${data.ulns_enqueued} ULNs). Re-run after the first batch lands to push the remainder.`,
        );
      } else {
        toast.success(
          `MIS sync enqueued — ${data?.ulns_enqueued ?? 0} ULN${data?.ulns_enqueued === 1 ? "" : "s"} on their way.`,
        );
      }
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not trigger MIS sync");
    },
  });
};

export const useResolveMisConflict = (orgId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<ResolveConflictResponse>,
    ApiError,
    ResolveConflictArgs
  >({
    mutationFn: (args) =>
      api.post<ApiResponse<ResolveConflictResponse>>(
        `/admin/orgs/${orgId}/mis/conflicts/${args.conflictId}/resolve`,
        args.note ? { note: args.note } : {},
      ),
    onSuccess: (res) => {
      qc.invalidateQueries({
        queryKey: ["admin", "orgs", orgId, "mis-conflicts"],
      });
      qc.invalidateQueries({
        queryKey: ["admin", "orgs", orgId, "mis-sync-logs"],
      });
      if (res.data?.already_resolved) {
        toast.info("This conflict was already resolved.");
      } else {
        toast.success("Conflict resolved.");
      }
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not resolve conflict");
    },
  });
};
