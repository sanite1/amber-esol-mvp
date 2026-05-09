import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";
import { useQuery } from "@tanstack/react-query";
import type { AdminReviewsStats } from "../types/adminReview";

/* ═══════════════════════════════════════════════
   ADMIN: REVIEW STATS
   GET /api/reviews/admin/stats
   ═══════════════════════════════════════════════ */

export const fetchAdminReviewStats = async (): Promise<
  ApiResponse<AdminReviewsStats>
> => {
  const res = await api.get<ApiResponse<AdminReviewsStats>>(
    "/reviews/admin/stats",
  );
  return res;
};

export const useFetchAdminReviewStats = () => {
  return useQuery<ApiResponse<AdminReviewsStats>, ApiError>({
    queryKey: ["adminReviewStats"],
    queryFn: fetchAdminReviewStats,
  });
};
