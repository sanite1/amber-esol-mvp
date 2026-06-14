import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type {
  PaginatedResponse,
  SafeguardingLevel,
  AISession,
} from "../types/esol";

export type SafeguardingAlertStatus =
  | "open"
  | "reviewed"
  | "escalated"
  | "resolved"
  | "dismissed";

/**
 * Categories the backend's keyword + Gemini detector emits.
 * Source: amber-esol-backend/src/models/SafeguardingAlert.ts.
 *
 * `child_protection` is the legacy Gemini value still accepted by the
 * backend enum; `child_concern` is the canonical one — handle both.
 */
export type SafeguardingTriggerCategory =
  | "self_harm"
  | "domestic_abuse"
  | "radicalisation"
  | "child_concern"
  | "child_protection"
  | "exploitation"
  | "mental_health_crisis";

export interface SafeguardingAlert {
  _id: string;
  learnerId:
    | string
    | {
        _id: string;
        firstname: string;
        lastname: string;
        email: string;
        esolLevel?: string;
      };
  orgId: string | { _id: string; name: string };
  sessionId: string | AISession;
  alertLevel: SafeguardingLevel;
  /**
   * Backend's canonical field is `messageContentHash` (SHA-256 hex).
   * The legacy name `triggerTextHash` was retained on the frontend
   * for back-compat with the older `/esol/safeguarding/*` response
   * shape — kept optional so newer payloads don't blow up the type.
   */
  triggerTextHash?: string;
  messageContentHash?: string;
  /** Pre-cache keyword class OR Gemini classification. Drives triage. */
  triggerCategory?: SafeguardingTriggerCategory | null;
  /** Whether the keyword cache or the AI tier flagged this. */
  triggerSource?: "keyword" | "ai_only" | null;
  claudeReasoning?: string;
  reviewedBy?:
    | string
    | { _id: string; firstname: string; lastname: string; email: string }
    | null;
  reviewedAt?: string | null;
  status: SafeguardingAlertStatus;
  resolution?: string;
  /** Set when an admin runs PATCH /api/admin/safeguarding/:id. */
  resolvedAt?: string | null;
  resolvedBy?:
    | string
    | { _id: string; firstname: string; lastname: string }
    | null;
  resolutionNotes?: string | null;
  notificationSentAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AlertListResponse
  extends PaginatedResponse<SafeguardingAlert> {
  alerts: SafeguardingAlert[];
}

export interface ListAlertsQuery {
  page?: number;
  limit?: number;
  status?: SafeguardingAlertStatus;
  alertLevel?: SafeguardingLevel;
  orgId?: string;
}

export interface ReviewAlertRequest {
  status: "reviewed" | "escalated" | "resolved" | "dismissed";
  resolution?: string;
}

/* ── List alerts ── */

export const useListAlerts = (query?: ListAlertsQuery) => {
  return useQuery<ApiResponse<AlertListResponse>, ApiError>({
    queryKey: [
      "esolAlerts",
      query?.page,
      query?.limit,
      query?.status,
      query?.alertLevel,
      query?.orgId,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.status) params.append("status", query.status);
      if (query?.alertLevel) params.append("alertLevel", query.alertLevel);
      if (query?.orgId) params.append("orgId", query.orgId);
      const qs = params.toString();
      return api.get<ApiResponse<AlertListResponse>>(
        `/esol/safeguarding${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
};

/* ── Get single alert ── */

export const useGetAlert = (alertId: string | undefined) => {
  return useQuery<ApiResponse<SafeguardingAlert>, ApiError>({
    queryKey: ["esolAlert", alertId],
    queryFn: () =>
      api.get<ApiResponse<SafeguardingAlert>>(`/esol/safeguarding/${alertId}`),
    enabled: Boolean(alertId),
  });
};

/* ── Org-admin safeguarding count ──────────────────────────────────
 *
 * Backend: GET /api/org-admin/safeguarding/count
 *   route:  amber-esol-backend/src/routes/orgAdminSafeguarding.routes.ts
 *   ctrl:   adminSafeguarding.controller.ts → getOrgAdminSafeguardingCount
 *
 * Default response: { open: number, resolved: number }
 * Optional ?resolved=true → { resolved: number }
 * Optional ?resolved=false → { open: number }
 *
 * Org admins are DELIBERATELY blind to per-alert detail per the
 * brief (Function 10). This hook is the only safeguarding surface
 * they get — a number to escalate against. The number alone is what
 * the OrgAdminDashboard count card renders.
 */

export interface OrgAdminSafeguardingCount {
  open?: number;
  resolved?: number;
}

export const useOrgAdminSafeguardingCount = () => {
  return useQuery<ApiResponse<OrgAdminSafeguardingCount>, ApiError>({
    queryKey: ["orgAdminSafeguardingCount"],
    queryFn: () =>
      api.get<ApiResponse<OrgAdminSafeguardingCount>>(
        "/org-admin/safeguarding/count",
      ),
    // 60s freshness — the count drives a banner the org admin shouldn't
    // see flicker on every render.
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/* ── Review alert ── */

export const useReviewAlert = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<SafeguardingAlert>,
    ApiError,
    { alertId: string; data: ReviewAlertRequest }
  >({
    mutationFn: ({ alertId, data }) =>
      api.patch<ApiResponse<SafeguardingAlert>>(
        `/esol/safeguarding/${alertId}/review`,
        data,
      ),
    onSuccess: (res, vars) => {
      toast.success(res.message || "Alert reviewed");
      qc.invalidateQueries({ queryKey: ["esolAlerts"] });
      qc.invalidateQueries({ queryKey: ["esolAlert", vars.alertId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to review alert");
    },
  });
};
