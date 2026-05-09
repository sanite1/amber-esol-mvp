import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type {
  EsolLearner,
  LearnerListResponse,
  FundingStatus,
  UlnStatus,
  TeacherListResponse,
} from "../types/esol";

export interface UpdateLearnerRequest {
  esolLevel?: string;
  l1Language?: string;
  uln?: string;
  ulnStatus?: UlnStatus;
  fundingStatus?: FundingStatus;
}

export interface ListLearnersQuery {
  page?: number;
  limit?: number;
  search?: string;
  esolLevel?: string;
  fundingStatus?: FundingStatus;
  orgId?: string;
}

/* ── List learners ── */

export const useListLearners = (query?: ListLearnersQuery) => {
  return useQuery<ApiResponse<LearnerListResponse>, ApiError>({
    queryKey: [
      "esolLearners",
      query?.page,
      query?.limit,
      query?.search,
      query?.esolLevel,
      query?.fundingStatus,
      query?.orgId,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.search) params.append("search", query.search);
      if (query?.esolLevel) params.append("esolLevel", query.esolLevel);
      if (query?.fundingStatus)
        params.append("fundingStatus", query.fundingStatus);
      if (query?.orgId) params.append("orgId", query.orgId);
      const qs = params.toString();
      return api.get<ApiResponse<LearnerListResponse>>(
        `/esol/learners${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
};

/* ── Get single learner ── */

export const useGetLearner = (learnerId: string | undefined) => {
  return useQuery<ApiResponse<EsolLearner>, ApiError>({
    queryKey: ["esolLearner", learnerId],
    queryFn: () =>
      api.get<ApiResponse<EsolLearner>>(`/esol/learners/${learnerId}`),
    enabled: Boolean(learnerId),
  });
};

/* ── Update learner ── */

export const useUpdateLearner = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<EsolLearner>,
    ApiError,
    { learnerId: string; data: UpdateLearnerRequest }
  >({
    mutationFn: ({ learnerId, data }) =>
      api.patch<ApiResponse<EsolLearner>>(`/esol/learners/${learnerId}`, data),
    onSuccess: (res, vars) => {
      toast.success(res.message || "Learner updated");
      qc.invalidateQueries({ queryKey: ["esolLearners"] });
      qc.invalidateQueries({ queryKey: ["esolLearner", vars.learnerId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update learner");
    },
  });
};

/* ── ESOL teachers (read-only for org_admin) ── */

export const useListEsolTeachers = (query?: {
  page?: number;
  limit?: number;
  search?: string;
  approvedOnly?: boolean;
}) => {
  return useQuery<ApiResponse<TeacherListResponse>, ApiError>({
    queryKey: [
      "esolTeachers",
      query?.page,
      query?.limit,
      query?.search,
      query?.approvedOnly,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.search) params.append("search", query.search);
      if (query?.approvedOnly !== undefined)
        params.append("approvedOnly", String(query.approvedOnly));
      const qs = params.toString();
      return api.get<ApiResponse<TeacherListResponse>>(
        `/esol/teachers${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
};
