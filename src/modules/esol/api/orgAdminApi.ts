/**
 * TanStack Query wrappers for the org-admin Function 12 endpoints.
 *
 * Endpoints:
 *   GET  /api/org-admin/learners                    cohort table
 *   GET  /api/org-admin/learners/:id                learner detail
 *   GET  /api/org-admin/narrative-summary           Gemini cohort narrative
 *   POST /api/org-admin/learners/:id/nudge          one-tap nudge email
 *
 * Conventions:
 *   - Query keys are stable arrays — parameters appended in order so
 *     two calls with the same filter set share a cache entry.
 *   - `placeholderData: (prev) => prev` keeps the previous page
 *     visible during pagination / filter changes (avoids the spinner
 *     flash on the cohort table).
 *   - Mutations invalidate the relevant query keys on success.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  CohortTableQuery,
  CohortTableResponse,
  LearnerDetail,
  NarrativeSummaryResponse,
  NudgeRequest,
  NudgeResponse,
  OrgAdminAuditLogQuery,
  OrgAdminAuditLogResponse,
  OrgTeacherListResponse,
  TeacherMutationResult,
  RemoveTeacherResponse,
  AssignTeacherToLearnerRequest,
  TeacherMatchesResponse,
  AutoAssignResponse,
} from "../lib/types/orgAdmin";

// ─────────────────────────────────────────────────────────────────────
// Cohort table
// ─────────────────────────────────────────────────────────────────────

export const useOrgAdminCohort = (query: CohortTableQuery) =>
  useQuery<ApiResponse<CohortTableResponse>, ApiError>({
    queryKey: [
      "orgAdmin",
      "cohort",
      query.status ?? "",
      query.level ?? "",
      query.aim_type ?? "",
      query.search ?? "",
      query.page ?? 1,
      query.limit ?? 50,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query.status) params.append("status", query.status);
      if (query.level) params.append("level", query.level);
      if (query.aim_type) params.append("aim_type", query.aim_type);
      if (query.search) params.append("search", query.search);
      if (query.page) params.append("page", String(query.page));
      if (query.limit) params.append("limit", String(query.limit));
      const qs = params.toString();
      return api.get<ApiResponse<CohortTableResponse>>(
        `/org-admin/learners${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });

// ─────────────────────────────────────────────────────────────────────
// Learner detail
// ─────────────────────────────────────────────────────────────────────

export interface LearnerDetailQuery {
  sessions_page?: number;
  sessions_limit?: number;
  audit_page?: number;
  audit_limit?: number;
}

export const useOrgAdminLearnerDetail = (
  learnerId: string | undefined,
  query: LearnerDetailQuery = {},
) =>
  useQuery<ApiResponse<LearnerDetail>, ApiError>({
    queryKey: [
      "orgAdmin",
      "learnerDetail",
      learnerId,
      query.sessions_page ?? 1,
      query.sessions_limit ?? 20,
      query.audit_page ?? 1,
      query.audit_limit ?? 50,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query.sessions_page)
        params.append("sessions_page", String(query.sessions_page));
      if (query.sessions_limit)
        params.append("sessions_limit", String(query.sessions_limit));
      if (query.audit_page)
        params.append("audit_page", String(query.audit_page));
      if (query.audit_limit)
        params.append("audit_limit", String(query.audit_limit));
      const qs = params.toString();
      return api.get<ApiResponse<LearnerDetail>>(
        `/org-admin/learners/${learnerId}${qs ? `?${qs}` : ""}`,
      );
    },
    enabled: Boolean(learnerId),
    placeholderData: (prev) => prev,
  });

// ─────────────────────────────────────────────────────────────────────
// Narrative summary
// ─────────────────────────────────────────────────────────────────────

export const useNarrativeSummary = () =>
  useQuery<ApiResponse<NarrativeSummaryResponse>, ApiError>({
    queryKey: ["orgAdmin", "narrative"],
    queryFn: () =>
      api.get<ApiResponse<NarrativeSummaryResponse>>(
        "/org-admin/narrative-summary",
      ),
    // The backend itself caches for 24h — refetching on focus would
    // never reach Gemini, but it would create unnecessary noise in
    // the request log. Keep the cache stable across navigations.
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

/**
 * Refresh hook — calls the same endpoint with a cache-bypass param
 * so the backend regenerates. Mutation-shaped so we can disable the
 * button while the request is in flight.
 */
