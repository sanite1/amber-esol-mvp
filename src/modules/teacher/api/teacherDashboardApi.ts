/**
 * TanStack Query wrappers for the teacher-portal endpoints —
 * Final Addendum §9.
 *
 *   GET /teacher/learners        useTeacherLearners(query)
 *   (pending)                    useTeacherActivityFeed()
 *
 * The teacher routes are mounted at `/api/teacher/*` on the
 * backend; the frontend's axios baseURL ends at `/api`, so URLs
 * here begin at `/teacher/...` (no leading `/api`).
 *
 * Auth headers come from the shared axios interceptor — no
 * manual token-handling here.
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  LogReviewRequest,
  LogReviewResponse,
  PathwayOverrideRequest,
  PathwayOverrideResponse,
  PreviewTranslationRequest,
  PreviewTranslationResponse,
  RarpaSignoffRequest,
  RarpaSignoffResponse,
  SendMessageRequest,
  SendMessageResponse,
  TeacherActivityFeedResponse,
  TeacherLearnerDetailResponse,
  TeacherLearnersQuery,
  TeacherLearnersResponse,
} from "../lib/types/teacherDashboard";

// ─────────────────────────────────────────────────────────────────────
// useTeacherLearners — Todo 22.3
// ─────────────────────────────────────────────────────────────────────

const buildLearnerListUrl = (query: TeacherLearnersQuery): string => {
  const params = new URLSearchParams();
  if (query.priority) params.set("priority", query.priority);
  if (query.org_id) params.set("org_id", query.org_id);
  if (query.search && query.search.trim().length > 0) {
    params.set("search", query.search.trim());
  }
  if (typeof query.page === "number") params.set("page", String(query.page));
  if (typeof query.limit === "number") params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs.length > 0 ? `/teacher/learners?${qs}` : "/teacher/learners";
};

export const useTeacherLearners = (query: TeacherLearnersQuery = {}) =>
  useQuery<ApiResponse<TeacherLearnersResponse>, ApiError>({
    // Stable cache key — every filter contributes a slot so React
    // Query treats "p1 / search=Sam" and "p1 / search=Sami" as
    // distinct entries (and serves the previous one while the new
    // one loads via `placeholderData`).
    queryKey: [
      "teacher",
      "learners",
      query.priority ?? "",
      query.org_id ?? "",
      query.search ?? "",
      query.page ?? 1,
      query.limit ?? 50,
    ],
    queryFn: () =>
      api.get<ApiResponse<TeacherLearnersResponse>>(buildLearnerListUrl(query)),
    // 60s freshness keeps the dashboard quiet on tab switches while
    // still surfacing new priority changes within a minute. Tighter
    // than this would thrash the BullMQ priority-recalc job loop.
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

// ─────────────────────────────────────────────────────────────────────
// useTeacherActivityFeed — Phase 24 (pending)
// ─────────────────────────────────────────────────────────────────────

/**
 * Recent-activity feed for the dashboard side panel.
 *
 * Endpoint pending — Phase 24 will expose
 * `GET /teacher/activity` (AuditLog rows filtered to this
 * teacher's actor_id, joined with learner names). Until then the
 * hook is disabled and the Dashboard renders an empty state that
 * points at the phase.
 *
 * The hook shape is intentional so the only diff when the endpoint
 * lands is dropping `enabled: false` and wiring the URL.
 */
