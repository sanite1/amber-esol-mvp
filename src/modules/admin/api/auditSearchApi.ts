/**
 * Amber-admin cross-organisation audit search — Final Addendum §6.
 *
 *   GET /admin/audit-log   useAdminAuditSearch(query)
 *
 * Same row shape as the org-admin audit log plus org_id / org_name,
 * since results can span every organisation.
 */
import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";

export interface AdminAuditRow {
  _id: string;
  timestamp: string;
  actor_type: string;
  actor_id: string | null;
  actor_name: string | null;
  learner_id: string | null;
  learner_name: string | null;
  action: string;
  reason: string;
  before_state: unknown;
  after_state: unknown;
  compliance_config_version: number | null;
  org_id: string | null;
  org_name: string | null;
}

export interface AdminAuditSearchQuery {
  org_id?: string;
  learner_id?: string;
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AdminAuditSearchResponse {
  rows: AdminAuditRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export const useAdminAuditSearch = (query: AdminAuditSearchQuery) =>
  useQuery<ApiResponse<AdminAuditSearchResponse>, ApiError>({
    queryKey: ["admin", "auditSearch", query],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query.org_id) params.append("org_id", query.org_id);
      if (query.learner_id) params.append("learner_id", query.learner_id);
      if (query.action) params.append("action", query.action);
      if (query.from) params.append("from", query.from);
      if (query.to) params.append("to", query.to);
      if (query.page) params.append("page", String(query.page));
      if (query.limit) params.append("limit", String(query.limit));
      const qs = params.toString();
      return api.get<ApiResponse<AdminAuditSearchResponse>>(
        `/admin/audit-log${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