export const useRefreshNarrativeSummary = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<NarrativeSummaryResponse>, ApiError, void>({
    mutationFn: () =>
      api.get<ApiResponse<NarrativeSummaryResponse>>(
        // Cache-busting timestamp — the backend currently keys cache
        // by (org_id, generated_at), so a query param is enough to
        // force a re-evaluation on the next call. When the backend
        // adds an explicit `force=true` flag, swap this to that.
        `/org-admin/narrative-summary?_=${Date.now()}`,
      ),
    onSuccess: (res) => {
      qc.setQueryData(["orgAdmin", "narrative"], res);
      toast.success("Cohort narrative refreshed");
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not refresh narrative");
    },
  });
};

// ─────────────────────────────────────────────────────────────────────
// Nudge
// ─────────────────────────────────────────────────────────────────────

export const useNudgeLearner = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<NudgeResponse>,
    ApiError,
    { learnerId: string; data: NudgeRequest }
  >({
    mutationFn: ({ learnerId, data }) =>
      api.post<ApiResponse<NudgeResponse>>(
        `/org-admin/learners/${learnerId}/nudge`,
        data,
      ),
    onSuccess: (res, vars) => {
      const data = res.data;
      if (data?.email_sent) {
        toast.success("Nudge email sent");
      } else {
        toast.info(
          res.message || "Nudge skipped — learner has no email on file",
        );
      }
      qc.invalidateQueries({
        queryKey: ["orgAdmin", "learnerDetail", vars.learnerId],
      });
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not send nudge");
    },
  });
};

// ─────────────────────────────────────────────────────────────────────
// Audit log — Final Addendum §6
// ─────────────────────────────────────────────────────────────────────

export const useOrgAdminAuditLog = (query: OrgAdminAuditLogQuery) =>
  useQuery<ApiResponse<OrgAdminAuditLogResponse>, ApiError>({
    queryKey: [
      "orgAdmin",
      "auditLog",
      query.learner_id ?? "",
      query.action ?? "",
      query.from ?? "",
      query.to ?? "",
      query.page ?? 1,
      query.limit ?? 50,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query.learner_id) params.append("learner_id", query.learner_id);
      if (query.action) params.append("action", query.action);
      if (query.from) params.append("from", query.from);
      if (query.to) params.append("to", query.to);
      if (query.page) params.append("page", String(query.page));
      if (query.limit) params.append("limit", String(query.limit));
      const qs = params.toString();
      return api.get<ApiResponse<OrgAdminAuditLogResponse>>(
        `/org-admin/audit-log${qs ? `?${qs}` : ""}`,
      );
    },
    // Keep the previous page visible during filter changes — same
    // pattern as the cohort table.
    placeholderData: (prev) => prev,
  });

// ─────────────────────────────────────────────────────────────────────
// Teacher assignment — Final Addendum §4
// ─────────────────────────────────────────────────────────────────────

export const useOrgAdminTeachers = () =>
  useQuery<ApiResponse<OrgTeacherListResponse>, ApiError>({
    queryKey: ["orgAdmin", "teachers"],
    queryFn: () =>
      api.get<ApiResponse<OrgTeacherListResponse>>("/org-admin/teachers"),
  });

/**
 * Common toast helper for the soft-capacity warning (brief Final
 * Addendum §4). Backend returns `warning_flag: true` once a teacher
 * crosses 80% of `max_learners_per_teacher`. The mutation still
 * succeeds — capacity is never a hard refuser; the warning just
 * fires an amber toast so the org admin can rebalance.
 */
const fireCapacityToast = (res: ApiResponse<TeacherMutationResult>) => {
  const d = res.data;
  if (!d?.warning_flag) return;
  toast.warning(
    d.warning_message ??
      `Teacher is at ${d.assigned_learner_count}/${d.max_learners_per_teacher} learners — review their workload.`,
  );
};

