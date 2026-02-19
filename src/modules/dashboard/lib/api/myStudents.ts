import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MyStudentsQuery,
  ListMyStudentsResponse,
  TutorStudent,
  UpdateNotesResponse,
} from "../types/myStudents";

/* ──────────────────────────────────────────────
   Helper: extract error message
   ────────────────────────────────────────────── */

const getErrorMessage = (
  error: ApiError,
  fallback = "Something went wrong. Please try again."
): string => {
  return (
    error.response?.data?.fields?.[0]?.message ||
    error.response?.data?.message ||
    fallback
  );
};

/* ═══════════════════════════════════════════════
   LIST MY STUDENTS (authenticated tutor)
   GET /api/my-students
   ═══════════════════════════════════════════════ */

export const fetchMyStudents = async (
  query?: MyStudentsQuery
): Promise<ApiResponse<ListMyStudentsResponse>> => {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);
  if (query?.filter) params.append("filter", query.filter);
  if (query?.sort) params.append("sort", query.sort);

  const url = params.toString()
    ? `/my-students?${params.toString()}`
    : "/my-students";

  const res = await api.get<ApiResponse<ListMyStudentsResponse>>(url);
  return res;
};

export const useFetchMyStudents = (query: MyStudentsQuery) => {
  return useQuery({
    queryKey: ["my-students", query],
    queryFn: () => fetchMyStudents(query),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};

/* ═══════════════════════════════════════════════
   GET MY STUDENT DETAIL (authenticated tutor)
   GET /api/my-students/:studentId
   ═══════════════════════════════════════════════ */

export const fetchMyStudentDetail = async (
  studentId: string
): Promise<ApiResponse<TutorStudent>> => {
  const res = await api.get<ApiResponse<TutorStudent>>(
    `/my-students/${studentId}`
  );
  return res;
};

export const useFetchMyStudentDetail = (studentId: string) => {
  return useQuery<ApiResponse<TutorStudent>, ApiError>({
    queryKey: ["my-students", studentId],
    queryFn: () => fetchMyStudentDetail(studentId),
    enabled: !!studentId,
  });
};

/* ═══════════════════════════════════════════════
   UPDATE STUDENT NOTES (authenticated tutor)
   PATCH /api/my-students/:studentId/notes
   ═══════════════════════════════════════════════ */

export const updateStudentNotes = async (
  studentId: string,
  notes: string
): Promise<ApiResponse<UpdateNotesResponse>> => {
  const res = await api.patch<ApiResponse<UpdateNotesResponse>>(
    `/my-students/${studentId}/notes`,
    { notes }
  );
  return res;
};

export const useUpdateStudentNotes = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UpdateNotesResponse>,
    ApiError,
    { studentId: string; notes: string }
  >({
    mutationFn: ({ studentId, notes }) => updateStudentNotes(studentId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-students"] });

      toast.success("Notes Updated", {
        description: "Your notes for this student have been saved.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Update Failed", {
        description: getErrorMessage(
          error,
          "Could not save notes. Please try again."
        ),
      });
    },
  });
};
