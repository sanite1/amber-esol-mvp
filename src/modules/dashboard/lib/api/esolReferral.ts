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

/* ── Revoke a pending invitation ── */

export const useRevokeReferral = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<unknown>, ApiError, string>({
    mutationFn: (id) =>
      api.patch<ApiResponse<unknown>>(
        `/esol/referrals/${encodeURIComponent(id)}/revoke`,
      ),
    onSuccess: (res) => {
      toast.success(res.message || "Invitation revoked");
      qc.invalidateQueries({ queryKey: ["esolReferrals"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to revoke invitation");
    },
  });
};

/* ── Remind — re-send the invite email for a pending invitation ── */

export const useRemindReferral = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<unknown>, ApiError, string>({
    mutationFn: (id) =>
      api.post<ApiResponse<unknown>>(
        `/esol/referrals/${encodeURIComponent(id)}/remind`,
        {},
      ),
    onSuccess: (res) => {
      toast.success(res.message || "Reminder sent");
      qc.invalidateQueries({ queryKey: ["esolReferrals"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send reminder");
    },
  });
};

/* ── Validate referral token (public, LEGACY) ── */

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

/* ── Verify referral token (public, brief Function 2 To-Do 1) ──────
   POST /api/esol/verify-token — replaces the legacy validate above for
   the Function 2 onboarding flow. Returns the brief's narrower shape
   { org_id, org_name, org_type } and increments usage_count atomically
   on each call. */

export interface VerifyTokenResponse {
  org_id: string;
  org_name: string;
  org_type: string | null;
  /** Per-email invites carry the invitee's address — the wizard
   *  prefills + locks the email field with it. Generic links → null. */
  invited_email: string | null;
  /** Pre-assigned ESOL level when the org admin set one. */
  esol_level: string | null;
}

export const useVerifyReferralToken = (token: string | undefined) => {
  return useQuery<ApiResponse<VerifyTokenResponse>, ApiError>({
    queryKey: ["esolReferralVerify", token],
    queryFn: () =>
      api.post<ApiResponse<VerifyTokenResponse>>("/esol/verify-token", {
        token,
      }),
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
