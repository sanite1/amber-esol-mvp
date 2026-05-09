import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Review,
  CreateReviewPayload,
  UpdateReviewPayload,
  ReplyPayload,
  ReportReviewPayload,
  AdminReviewActionPayload,
  AdminReportActionPayload,
  ReviewFilters,
  AdminReviewFilters,
  ListReviewsResponse,
  ReviewStatsResponse,
  ToggleHelpfulResponse,
} from "../types/review";

/* ──────────────────────────────────────────────
   Helper: extract error message
   ────────────────────────────────────────────── */

const getErrorMessage = (
  error: ApiError,
  fallback = "Something went wrong. Please try again.",
): string => {
  return (
    error.response?.data?.fields?.[0]?.message ||
    error.response?.data?.message ||
    fallback
  );
};

/* ═══════════════════════════════════════════════
   CREATE REVIEW (student)
   POST /api/reviews
   ═══════════════════════════════════════════════ */

export const createReview = async (
  payload: CreateReviewPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.post<ApiResponse<Review>>("/reviews", payload);
  return res;
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Review>, ApiError, CreateReviewPayload>({
    mutationFn: createReview,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });

      toast.success("Review Submitted", {
        description:
          response.message || "Your review has been posted successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Review Failed", {
        description: getErrorMessage(error, "Failed to submit review."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   GET TUTOR REVIEWS (public)
   GET /api/reviews/tutor/:tutorId
   ═══════════════════════════════════════════════ */

export const fetchTutorReviews = async (
  tutorId: string,
  filters: ReviewFilters,
): Promise<ApiResponse<ListReviewsResponse>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.rating) params.append("rating", String(filters.rating));
  if (filters.sort) params.append("sort", filters.sort);

  const res = await api.get<ApiResponse<ListReviewsResponse>>(
    `/reviews/tutor/${tutorId}?${params.toString()}`,
  );
  return res;
};

export const useFetchTutorReviews = (
  tutorId: string,
  filters: ReviewFilters,
) => {
  return useQuery<ApiResponse<ListReviewsResponse>, ApiError>({
    queryKey: ["reviews", "tutor", tutorId, filters],
    queryFn: () => fetchTutorReviews(tutorId, filters),
    enabled: !!tutorId,
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   GET MY REVIEWS (student)
   GET /api/reviews/me
   ═══════════════════════════════════════════════ */

export const fetchMyReviews = async (
  filters: ReviewFilters,
): Promise<ApiResponse<ListReviewsResponse>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.sort) params.append("sort", filters.sort);

  const res = await api.get<ApiResponse<ListReviewsResponse>>(
    `/reviews/me?${params.toString()}`,
  );
  return res;
};

export const useFetchMyReviews = (filters: ReviewFilters) => {
  return useQuery<ApiResponse<ListReviewsResponse>, ApiError>({
    queryKey: ["myReviews", filters],
    queryFn: () => fetchMyReviews(filters),
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   UPDATE REVIEW (student)
   PATCH /api/reviews/:id
   ═══════════════════════════════════════════════ */

export const updateReview = async (
  id: string,
  payload: UpdateReviewPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.patch<ApiResponse<Review>>(`/reviews/${id}`, payload);
  return res;
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Review>,
    ApiError,
    { id: string; payload: UpdateReviewPayload }
  >({
    mutationFn: ({ id, payload }) => updateReview(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats"] });

      toast.success("Review Updated", {
        description: response.message || "Your review has been updated.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Update Failed", {
        description: getErrorMessage(error, "Failed to update review."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   DELETE REVIEW (student)
   DELETE /api/reviews/:id
   ═══════════════════════════════════════════════ */

export const deleteReview = async (id: string): Promise<ApiResponse<void>> => {
  const res = await api.delete<ApiResponse<void>>(`/reviews/${id}`);
  return res;
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats"] });

      toast.success("Review Deleted");
    },
    onError: (error: ApiError) => {
      toast.error("Delete Failed", {
        description: getErrorMessage(error, "Failed to delete review."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   ADD REPLY (tutor)
   POST /api/reviews/:id/reply
   ═══════════════════════════════════════════════ */

export const addReply = async (
  id: string,
  payload: ReplyPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.post<ApiResponse<Review>>(
    `/reviews/${id}/reply`,
    payload,
  );
  return res;
};

export const useAddReply = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Review>,
    ApiError,
    { id: string; payload: ReplyPayload }
  >({
    mutationFn: ({ id, payload }) => addReply(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      toast.success("Reply Added", {
        description: response.message || "Your reply has been posted.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Reply Failed", {
        description: getErrorMessage(error, "Failed to add reply."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   UPDATE REPLY (tutor)
   PATCH /api/reviews/:id/reply
   ═══════════════════════════════════════════════ */

export const updateReply = async (
  id: string,
  payload: ReplyPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.patch<ApiResponse<Review>>(
    `/reviews/${id}/reply`,
    payload,
  );
  return res;
};

export const useUpdateReply = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Review>,
    ApiError,
    { id: string; payload: ReplyPayload }
  >({
    mutationFn: ({ id, payload }) => updateReply(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      toast.success("Reply Updated", {
        description: response.message || "Your reply has been updated.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Update Failed", {
        description: getErrorMessage(error, "Failed to update reply."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   DELETE REPLY (tutor)
   DELETE /api/reviews/:id/reply
   ═══════════════════════════════════════════════ */

export const deleteReply = async (id: string): Promise<ApiResponse<Review>> => {
  const res = await api.delete<ApiResponse<Review>>(`/reviews/${id}/reply`);
  return res;
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Review>, ApiError, string>({
    mutationFn: deleteReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      toast.success("Reply Deleted");
    },
    onError: (error: ApiError) => {
      toast.error("Delete Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   REPORT REVIEW
   POST /api/reviews/:id/report
   ═══════════════════════════════════════════════ */

export const reportReview = async (
  id: string,
  payload: ReportReviewPayload,
): Promise<ApiResponse<void>> => {
  const res = await api.post<ApiResponse<void>>(
    `/reviews/${id}/report`,
    payload,
  );
  return res;
};

export const useReportReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<void>,
    ApiError,
    { id: string; payload: ReportReviewPayload }
  >({
    mutationFn: ({ id, payload }) => reportReview(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      toast.success("Review Reported", {
        description:
          response.message || "Thank you. Our team will review this.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Report Failed", {
        description: getErrorMessage(error, "Failed to report review."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   TOGGLE HELPFUL
   POST /api/reviews/:id/helpful
   ═══════════════════════════════════════════════ */

export const toggleHelpful = async (
  id: string,
): Promise<ApiResponse<ToggleHelpfulResponse>> => {
  const res = await api.post<ApiResponse<ToggleHelpfulResponse>>(
    `/reviews/${id}/helpful`,
    {},
  );
  return res;
};

export const useToggleHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ToggleHelpfulResponse>, ApiError, string>({
    mutationFn: toggleHelpful,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   REVIEW STATS (public)
   GET /api/reviews/stats/:tutorId
   ═══════════════════════════════════════════════ */

export const fetchReviewStats = async (
  tutorId: string,
): Promise<ApiResponse<ReviewStatsResponse>> => {
  const res = await api.get<ApiResponse<ReviewStatsResponse>>(
    `/reviews/stats/${tutorId}`,
  );
  return res;
};

export const useFetchReviewStats = (tutorId: string) => {
  return useQuery<ApiResponse<ReviewStatsResponse>, ApiError>({
    queryKey: ["reviewStats", tutorId],
    queryFn: () => fetchReviewStats(tutorId),
    enabled: !!tutorId,
  });
};

/* ═══════════════════════════════════════════════
   ADMIN: LIST ALL REVIEWS
   GET /api/reviews/admin
   ═══════════════════════════════════════════════ */

export const fetchAdminReviews = async (
  filters: AdminReviewFilters,
): Promise<ApiResponse<ListReviewsResponse>> => {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.status) params.append("status", filters.status);
  if (filters.reported !== undefined)
    params.append("reported", String(filters.reported));
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.search) params.append("search", filters.search);

  const res = await api.get<ApiResponse<ListReviewsResponse>>(
    `/reviews/admin?${params.toString()}`,
  );
  return res;
};

export const useFetchAdminReviews = (filters: AdminReviewFilters) => {
  return useQuery<ApiResponse<ListReviewsResponse>, ApiError>({
    queryKey: ["adminReviews", filters],
    queryFn: () => fetchAdminReviews(filters),
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   ADMIN: HIDE REVIEW
   PATCH /api/reviews/:id/hide
   ═══════════════════════════════════════════════ */

export const hideReview = async (
  id: string,
  payload: AdminReviewActionPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.patch<ApiResponse<Review>>(
    `/reviews/${id}/hide`,
    payload,
  );
  return res;
};

export const useHideReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Review>,
    ApiError,
    { id: string; payload: AdminReviewActionPayload }
  >({
    mutationFn: ({ id, payload }) => hideReview(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      toast.success("Review Hidden", {
        description: response.message || "Review has been hidden.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error, "Failed to hide review."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   ADMIN: UNHIDE REVIEW
   PATCH /api/reviews/:id/unhide
   ═══════════════════════════════════════════════ */

export const unhideReview = async (
  id: string,
  payload: AdminReviewActionPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.patch<ApiResponse<Review>>(
    `/reviews/${id}/unhide`,
    payload,
  );
  return res;
};

export const useUnhideReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Review>,
    ApiError,
    { id: string; payload: AdminReviewActionPayload }
  >({
    mutationFn: ({ id, payload }) => unhideReview(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      toast.success("Review Restored", {
        description: response.message || "Review is now visible again.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error, "Failed to unhide review."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   ADMIN: REMOVE REVIEW
   PATCH /api/reviews/:id/remove
   ═══════════════════════════════════════════════ */

export const removeReview = async (
  id: string,
  payload: AdminReviewActionPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.patch<ApiResponse<Review>>(
    `/reviews/${id}/remove`,
    payload,
  );
  return res;
};

export const useRemoveReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Review>,
    ApiError,
    { id: string; payload: AdminReviewActionPayload }
  >({
    mutationFn: ({ id, payload }) => removeReview(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      toast.success("Review Removed", {
        description: response.message || "Review has been permanently removed.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error, "Failed to remove review."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   ADMIN: RESTORE REVIEW
   PATCH /api/reviews/:id/restore
   ═══════════════════════════════════════════════ */

export const restoreReview = async (
  id: string,
  payload: AdminReviewActionPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.patch<ApiResponse<Review>>(
    `/reviews/${id}/restore`,
    payload,
  );
  return res;
};

export const useRestoreReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Review>,
    ApiError,
    { id: string; payload: AdminReviewActionPayload }
  >({
    mutationFn: ({ id, payload }) => restoreReview(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });

      toast.success("Review Restored", {
        description: response.message || "Review has been restored.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error, "Failed to restore review."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   ADMIN: HANDLE REPORT
   PATCH /api/reviews/:id/reports/:reportId
   ═══════════════════════════════════════════════ */

export const handleReport = async (
  reviewId: string,
  reportId: string,
  payload: AdminReportActionPayload,
): Promise<ApiResponse<Review>> => {
  const res = await api.patch<ApiResponse<Review>>(
    `/reviews/${reviewId}/reports/${reportId}`,
    payload,
  );
  return res;
};

export const useHandleReport = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Review>,
    ApiError,
    { reviewId: string; reportId: string; payload: AdminReportActionPayload }
  >({
    mutationFn: ({ reviewId, reportId, payload }) =>
      handleReport(reviewId, reportId, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });

      toast.success("Report Handled", {
        description: response.message || "Report status updated.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error, "Failed to handle report."),
      });
    },
  });
};
