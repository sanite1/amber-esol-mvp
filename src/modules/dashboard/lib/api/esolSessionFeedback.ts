import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";

export interface SessionFeedback {
  _id: string;
  sessionId: string;
  bookingId?: string | null;
  learnerId: string;
  teacherId?: string | null;
  orgId: string;
  learnerRating?: number;
  learnerComment?: string;
  teacherRating?: number;
  teacherComment?: string;
  topicsWorkedOn?: string[];
  progressNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitLearnerFeedbackRequest {
  emojiRating?: "struggling" | "okay" | "confident";
  rating?: number;
  comment?: string;
  topicsWorkedOn?: string[];
}

export interface SubmitTeacherFeedbackRequest {
  rating?: number;
  comment?: string;
  progressNotes?: string;
  topicsWorkedOn?: string[];
}

/* ── Get feedback for session ── */

export const useGetSessionFeedback = (sessionId: string | undefined) => {
  return useQuery<ApiResponse<SessionFeedback | null>, ApiError>({
    queryKey: ["esolSessionFeedback", sessionId],
    queryFn: () =>
      api.get<ApiResponse<SessionFeedback | null>>(
        `/esol/session-feedback/${sessionId}`,
      ),
    enabled: Boolean(sessionId),
  });
};

/* ── Submit learner feedback ── */

export const useSubmitLearnerFeedback = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<SessionFeedback>,
    ApiError,
    { sessionId: string; data: SubmitLearnerFeedbackRequest }
  >({
    mutationFn: ({ sessionId, data }) =>
      api.post<ApiResponse<SessionFeedback>>(
        `/esol/session-feedback/${sessionId}/learner`,
        data,
      ),
    onSuccess: (res, vars) => {
      toast.success(res.message || "Thanks for your feedback");
      qc.invalidateQueries({
        queryKey: ["esolSessionFeedback", vars.sessionId],
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    },
  });
};

/* ── Submit teacher feedback ── */

export const useSubmitTeacherFeedback = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<SessionFeedback>,
    ApiError,
    { sessionId: string; data: SubmitTeacherFeedbackRequest }
  >({
    mutationFn: ({ sessionId, data }) =>
      api.post<ApiResponse<SessionFeedback>>(
        `/esol/session-feedback/${sessionId}/teacher`,
        data,
      ),
    onSuccess: (res, vars) => {
      toast.success(res.message || "Feedback saved");
      qc.invalidateQueries({
        queryKey: ["esolSessionFeedback", vars.sessionId],
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to save feedback");
    },
  });
};