export const useTeacherActivityFeed = (options: { enabled?: boolean } = {}) =>
  useQuery<ApiResponse<TeacherActivityFeedResponse>, ApiError>({
    queryKey: ["teacher", "activity"],
    queryFn: () =>
      api.get<ApiResponse<TeacherActivityFeedResponse>>("/teacher/activity"),
    enabled: options.enabled === true, // pending Phase 24 — default off
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

// ─────────────────────────────────────────────────────────────────────
// useTeacherLearnerDetail — Todo 22.4
// ─────────────────────────────────────────────────────────────────────

export const teacherLearnerDetailKey = (id: string) =>
  ["teacher", "learnerDetail", id] as const;

export const useTeacherLearnerDetail = (
  learnerId: string | undefined,
  options: { enabled?: boolean } = {},
) =>
  useQuery<ApiResponse<TeacherLearnerDetailResponse>, ApiError>({
    queryKey: teacherLearnerDetailKey(learnerId ?? ""),
    queryFn: () =>
      api.get<ApiResponse<TeacherLearnerDetailResponse>>(
        `/teacher/learners/${learnerId}`,
      ),
    enabled: Boolean(learnerId) && options.enabled !== false,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

// ─────────────────────────────────────────────────────────────────────
// Phase 1 / Final Addendum §6 (BE-C) — teacher-scoped audit log for
// one of their assigned learners.
//
//   GET /teacher/learners/:id/audit-log
//
// Service enforces the assignment gate (404 → 403) before returning
// rows. Response shape matches the org-admin audit-log endpoint
// (resolved actor_name + learner_name) so we re-use the existing
// type in the orgAdmin module.
// ─────────────────────────────────────────────────────────────────────

export interface TeacherAuditLogQuery {
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const teacherLearnerAuditLogKey = (
  id: string,
  q: TeacherAuditLogQuery,
) =>
  [
    "teacher",
    "learnerAuditLog",
    id,
    q.action ?? "",
    q.from ?? "",
    q.to ?? "",
    q.page ?? 1,
    q.limit ?? 20,
  ] as const;

export const useTeacherLearnerAuditLog = (
  learnerId: string | undefined,
  query: TeacherAuditLogQuery = {},
  options: { enabled?: boolean } = {},
) =>
  useQuery<
    ApiResponse<
      import("../../esol/lib/types/orgAdmin").OrgAdminAuditLogResponse
    >,
    ApiError
  >({
    queryKey: teacherLearnerAuditLogKey(learnerId ?? "", query),
    queryFn: () => {
      const params = new URLSearchParams();
      if (query.action) params.append("action", query.action);
      if (query.from) params.append("from", query.from);
      if (query.to) params.append("to", query.to);
      if (query.page) params.append("page", String(query.page));
      if (query.limit) params.append("limit", String(query.limit));
      const qs = params.toString();
      return api.get<
        ApiResponse<
          import("../../esol/lib/types/orgAdmin").OrgAdminAuditLogResponse
        >
      >(`/teacher/learners/${learnerId}/audit-log${qs ? `?${qs}` : ""}`);
    },
    enabled: Boolean(learnerId) && options.enabled !== false,
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

// ─────────────────────────────────────────────────────────────────────
// Mutations — Todos 22.5, 22.6, 22.7
//
// All three follow the same shape: take `{ learnerId, data }`,
// POST to the matching `/teacher/learners/:id/…` route, toast on
// success/error, and invalidate the learner detail query so the
// page re-renders with the freshly persisted state. The list
// query is invalidated too — review-log changes
// teacher_last_reviewed_at on the row, and a sign-off can shift
// priority.
// ─────────────────────────────────────────────────────────────────────

const invalidateTeacherLearner = (
  qc: ReturnType<typeof useQueryClient>,
  id: string,
) => {
  qc.invalidateQueries({ queryKey: teacherLearnerDetailKey(id) });
  qc.invalidateQueries({ queryKey: ["teacher", "learners"] });
};

export const useLogTeacherReview = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<LogReviewResponse>,
    ApiError,
    { learnerId: string; data: LogReviewRequest }
  >({
    mutationFn: ({ learnerId, data }) =>
      api.post<ApiResponse<LogReviewResponse>>(
        `/teacher/learners/${learnerId}/review`,
        data,
      ),
    onSuccess: (_res, vars) => {
      toast.success("Review logged");
      invalidateTeacherLearner(qc, vars.learnerId);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ?? err.message ?? "Could not log review",
      );
    },
  });
};

export const useSetPathwayOverride = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<PathwayOverrideResponse>,
    ApiError,
    { learnerId: string; data: PathwayOverrideRequest }
  >({
    mutationFn: ({ learnerId, data }) =>
      api.post<ApiResponse<PathwayOverrideResponse>>(
        `/teacher/learners/${learnerId}/pathway`,
        data,
      ),
    onSuccess: (_res, vars) => {
      toast.success("Pathway override set");
      invalidateTeacherLearner(qc, vars.learnerId);
    },
    onError: (err) => {
      // The pathway service returns a 400 with a concatenated
      // problem list when one or more scenario_ids fail the
      // level-range check. Surface the message verbatim so the
      // teacher sees exactly which ids to fix.
      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Could not set pathway override",
      );
    },
  });
};

/**
 * Todo 23.5 — flag a learner ready for progression to the org admin.
 *
 * Wraps a `POST /teacher/learners/:id/notify-progression` endpoint
 * that the priority-action dispatcher fires for the
 * `ready_for_progression` trigger. The backend route is currently
 * pending — the hook surfaces a 404 cleanly via the error toast
 * so a teacher who clicks it before the endpoint ships sees a
 * clear "this affordance isn't wired yet" message rather than a
 * silent failure.
 */
export const useNotifyOrgAdminProgression = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<{ notified_at: string }>,
    ApiError,
    { learnerId: string }
  >({
    mutationFn: ({ learnerId }) =>
      api.post<ApiResponse<{ notified_at: string }>>(
        `/teacher/learners/${learnerId}/notify-progression`,
        {},
      ),
    onSuccess: (_res, vars) => {
      toast.success(
        "Org admin notified — they'll see this learner in their progression queue",
      );
      invalidateTeacherLearner(qc, vars.learnerId);
    },
    onError: (err) => {
      // 404 here = endpoint pending. Tell the teacher so they don't
      // think they did something wrong.
      const status = err.response?.status;
      if (status === 404) {
        toast.error(
          "Progression-notify endpoint not yet wired — flag this learner manually with the org admin for now.",
        );
        return;
      }
      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Could not notify the org admin",
      );
    },
  });
};

/**
 * Final Addendum §11 — send a teacher message.
 *
 *   POST /teacher/learners/:id/message
 *
 * Translation is decided server-side from `translate_to_l1` + the
 * learner's L1Language; the modal toggle drives the boolean. The
 * server's 502 ("translation service unavailable") surfaces as a
 * toast — the modal stays open so the teacher can retry or untick
 * translation and send in English.
 */
export const useSendTeacherMessage = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<SendMessageResponse>,
    ApiError,
    { learnerId: string; data: SendMessageRequest }
  >({
    mutationFn: ({ learnerId, data }) =>
      api.post<ApiResponse<SendMessageResponse>>(
        `/teacher/learners/${learnerId}/message`,
        data,
      ),
    onSuccess: (res, vars) => {
      const translated = res.data?.translated;
      toast.success(
        translated
          ? "Message sent — translated to the learner's L1"
          : "Message sent",
      );
      invalidateTeacherLearner(qc, vars.learnerId);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ?? err.message ?? "Could not send message",
      );
    },
  });
};

