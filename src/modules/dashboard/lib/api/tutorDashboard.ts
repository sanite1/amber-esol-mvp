import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useQuery } from "@tanstack/react-query";
import type {
  TutorDashboardResponse,
  TutorDashboardQuery,
} from "../types/tutorDashboard";

/* ═══════════════════════════════════════════════
   FETCH TUTOR DASHBOARD
   GET /api/tutor-dashboard?upcomingLimit=10&messagesLimit=4
   ═══════════════════════════════════════════════ */

export const fetchTutorDashboard = async (
  query?: TutorDashboardQuery,
): Promise<ApiResponse<TutorDashboardResponse>> => {
  const params = new URLSearchParams();
  if (query?.upcomingLimit)
    params.append("upcomingLimit", String(query.upcomingLimit));
  if (query?.messagesLimit)
    params.append("messagesLimit", String(query.messagesLimit));

  const res = await api.get<ApiResponse<TutorDashboardResponse>>(
    `/tutor-dashboard?${params.toString()}`,
  );
  return res;
};

export const useFetchTutorDashboard = (query?: TutorDashboardQuery) => {
  return useQuery<ApiResponse<TutorDashboardResponse>, ApiError>({
    queryKey: ["tutorDashboard", query?.upcomingLimit, query?.messagesLimit],
    queryFn: () => fetchTutorDashboard(query),
  });
};
