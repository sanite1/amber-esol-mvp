import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  AdminStudentsResponse,
  AdminStudentsQuery,
  AdminUpdateStudentStatusRequest,
  AdminUpdateStudentStatusResponse,
} from "../types/adminStudents";

/* ═══════════════════════════════════════════════
   FETCH ADMIN STUDENTS
   GET /api/admin-students?page=1&limit=10&status=all&sort=newest&search=
   ═══════════════════════════════════════════════ */

export const fetchAdminStudents = async (
  query?: AdminStudentsQuery
): Promise<ApiResponse<AdminStudentsResponse>> => {
  const params = new URLSearchParams();
  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);
  if (query?.status && query.status !== "all")
    params.append("status", query.status);
  if (query?.sort) params.append("sort", query.sort);

  const qs = params.toString();
  const res = await api.get<ApiResponse<AdminStudentsResponse>>(
    `/admin-students${qs ? `?${qs}` : ""}`
  );
  return res;
};

export const useFetchAdminStudents = (query?: AdminStudentsQuery) => {
  return useQuery<ApiResponse<AdminStudentsResponse>, ApiError>({
    queryKey: [
      "adminStudents",
      query?.page,
      query?.limit,
      query?.search,
      query?.status,
      query?.sort,
    ],
    queryFn: () => fetchAdminStudents(query),
    // Keep previous data while fetching next page
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   UPDATE STUDENT STATUS
   PATCH /api/admin-students/:id/status
   ═══════════════════════════════════════════════ */

export const updateStudentStatus = async (
  studentId: string,
  data: AdminUpdateStudentStatusRequest
): Promise<ApiResponse<AdminUpdateStudentStatusResponse>> => {
  const res = await api.patch<ApiResponse<AdminUpdateStudentStatusResponse>>(
    `/admin-students/${studentId}/status`,
    data
  );
  return res;
};

export const useUpdateStudentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<AdminUpdateStudentStatusResponse>,
    ApiError,
    { studentId: string; data: AdminUpdateStudentStatusRequest }
  >({
    mutationFn: ({ studentId, data }) => updateStudentStatus(studentId, data),
    onSuccess: (res) => {
      toast.success(res.message || "Student status updated");
      queryClient.invalidateQueries({ queryKey: ["adminStudents"] });
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || "Failed to update student status";
      toast.error(msg);
    },
  });
};
