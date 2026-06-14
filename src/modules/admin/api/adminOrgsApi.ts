/**
 * TanStack Query wrappers for the Amber-admin org-management
 * endpoints — brief Function 15.
 *
 *   GET /api/admin/orgs/overview   useAdminOrgsOverview()
 *
 * The drilldown page (/admin/orgs/:id) reads from the same cached
 * query — it picks the row matching the URL param. A dedicated
 * detail endpoint will replace this when Function 15 To-Do 3+ lands;
 * `useAdminOrg(orgId)` is built to absorb that change without
 * callers having to migrate.
 */

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  AdminOrgsOverviewResponse,
  AdminOrgsOverviewRow,
} from "../lib/types/adminOrgs";

export const useAdminOrgsOverview = () =>
  useQuery<ApiResponse<AdminOrgsOverviewResponse>, ApiError>({
    queryKey: ["admin", "orgs", "overview"],
    queryFn: () =>
      api.get<ApiResponse<AdminOrgsOverviewResponse>>("/admin/orgs/overview"),
    // Headline data drives an Amber-admin landing page; staleTime
    // mirrors the backend's effective freshness (calendar-month
    // figures don't change second-by-second). One minute is enough
    // to coalesce duplicate views during a tabbed-browser session.
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

/**
 * Single-org accessor backed by the same overview query. Pulls the
 * matching row out of the cached envelope so the detail page
 * doesn't trigger a second network round-trip.
 *
 * `enabled` defaults to true; pass undefined orgId to suspend.
 */
export const useAdminOrg = (orgId: string | undefined) => {
  const q = useAdminOrgsOverview();
  const row: AdminOrgsOverviewRow | undefined = orgId
    ? q.data?.data.orgs.find((o) => o.org_id === orgId)
    : undefined;
  return { ...q, row };
};
