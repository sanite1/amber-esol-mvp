/**
 * TanStack Query wrappers for the Stage 5 endpoints — Function 17.
 *
 *   GET  /esol/stage5/pending             usePendingStage5()  (learner)
 *   GET  /esol/stage5/:reviewId           useLearnerStage5Review(id)
 *   POST /esol/stage5/:reviewId/self-assessment  useSubmitStage5SelfAssessment()
 *   GET  /org-admin/stage5/:reviewId      useOrgAdminStage5Review(id)
 *   POST /org-admin/stage5/:reviewId/confirm    useConfirmStage5Review()
 *
 * Pending — backend follow-up
 * ===========================
 *
 * The backend has NO endpoints for:
 *
 *   - "List pending Stage 5 reviews for an org admin's org"
 *   - "List Stage 5 reviews for a specific learner"
 *
 * Verified by reading:
 *   amber-esol-backend/src/routes/orgAdminStage5.routes.ts
 *     — only POST /:reviewId/confirm + GET /:reviewId exist.
 *   amber-esol-backend/src/services/stage5Read.service.ts
 *     — getPendingStage5ForLearnerService is learner-scoped only;
 *       no org-scoped pending list service exists.
 *
 * Without those endpoints the org admin can only land on
 * /org-admin/stage5/:reviewId by knowing the URL — there's no
 * discovery surface. Two follow-up endpoints are needed:
 *
 *   GET /api/org-admin/stage5/pending
 *     → { reviews: [{ _id, learner_id, learner_name, level_completed,
 *                     learner_self_assessment_submitted,
 *                     ai_summary_ready, createdAt }] }
 *
 *   GET /api/org-admin/stage5/by-learner/:learnerId
 *     → { reviews: [...same shape...] }
 *
 * The hook stubs below (useOrgAdminPendingStage5,
 * useStage5ReviewsForLearner) are pre-wired with `enabled: false`
 * — when the backend ships, drop the gate and the
 * placeholder-tab UI lights up.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  LearnerStage5DetailResponse,
  OrgAdminStage5DetailResponse,
  PendingStage5Response,
  SubmitSelfAssessmentRequest,
  ConfirmStage5Request,
} from "../lib/stage5/types";

// ─────────────────────────────────────────────────────────────────────
// Learner-side
// ─────────────────────────────────────────────────────────────────────

export const usePendingStage5 = () =>
  useQuery<ApiResponse<PendingStage5Response>, ApiError>({
    queryKey: ["esol", "stage5", "pending"],
    queryFn: () =>
      api.get<ApiResponse<PendingStage5Response>>("/esol/stage5/pending"),
    // Poll every minute so the notification card surfaces a fresh
    // review without a hard refresh. AI-summary generation can take
    // up to ~30s; this catches the transition.
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });

export const useLearnerStage5Review = (reviewId: string | undefined) =>
  useQuery<ApiResponse<LearnerStage5DetailResponse>, ApiError>({
    queryKey: ["esol", "stage5", "detail", reviewId ?? ""],
    queryFn: () =>
      api.get<ApiResponse<LearnerStage5DetailResponse>>(
        `/esol/stage5/${reviewId}`,
      ),
    enabled: Boolean(reviewId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useSubmitStage5SelfAssessment = (reviewId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<unknown>,
    ApiError,
    SubmitSelfAssessmentRequest
  >({
    mutationFn: (body) =>
      api.post<ApiResponse<unknown>>(
        `/esol/stage5/${reviewId}/self-assessment`,
        body,
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["esol", "stage5", "detail", reviewId ?? ""],
      });
      qc.invalidateQueries({ queryKey: ["esol", "stage5", "pending"] });
      // Toast is informational; the page's thank-you screen is the
      // primary success surface.
      toast.success("Submitted — thank you!");
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not submit your reflection");
    },
  });
};

// ─────────────────────────────────────────────────────────────────────
// Org-admin side
// ─────────────────────────────────────────────────────────────────────

/**
 * Pre-wired hook for the org-admin pending list. Backend endpoint
 * doesn't exist yet (see file header for the spec). `enabled: false`
 * by default so the dashboard tab can render its placeholder UI
 * without firing a 404. When the backend ships, callers pass
 * `{ enabled: true }` and the rest of the hook is correct.
 */
export interface OrgAdminPendingStage5Row {
  _id: string;
  learner_id: string;
  learner_name: string;
  level_completed: string;
  learner_self_assessment_submitted: boolean;
  ai_summary_ready: boolean;
  createdAt: string;
}

export interface OrgAdminPendingStage5Response {
  reviews: OrgAdminPendingStage5Row[];
}

export const useOrgAdminPendingStage5 = (options: { enabled?: boolean } = {}) =>
  useQuery<ApiResponse<OrgAdminPendingStage5Response>, ApiError>({
    queryKey: ["orgAdmin", "stage5", "pending"],
    queryFn: () =>
      api.get<ApiResponse<OrgAdminPendingStage5Response>>(
        "/org-admin/stage5/pending",
      ),
    // Pending backend endpoint — default OFF. Pass `{enabled: true}`
    // when the route ships.
    enabled: options.enabled === true,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: true,
  });

export const useStage5ReviewsForLearner = (
  learnerId: string | undefined,
  options: { enabled?: boolean } = {},
) =>
  useQuery<ApiResponse<OrgAdminPendingStage5Response>, ApiError>({
    queryKey: ["orgAdmin", "stage5", "byLearner", learnerId ?? ""],
    queryFn: () =>
      api.get<ApiResponse<OrgAdminPendingStage5Response>>(
        `/org-admin/stage5/by-learner/${learnerId}`,
      ),
    // Same pending-endpoint gate as the org list above.
    enabled: Boolean(learnerId) && options.enabled === true,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useOrgAdminStage5Review = (reviewId: string | undefined) =>
  useQuery<ApiResponse<OrgAdminStage5DetailResponse>, ApiError>({
    queryKey: ["orgAdmin", "stage5", "detail", reviewId ?? ""],
    queryFn: () =>
      api.get<ApiResponse<OrgAdminStage5DetailResponse>>(
        `/org-admin/stage5/${reviewId}`,
      ),
    enabled: Boolean(reviewId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useConfirmStage5Review = (reviewId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<unknown>, ApiError, ConfirmStage5Request>({
    mutationFn: (body) =>
      api.post<ApiResponse<unknown>>(
        `/org-admin/stage5/${reviewId}/confirm`,
        body,
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["orgAdmin", "stage5", "detail", reviewId ?? ""],
      });
      toast.success(
        "Stage 5 review confirmed and locked into the evidence pack",
      );
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not confirm the review");
    },
  });
};
