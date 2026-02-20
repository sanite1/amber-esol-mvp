import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useQuery } from "@tanstack/react-query";
import type {
  StudentDashboardResponse,
  StudentDashboardQuery,
} from "../types/studentDashboard";

/* ═══════════════════════════════════════════════
   FETCH STUDENT DASHBOARD
   GET /api/student-dashboard?upcomingLimit=5&messagesLimit=4&recommendedLimit=3
   ═══════════════════════════════════════════════ */

export const fetchStudentDashboard = async (
  query?: StudentDashboardQuery
): Promise<ApiResponse<StudentDashboardResponse>> => {
  const params = new URLSearchParams();
  if (query?.upcomingLimit)
    params.append("upcomingLimit", String(query.upcomingLimit));
  if (query?.messagesLimit)
    params.append("messagesLimit", String(query.messagesLimit));
  if (query?.recommendedLimit)
    params.append("recommendedLimit", String(query.recommendedLimit));

  const res = await api.get<ApiResponse<StudentDashboardResponse>>(
    `/student-dashboard?${params.toString()}`
  );
  return res;
};

export const useFetchStudentDashboard = (query?: StudentDashboardQuery) => {
  return useQuery<ApiResponse<StudentDashboardResponse>, ApiError>({
    queryKey: [
      "studentDashboard",
      query?.upcomingLimit,
      query?.messagesLimit,
      query?.recommendedLimit,
    ],
    queryFn: () => fetchStudentDashboard(query),
  });
};
