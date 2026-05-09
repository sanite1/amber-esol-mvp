import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useQuery } from "@tanstack/react-query";
import type {
  AdminDashboardResponse,
  AdminDashboardQuery,
} from "../types/adminDashboard";

/* ═══════════════════════════════════════════════
   FETCH ADMIN DASHBOARD
   GET /api/admin-dashboard?signupsLimit=7&lessonsLimit=6&transactionsLimit=5&chartMonths=6
   ═══════════════════════════════════════════════ */

export const fetchAdminDashboard = async (
  query?: AdminDashboardQuery,
): Promise<ApiResponse<AdminDashboardResponse>> => {
  const params = new URLSearchParams();
  if (query?.signupsLimit)
    params.append("signupsLimit", String(query.signupsLimit));
  if (query?.lessonsLimit)
    params.append("lessonsLimit", String(query.lessonsLimit));
  if (query?.transactionsLimit)
    params.append("transactionsLimit", String(query.transactionsLimit));
  if (query?.chartMonths)
    params.append("chartMonths", String(query.chartMonths));

  const res = await api.get<ApiResponse<AdminDashboardResponse>>(
    `/admin-dashboard?${params.toString()}`,
  );
  return res;
};

export const useFetchAdminDashboard = (query?: AdminDashboardQuery) => {
  return useQuery<ApiResponse<AdminDashboardResponse>, ApiError>({
    queryKey: [
      "adminDashboard",
      query?.signupsLimit,
      query?.lessonsLimit,
      query?.transactionsLimit,
      query?.chartMonths,
    ],
    queryFn: () => fetchAdminDashboard(query),
  });
};
