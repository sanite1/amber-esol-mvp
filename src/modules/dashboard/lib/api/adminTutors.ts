import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  AdminTutorsResponse,
  AdminTutorsQuery,
  AdminUpdateTutorStatusRequest,
  AdminUpdateTutorStatusResponse,
} from "../types/adminTutors";

/* ═══════════════════════════════════════════════
   FETCH ADMIN TUTORS
   GET /api/admin-tutors?page=1&limit=10&status=all&sort=newest&search=
   ═══════════════════════════════════════════════ */

export const fetchAdminTutors = async (
  query?: AdminTutorsQuery,
): Promise<ApiResponse<AdminTutorsResponse>> => {
  const params = new URLSearchParams();
  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);
  if (query?.status && query.status !== "all")
    params.append("status", query.status);
  if (query?.sort) params.append("sort", query.sort);

  const qs = params.toString();
  const res = await api.get<ApiResponse<AdminTutorsResponse>>(
    `/admin-tutors${qs ? `?${qs}` : ""}`,
  );
  return res;
};

export const useFetchAdminTutors = (query?: AdminTutorsQuery) => {
  return useQuery<ApiResponse<AdminTutorsResponse>, ApiError>({
    queryKey: [
      "adminTutors",
      query?.page,
      query?.limit,
      query?.search,
      query?.status,
      query?.sort,
    ],
    queryFn: () => fetchAdminTutors(query),
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   UPDATE TUTOR STATUS
   PATCH /api/admin-tutors/:id/status
   ═══════════════════════════════════════════════ */

export const updateTutorStatus = async (
  tutorId: string,
  data: AdminUpdateTutorStatusRequest,
): Promise<ApiResponse<AdminUpdateTutorStatusResponse>> => {
  const res = await api.patch<ApiResponse<AdminUpdateTutorStatusResponse>>(
    `/admin-tutors/${tutorId}/status`,
    data,
  );
  return res;
};

export const useUpdateTutorStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<AdminUpdateTutorStatusResponse>,
    ApiError,
    { tutorId: string; data: AdminUpdateTutorStatusRequest }
  >({
    mutationFn: ({ tutorId, data }) => updateTutorStatus(tutorId, data),
    onSuccess: (res) => {
      toast.success(res.message || "Tutor status updated");
      queryClient.invalidateQueries({ queryKey: ["adminTutors"] });
      // Also invalidate admin dashboard since it shows pending tutor count
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || "Failed to update tutor status";
      toast.error(msg);
    },
  });
};
