/**
 * TanStack Query wrappers for the admin ComplianceConfig endpoints —
 * Final Addendum §3.
 *
 *   GET  /admin/compliance-config                       useAllComplianceConfigs
 *   GET  /admin/compliance-config/:d/:y/active          useActiveComplianceConfig
 *   POST /admin/compliance-config                       useActivateComplianceConfig
 *
 * The list query is the source of truth for the editor — once
 * loaded, the page can switch domains/years/versions without
 * round-trips. The active-config query is a separate cache for the
 * "what is the engine using right now?" callout.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  ListComplianceConfigsResponse,
  ActiveComplianceConfigResponse,
  ActivateComplianceConfigRequest,
  ActivateComplianceConfigResponse,
  ComplianceDomain,
} from "../lib/types/complianceConfig";

export const useAllComplianceConfigs = () =>
  useQuery<ApiResponse<ListComplianceConfigsResponse>, ApiError>({
    queryKey: ["admin", "complianceConfig", "list"],
    queryFn: () =>
      api.get<ApiResponse<ListComplianceConfigsResponse>>(
        "/admin/compliance-config",
      ),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useActiveComplianceConfig = (
  domain: ComplianceDomain | undefined,
  academicYear: string | undefined,
) =>
  useQuery<ApiResponse<ActiveComplianceConfigResponse>, ApiError>({
    queryKey: [
      "admin",
      "complianceConfig",
      "active",
      domain ?? "",
      academicYear ?? "",
    ],
    queryFn: () =>
      api.get<ApiResponse<ActiveComplianceConfigResponse>>(
        `/admin/compliance-config/${domain}/${encodeURIComponent(
          academicYear ?? "",
        )}/active`,
      ),
    enabled: Boolean(domain && academicYear),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    // 404s on absent (domain, year) pairs are expected when the
    // admin selects a year with no prior config — surface them as
    // errors but don't retry; the empty-state UI handles the case.
    retry: false,
  });

export const useActivateComplianceConfig = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<ActivateComplianceConfigResponse>,
    ApiError,
    ActivateComplianceConfigRequest
  >({
    mutationFn: (body) =>
      api.post<ApiResponse<ActivateComplianceConfigResponse>>(
        "/admin/compliance-config",
        body,
      ),
    onSuccess: (res, variables) => {
      // Invalidate both the list (so the new version appears in history)
      // and the active-config cache for the affected (domain, year).
      qc.invalidateQueries({
        queryKey: ["admin", "complianceConfig", "list"],
      });
      qc.invalidateQueries({
        queryKey: [
          "admin",
          "complianceConfig",
          "active",
          variables.domain,
          variables.academic_year,
        ],
      });
      toast.success(
        `Activated ${variables.domain} / ${variables.academic_year} v${res.data.version} — engine cache reloaded`,
      );
    },
    onError: (err) => {
      toast.error(err?.message ?? "Could not activate compliance config");
    },
  });
};
