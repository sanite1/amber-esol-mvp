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
  triggerTextHash: string;
  claudeReasoning?: string;
  reviewedBy?:
    | string
    | { _id: string; firstname: string; lastname: string; email: string }
    | null;
  reviewedAt?: string | null;
  status: SafeguardingAlertStatus;
  resolution?: string;
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