/**
 * Final Addendum §11 — translation preview for the Send Message modal.
 *
 *   POST /teacher/messages/preview-translation
 *
 * Used by the modal as a useQuery (the modal owns the debounce
 * window via a debounced `message_text` value passed in here, and
 * `enabled` gates the call). The hook stays a useQuery (rather
 * than useMutation) so react-query caches identical (text, lang)
 * pairs — typing "hello", then back to "hell", then back to
 * "hello" doesn't fire a second Gemini call.
 */
export const useTranslationPreview = (
  request: PreviewTranslationRequest | null,
  options: { enabled?: boolean } = {},
) =>
  useQuery<ApiResponse<PreviewTranslationResponse>, ApiError>({
    queryKey: [
      "teacher",
      "messagePreview",
      request?.message_text ?? "",
      request?.target_language ?? "",
    ],
    queryFn: () =>
      api.post<ApiResponse<PreviewTranslationResponse>>(
        "/teacher/messages/preview-translation",
        request,
      ),
    enabled:
      options.enabled !== false &&
      Boolean(request?.message_text && request?.target_language),
    staleTime: 5 * 60 * 1000, // identical (text, lang) pairs stay cached 5 min
    retry: false, // surface 502s immediately — no exponential backoff thrash
    refetchOnWindowFocus: false,
  });

