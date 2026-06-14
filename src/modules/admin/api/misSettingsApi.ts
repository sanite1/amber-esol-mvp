/**
 * TanStack Query wrappers for the admin MIS settings endpoints —
 * Final Addendum §7.
 *
 *   GET   /admin/orgs/:id/mis-settings          useMisSettings(orgId)
 *   PATCH /admin/orgs/:id/mis-settings          useUpdateMisSettings()
 *   POST  /admin/orgs/:id/mis-test-connection   useTestMisConnection()
 *
 * The query cache key includes the org_id so two open OrgDetail
 * tabs don't fight over each other's MIS state.
 *
 * Backend-follow-up gaps (F11 audit)
 * ==================================
 *
 * The FRONTEND_BUILD_PLAN.md F11 phase called for a richer MIS UI
 * — sync log, conflicts panel, manual sync trigger, schedule editor,
 * read-only org-admin mirror. None of those backend endpoints
 * currently exist. Verified by greps across
 *   amber-esol-backend/src/routes/
 * Only the 3 endpoints above and an internal cron at
 *   GET /api/cron/delta-sync
 * (gated on isCronAuthorized — not user-facing) are exposed.
 *
 * Server-side, the adapter framework + delta-sync worker + push
 * worker + compliance-validation worker all exist
 * (amber-esol-backend/src/services/mis/*), but they run on a fixed
 * cron schedule with no HTTP surface to inspect their output.
 *
 * When the backend ships these, add the matching hooks:
 *
 *   GET   /admin/orgs/:id/mis-sync-log?from=&to=
 *           → { entries: [{ run_at, direction: "push"|"pull",
 *                           records, status: "ok"|"failed",
 *                           duration_ms }], pagination }
 *           Hook name: `useMisSyncLog(orgId, query)`
 *
 *   POST  /admin/orgs/:id/mis-sync/run
 *           → { jobId, enqueued_at }    (BullMQ async)
 *           Hook name: `useTriggerMisSync(orgId)`
 *
 *   GET   /admin/orgs/:id/mis-conflicts?status=open|resolved
 *           → { conflicts: [{ row_id, record_type, fields_failed[],
 *                             error_message, surfaced_at }] }
 *           Hook name: `useMisConflicts(orgId, query)`
 *
 *   POST  /admin/orgs/:id/mis-conflicts/:rowId/resolve
 *           body: { reason: string, action: "accept" | "reject" }
 *           Hook name: `useResolveMisConflict(orgId)`
 *
 *   GET   /org-admin/mis-settings
 *           (read-only view of the org's own MIS settings — no
 *            credentials, just type + endpoint + has_credentials
 *            + last sync timestamp; for the legacy /org/settings
 *            page to mirror what Amber sees in OrgDetail).
 *           Hook name: `useOrgAdminMisSettings()`
 *
 * Until those ship, MisSettingsSection.tsx renders only the 3
 * verified operations (settings get/update + test connection).
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  GetMisSettingsResponse,
  UpdateMisSettingsRequest,
  UpdateMisSettingsResponse,
  TestMisConnectionResponse,
} from "../lib/types/misSettings";

export const useMisSettings = (orgId: string | undefined) =>
  useQuery<ApiResponse<GetMisSettingsResponse>, ApiError>({
    queryKey: ["admin", "orgs", orgId, "mis-settings"],
    queryFn: () =>
      api.get<ApiResponse<GetMisSettingsResponse>>(
        `/admin/orgs/${orgId}/mis-settings`,
      ),
    enabled: Boolean(orgId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useUpdateMisSettings = (orgId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<UpdateMisSettingsResponse>,
    ApiError,
    UpdateMisSettingsRequest
  >({
    mutationFn: (body) =>
      api.patch<ApiResponse<UpdateMisSettingsResponse>>(
        `/admin/orgs/${orgId}/mis-settings`,
        body,
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin", "orgs", orgId, "mis-settings"],
      });
      toast.success("MIS settings saved");
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not save MIS settings");
    },
  });
};

export const useTestMisConnection = (orgId: string | undefined) =>
  useMutation<ApiResponse<TestMisConnectionResponse>, ApiError, void>({
    mutationFn: () =>
      api.post<ApiResponse<TestMisConnectionResponse>>(
        `/admin/orgs/${orgId}/mis-test-connection`,
        {},
      ),
    onError: (err) => {
      // Connection-result failures (ok:false) come back as 200 with a
      // payload — those are surfaced inline. This handler catches
      // network / auth errors only.
      toast.error(err?.message ?? "MIS test connection failed");
    },
  });
