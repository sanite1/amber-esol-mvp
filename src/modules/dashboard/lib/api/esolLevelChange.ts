import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type { PaginatedResponse } from "../types/esol";

export interface LevelChange {
  _id: string;
  learnerId:
    | string
    | { _id: string; firstname: string; lastname: string; email: string };
  orgId: string;
  fromLevel: string;
  toLevel: string;
  changedBy:
    | string
    | {
        _id: string;
        firstname: string;
        lastname: string;
        email: string;
        role: string;
      };
  reason: string;
  evidenceSummary?: string;
  sessionId?: string | null;
  effectiveDate: string;
  createdAt: string;
}

export interface LevelChangeListResponse
  extends PaginatedResponse<LevelChange> {
  changes: LevelChange[];
}

export interface CreateLevelChangeRequest {
  learnerId: string;
  toLevel: string;
  reason: string;
  evidenceSummary?: string;
  sessionId?: string;
  effectiveDate?: string;
}

/* ── Create level change ── */

export const useCreateLevelChange = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<LevelChange>,
    ApiError,
    CreateLevelChangeRequest
  >({
    mutationFn: (data) =>
      api.post<ApiResponse<LevelChange>>("/esol/level-changes", data),
    onSuccess: (res, vars) => {
      toast.success(res.message || "Level change recorded");
      qc.invalidateQueries({ queryKey: ["esolLevelChanges"] });
      qc.invalidateQueries({ queryKey: ["esolLearner", vars.learnerId] });
      qc.invalidateQueries({ queryKey: ["esolLearners"] });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to record level change",
      );
    },
  });
};

/* ── List level changes ── */

export const useListLevelChanges = (query?: {
  page?: number;
  limit?: number;
  learnerId?: string;
  orgId?: string;
}) => {
  return useQuery<ApiResponse<LevelChangeListResponse>, ApiError>({
    queryKey: [
      "esolLevelChanges",
      query?.page,
      query?.limit,
      query?.learnerId,
      query?.orgId,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.learnerId) params.append("learnerId", query.learnerId);
      if (query?.orgId) params.append("orgId", query.orgId);
      const qs = params.toString();
      return api.get<ApiResponse<LevelChangeListResponse>>(
        `/esol/level-changes${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
    enabled: Boolean(query?.learnerId || query?.orgId),
  });
};