/**
 * Final Addendum §11 — teacher self-service preferences.
 *
 *   useTeacherPreferences()      GET  /teacher/preferences
 *   useUpdateAutoReEngagement()  PATCH /teacher/preferences/auto-re-engagement
 *
 * Today the only preference is `auto_re_engagement_enabled`; the
 * response shape is an object so future flags drop in without a
 * type break here.
 */
export interface TeacherPreferencesResponse {
  auto_re_engagement_enabled: boolean;
}

export const teacherPreferencesKey = ["teacher", "preferences"] as const;

export const useTeacherPreferences = () =>
  useQuery<ApiResponse<TeacherPreferencesResponse>, ApiError>({
    queryKey: teacherPreferencesKey,
    queryFn: () =>
      api.get<ApiResponse<TeacherPreferencesResponse>>("/teacher/preferences"),
    // Long stale time — preferences change rarely. Optimistic
    // mutation below patches the cache directly so the UI doesn't
    // even need a refetch round-trip after a flip.
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useUpdateAutoReEngagement = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<{ auto_re_engagement_enabled: boolean; updated_at: string }>,
    ApiError,
    { auto_re_engagement_enabled: boolean }
  >({
    mutationFn: (body) =>
      api.patch<
        ApiResponse<{ auto_re_engagement_enabled: boolean; updated_at: string }>
      >("/teacher/preferences/auto-re-engagement", body),
    // Optimistic update — flip the cached value immediately so the
    // toggle feels instant. Roll back on error.
    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: teacherPreferencesKey });
      const previous = qc.getQueryData<ApiResponse<TeacherPreferencesResponse>>(
        teacherPreferencesKey,
      );
      if (previous) {
        qc.setQueryData<ApiResponse<TeacherPreferencesResponse>>(
          teacherPreferencesKey,
          {
            ...previous,
            data: {
              ...previous.data,
              auto_re_engagement_enabled: next.auto_re_engagement_enabled,
            },
          },
        );
      }
      return { previous };
    },
    onError: (err, _vars, context) => {
      // Roll back optimistic update.
      if (
        context &&
        typeof context === "object" &&
        "previous" in context &&
        context.previous
      ) {
        qc.setQueryData(teacherPreferencesKey, context.previous);
      }
      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Could not update preference",
      );
    },
    onSuccess: (res) => {
      toast.success(
        res.data?.auto_re_engagement_enabled
          ? "Auto re-engagement messages are ON"
          : "Auto re-engagement messages are OFF",
      );
    },
  });
};

export const useSignOffStage5 = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<RarpaSignoffResponse>,
    ApiError,
    { learnerId: string; data: RarpaSignoffRequest }
  >({
    mutationFn: ({ learnerId, data }) =>
      api.post<ApiResponse<RarpaSignoffResponse>>(
        `/teacher/learners/${learnerId}/rarpa-signoff`,
        data,
      ),
    onSuccess: (_res, vars) => {
      toast.success("Stage 5 review signed off");
      invalidateTeacherLearner(qc, vars.learnerId);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ??
          err.message ??
          "Could not sign off Stage 5 review",
      );
    },
  });
};