export const useAddTeacherToOrg = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<TeacherMutationResult>,
    ApiError,
    { teacherId: string }
  >({
    mutationFn: ({ teacherId }) =>
      api.post<ApiResponse<TeacherMutationResult>>(
        `/org-admin/teachers/${teacherId}`,
        {},
      ),
    onSuccess: (res) => {
      toast.success(res.message || "Teacher attached");
      fireCapacityToast(res);
      qc.invalidateQueries({ queryKey: ["orgAdmin", "teachers"] });
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not attach teacher");
    },
  });
};

export const useRemoveTeacherFromOrg = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<RemoveTeacherResponse>,
    ApiError,
    { teacherId: string }
  >({
    mutationFn: ({ teacherId }) =>
      api.delete<ApiResponse<RemoveTeacherResponse>>(
        `/org-admin/teachers/${teacherId}`,
      ),
    onSuccess: (res) => {
      const count = res.data?.learners_unassigned ?? 0;
      toast.success(
        count > 0
          ? `Teacher removed — ${count} learner${count === 1 ? "" : "s"} unassigned`
          : "Teacher removed",
      );
      qc.invalidateQueries({ queryKey: ["orgAdmin", "teachers"] });
      qc.invalidateQueries({ queryKey: ["orgAdmin", "cohort"] });
      qc.invalidateQueries({ queryKey: ["orgAdmin", "learnerDetail"] });
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not remove teacher");
    },
  });
};

/**
 * Ranked teacher suggestions for one learner — powers the "Suggested
 * teachers" panel on the learner detail page. Includes ineligible
 * teachers WITH the reason (capacity / level) so the gap is explained,
 * not silent.
 */
export const useTeacherMatches = (learnerId: string | undefined) =>
  useQuery<ApiResponse<TeacherMatchesResponse>, ApiError>({
    queryKey: ["orgAdmin", "teacherMatches", learnerId],
    enabled: Boolean(learnerId),
    queryFn: () =>
      api.get<ApiResponse<TeacherMatchesResponse>>(
        `/org-admin/learners/${learnerId}/teacher-matches`,
      ),
  });

/**
 * Bulk best-match assignment for every unassigned learner in the org.
 * Backend walks the pool sequentially so each decision sees the load
 * the previous one created.
 */
export const useAutoAssignUnassigned = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<AutoAssignResponse>, ApiError, void>({
    mutationFn: () =>
      api.post<ApiResponse<AutoAssignResponse>>(
        "/org-admin/teachers/auto-assign",
        {},
      ),
    onSuccess: (res) => {
      const d = res.data;
      if (!d || d.total_unassigned === 0) {
        toast.info("No unassigned learners to place.");
      } else if (d.skipped === 0) {
        toast.success(
          `Assigned ${d.assigned} learner${d.assigned === 1 ? "" : "s"} to their best-match teacher.`,
        );
      } else {
        toast.warning(
          `Assigned ${d.assigned} of ${d.total_unassigned} — ${d.skipped} skipped (${Object.entries(
            d.skipped_reasons,
          )
            .map(([reason, n]) => `${reason}: ${n}`)
            .join(", ")}).`,
        );
      }
      qc.invalidateQueries({ queryKey: ["orgAdmin", "teachers"] });
      qc.invalidateQueries({ queryKey: ["orgAdmin", "cohort"] });
      qc.invalidateQueries({ queryKey: ["orgAdmin", "learnerDetail"] });
      qc.invalidateQueries({ queryKey: ["orgAdmin", "teacherMatches"] });
    },
    onError: (err) => {
      toast.error(err?.message ?? "Auto-assignment failed");
    },
  });
};

export const useAssignTeacherToLearner = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<TeacherMutationResult>,
    ApiError,
    { learnerId: string; data: AssignTeacherToLearnerRequest }
  >({
    mutationFn: ({ learnerId, data }) =>
      api.patch<ApiResponse<TeacherMutationResult>>(
        `/org-admin/learners/${learnerId}/teacher`,
        data,
      ),
    onSuccess: (res, vars) => {
      toast.success(
        res.data?.teacher_id ? "Teacher assigned" : "Teacher unassigned",
      );
      fireCapacityToast(res);
      qc.invalidateQueries({ queryKey: ["orgAdmin", "teachers"] });
      qc.invalidateQueries({ queryKey: ["orgAdmin", "cohort"] });
      qc.invalidateQueries({
        queryKey: ["orgAdmin", "learnerDetail", vars.learnerId],
      });
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not update assignment");
    },
  });
};
