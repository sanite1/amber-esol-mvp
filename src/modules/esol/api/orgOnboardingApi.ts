/**
 * Org-admin onboarding embed — Phase 2 / Final Addendum §13 (BE-G).
 *
 *   useOrgOnboardingStatus()         GET  /org-admin/onboarding/status
 *   useMarkOrgOnboardingComplete()   POST /org-admin/onboarding/complete
 *
 * Drives the first-login intercept on `/org-admin/dashboard`:
 *   1. The dashboard mount reads `useOrgOnboardingStatus()`.
 *   2. If `data?.data?.completed_at === null`, navigate to
 *      `/roi-calculator?onboarding=true`.
 *   3. The calculator page calls `useMarkOrgOnboardingComplete()`
 *      with `source: "roi_calculator_submitted"` on successful
 *      submission (or `"skipped"` on the Skip-for-now path), then
 *      navigates back to the dashboard.
 *   4. The dashboard re-reads status — now non-null — and renders
 *      normally instead of redirecting.
 *
 * Idempotency on the backend means a stale tab that fires
 * `markComplete` twice doesn't write two audit rows or re-stamp
 * the timestamp.
 *
 * Cache invalidation
 * ==================
 *
 * On a successful mark-complete we invalidate the status query so
 * any open dashboard tab that's still mounted picks up the new
 * state on the next focus / re-mount (no manual refetch). We
 * deliberately do NOT use `setQueryData` to optimistically write
 * the new completed_at — the backend's idempotency means an
 * already-completed call returns the existing timestamp, which
 * we'd rather read back than fake.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

export interface OrgOnboardingStatus {
  /** ISO-8601 timestamp; null while onboarding is still pending. */
  completed_at: string | null;
}

export interface MarkOnboardingResponse {
  completed_at: string;
  already_completed: boolean;
}

const ONBOARDING_STATUS_KEY = ["orgAdmin", "onboardingStatus"] as const;

export const useOrgOnboardingStatus = (options: { enabled?: boolean } = {}) =>
  useQuery<ApiResponse<OrgOnboardingStatus>, ApiError>({
    queryKey: ONBOARDING_STATUS_KEY,
    queryFn: () =>
      api.get<ApiResponse<OrgOnboardingStatus>>("/org-admin/onboarding/status"),
    // Status flips at most once per org-admin lifetime; no need for
    // refetchOnWindowFocus, and a long staleTime is fine.
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: options.enabled !== false,
  });

export interface MarkOnboardingArgs {
  /**
   * Free-text that lands in the audit row's `reason` field. The
   * frontend sends one of two values today; backend accepts any
   * trimmed string up to 80 chars.
   */
  source: "roi_calculator_submitted" | "skipped";
}

export const useMarkOrgOnboardingComplete = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<MarkOnboardingResponse>,
    ApiError,
    MarkOnboardingArgs
  >({
    mutationFn: (args) =>
      api.post<ApiResponse<MarkOnboardingResponse>>(
        "/org-admin/onboarding/complete",
        { source: args.source },
      ),
    onSuccess: () => {
      // Refresh status so any mounted dashboard re-reads the new
      // completed_at. We use invalidate (not setQueryData) so the
      // backend's idempotency story stays authoritative.
      qc.invalidateQueries({ queryKey: ONBOARDING_STATUS_KEY });
    },
    onError: (err) => {
      // Best-effort: a backend failure here shouldn't block the
      // user from leaving the calculator. A quiet toast surfaces
      // the issue without trapping them.
      toast.error(
        err?.message ??
          "Couldn't update onboarding status — you can retry from the dashboard.",
      );
    },
  });
};
