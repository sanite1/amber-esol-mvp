/**
 * TanStack Query wrappers for the admin teacher-utilisation
 * endpoints — Final Addendum §4.
 *
 *   GET /admin/teacher-utilisation                 useTeacherUtilisation(orgId?)
 *   GET /admin/teacher-utilisation/:id/history     useTeacherHistory(teacherId)
 */

import { useQuery } from "@tanstack/react-query";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type {
  TeacherUtilisationResponse,
  TeacherHistoryResponse,
} from "../lib/types/teacherUtilisation";

export const useTeacherUtilisation = (orgId?: string) =>
  useQuery<ApiResponse<TeacherUtilisationResponse>, ApiError>({
    queryKey: ["admin", "teacherUtilisation", orgId ?? ""],
    queryFn: () => {
      const qs = orgId ? `?org_id=${orgId}` : "";
      return api.get<ApiResponse<TeacherUtilisationResponse>>(
        `/admin/teacher-utilisation${qs}`,
      );
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useTeacherHistory = (
  teacherId: string | undefined,
  options: { enabled?: boolean } = {},
) =>
  useQuery<ApiResponse<TeacherHistoryResponse>, ApiError>({
    queryKey: ["admin", "teacherUtilisation", "history", teacherId ?? ""],
    queryFn: () =>
      api.get<ApiResponse<TeacherHistoryResponse>>(
        `/admin/teacher-utilisation/${teacherId}/history`,
      ),
    enabled: Boolean(teacherId) && options.enabled !== false,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
