import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type {
  Organisation,
  OrgListResponse,
  ProvisionOrgResponse,
  OrgPaymentModel,
  OrgInvoiceCycle,
  OrganisationAddress,
} from "../types/esol";

export interface ProvisionOrgRequest {
  name: string;
  contactEmail: string;
  contactName: string;
  phoneNumber?: string;
  address?: OrganisationAddress;
  contractStart?: string;
  contractEnd?: string;
  paymentModel: OrgPaymentModel;
  invoiceCycle: OrgInvoiceCycle;
  maxLearners?: number;
  ilrProviderRef?: string;
  adminFirstname: string;
  adminLastname: string;
  adminEmail: string;
  adminPhoneNumber: string;
  adminPassword: string;
}

export interface UpdateOrgRequest {
  name?: string;
  contactEmail?: string;
  contactName?: string;
  phoneNumber?: string;
  address?: OrganisationAddress;
  contractStart?: string;
  contractEnd?: string;
  paymentModel?: OrgPaymentModel;
  invoiceCycle?: OrgInvoiceCycle;
  maxLearners?: number;
  ilrProviderRef?: string;
}

export interface ListOrgsQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

/* ── Provision new org + admin ── */

export const useProvisionOrg = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<ProvisionOrgResponse>,
    ApiError,
    ProvisionOrgRequest
  >({
    mutationFn: (data) =>
      api.post<ApiResponse<ProvisionOrgResponse>>("/esol/organisations", data),
    onSuccess: (res) => {
      toast.success(res.message || "Organisation provisioned");
      qc.invalidateQueries({ queryKey: ["esolOrgs"] });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to provision organisation",
      );
    },
  });
};

/* ── List orgs ── */

export const useListOrgs = (query?: ListOrgsQuery) => {
  return useQuery<ApiResponse<OrgListResponse>, ApiError>({
    queryKey: [
      "esolOrgs",
      query?.page,
      query?.limit,
      query?.search,
      query?.isActive,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.search) params.append("search", query.search);
      if (query?.isActive !== undefined)
        params.append("isActive", String(query.isActive));
      const qs = params.toString();
      return api.get<ApiResponse<OrgListResponse>>(
        `/esol/organisations${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
};

/* ── Get single org ── */

export const useGetOrg = (orgId: string | undefined) => {
  return useQuery<ApiResponse<Organisation>, ApiError>({
    queryKey: ["esolOrg", orgId],
    queryFn: () =>
      api.get<ApiResponse<Organisation>>(`/esol/organisations/${orgId}`),
    enabled: Boolean(orgId),
  });
};

/* ── Update org ── */

export const useUpdateOrg = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<Organisation>,
    ApiError,
    { orgId: string; data: UpdateOrgRequest }
  >({
    mutationFn: ({ orgId, data }) =>
      api.patch<ApiResponse<Organisation>>(
        `/esol/organisations/${orgId}`,
        data,
      ),
    onSuccess: (res, vars) => {
      toast.success(res.message || "Organisation updated");
      qc.invalidateQueries({ queryKey: ["esolOrgs"] });
      qc.invalidateQueries({ queryKey: ["esolOrg", vars.orgId] });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to update organisation",
      );
    },
  });
};

/* ── Update org status ── */

export const useUpdateOrgStatus = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<Organisation>,
    ApiError,
    { orgId: string; isActive: boolean }
  >({
    mutationFn: ({ orgId, isActive }) =>
      api.patch<ApiResponse<Organisation>>(
        `/esol/organisations/${orgId}/status`,
        { isActive },
      ),
    onSuccess: (res, vars) => {
      toast.success(res.message || "Status updated");
      qc.invalidateQueries({ queryKey: ["esolOrgs"] });
      qc.invalidateQueries({ queryKey: ["esolOrg", vars.orgId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });
};
