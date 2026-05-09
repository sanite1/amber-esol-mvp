import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type {
  ReferralListResponse,
  ReferralCreateResponse,
  ReferralValidatePreview,
} from "../types/esol";

export interface CreateReferralRequest {
  orgId?: string;
  email?: string;
  esolLevel?: string;
  expiresInDays?: number;
}

export interface RegisterViaReferralRequest {
  token: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  l1Language?: string;
  uln?: string;
}

/* ── Create referral token ── */

export const useCreateReferral = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<ReferralCreateResponse>,
    ApiError,
    CreateReferralRequest
  >({
    mutationFn: (data) =>
      api.post<ApiResponse<ReferralCreateResponse>>("/esol/referrals", data),
    onSuccess: (res) => {
      toast.success(res.message || "Invitation created");
      qc.invalidateQueries({ queryKey: ["esolReferrals"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create invitation");
    },
  });
};

/* ── List referrals ── */

export const useListReferrals = (query?: {
  orgId?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}) => {
  return useQuery<ApiResponse<ReferralListResponse>, ApiError>({
    queryKey: [
      "esolReferrals",
      query?.orgId,
      query?.page,
      query?.limit,
      query?.isActive,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.orgId) params.append("orgId", query.orgId);
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.isActive !== undefined)
        params.append("isActive", String(query.isActive));
      const qs = params.toString();
      return api.get<ApiResponse<ReferralListResponse>>(
        `/esol/referrals${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
};

/* ── Validate referral token (public) ── */

export const useValidateReferral = (token: string | undefined) => {
  return useQuery<ApiResponse<ReferralValidatePreview>, ApiError>({
    queryKey: ["esolReferralValidate", token],
    queryFn: () =>
      api.get<ApiResponse<ReferralValidatePreview>>(
        `/esol/referrals/validate/${encodeURIComponent(token!)}`,
      ),
    enabled: Boolean(token),
    retry: false,
  });
};

/* ── Register via referral (public) ── */

export const useRegisterViaReferral = () => {
  return useMutation<
    ApiResponse<{ user: { _id: string; firstname: string; email: string } }>,
    ApiError,
    RegisterViaReferralRequest
  >({
    mutationFn: (data) => api.post("/esol/referrals/register", data),
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });
};
