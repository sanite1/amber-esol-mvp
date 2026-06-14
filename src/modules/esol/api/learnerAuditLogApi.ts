/**
 * Learner-self audit log — Final Addendum §6 (BE-A).
 *
 *   useLearnerAuditLog(query)  →  GET /learner/me/audit-log
 *
 * Powers the Compliance Timeline section on the learner's /profile
 * page. Backed by `services/learnerAuditLog.service.ts` on the
 * backend, which hardcodes `learner_id` from the JWT — the learner
 * can only ever see their own trail, no matter what they post.
 *
 * Why a learner endpoint at all
 * =============================
 *
 * The org-admin audit-log endpoint (BE-B) returns rows resolved with
 * `actor_name` + `learner_name` joins, but is gated to `org_admin` +
 * `amber_admin` roles. The brief (§6) requires the learner to see
 * their OWN compliance timeline — every state change recorded against
 * them. The new BE-A endpoint serves that view:
 *
 *   - Same row shape as BE-B (the backend reuses the same shared
 *     aggregation helper, so the response contract is identical).
 *   - `learner_name` is always the caller's own name → effectively
 *     redundant; the UI hides the column.
 *   - No `learner_id` filter input (locked server-side).
 *   - No `action` filter input — by design. Learners shouldn't have to
 *     guess action keys to find a row; the table is short enough to
 *     scan top-to-bottom.
 *
 * Query keys are stable arrays so two callers with the same filter
 * set share a cache entry. `placeholderData: (prev) => prev` keeps
 * the previous page visible during pagination — same pattern as
 * `useOrgAdminAuditLog`.
 */

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  OrgAdminAuditLogResponse,
  OrgAdminAuditLogRow,
} from "../lib/types/orgAdmin";

// Re-export under a learner-facing alias so consumers don't pull a
// type named "OrgAdmin*" into a learner-side file.
export type LearnerAuditLogRow = OrgAdminAuditLogRow;
export type LearnerAuditLogResponse = OrgAdminAuditLogResponse;

export interface LearnerAuditLogQuery {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const useLearnerAuditLog = (query: LearnerAuditLogQuery = {}) =>
  useQuery<ApiResponse<LearnerAuditLogResponse>, ApiError>({
    queryKey: [
      "learner",
      "auditLog",
      query.from ?? "",
      query.to ?? "",
      query.page ?? 1,
      query.limit ?? 20,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query.from) params.append("from", query.from);
      if (query.to) params.append("to", query.to);
      if (query.page) params.append("page", String(query.page));
      if (query.limit) params.append("limit", String(query.limit));
      const qs = params.toString();
      return api.get<ApiResponse<LearnerAuditLogResponse>>(
        `/learner/me/audit-log${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
