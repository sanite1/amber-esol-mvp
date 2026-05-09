import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type {
  AISession,
  AISessionMode,
  SessionListResponse,
  TurnResult,
  TeacherPrepNote,
  SessionAccessToken,
} from "../types/esol";

export interface CreateSessionRequest {
  learnerId: string;
  teacherId: string;
  bookingId?: string;
  sessionMode?: AISessionMode;
  topic?: string;
}

export interface ListSessionsQuery {
  page?: number;
  limit?: number;
  learnerId?: string;
  teacherId?: string;
}

export interface SubmitTurnRequest {
  sessionId: string;
  input: string;
}

/* ── Create session ── */

export const useCreateSession = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<AISession>, ApiError, CreateSessionRequest>({
    mutationFn: (data) =>
      api.post<ApiResponse<AISession>>("/esol/sessions", data),
    onSuccess: (res) => {
      toast.success(res.message || "Session created");
      qc.invalidateQueries({ queryKey: ["esolSessions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create session");
    },
  });
};

/* ── List sessions ── */

export const useListSessions = (query?: ListSessionsQuery) => {
  return useQuery<ApiResponse<SessionListResponse>, ApiError>({
    queryKey: [
      "esolSessions",
      query?.page,
      query?.limit,
      query?.learnerId,
      query?.teacherId,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.learnerId) params.append("learnerId", query.learnerId);
      if (query?.teacherId) params.append("teacherId", query.teacherId);
      const qs = params.toString();
      return api.get<ApiResponse<SessionListResponse>>(
        `/esol/sessions${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
};

/* ── Get single session ── */

export const useGetSession = (sessionId: string | undefined) => {
  return useQuery<ApiResponse<AISession>, ApiError>({
    queryKey: ["esolSession", sessionId],
    queryFn: () =>
      api.get<ApiResponse<AISession>>(`/esol/sessions/${sessionId}`),
    enabled: Boolean(sessionId),
  });
};

/* ── Submit turn (5-stage pipeline) ── */

export const useSubmitTurn = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<TurnResult>, ApiError, SubmitTurnRequest>({
    mutationFn: ({ sessionId, input }) =>
      api.post<ApiResponse<TurnResult>>(`/esol/sessions/${sessionId}/turns`, {
        input,
      }),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["esolSession", vars.sessionId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Could not send message");
    },
  });
};

/* ── Complete session ── */

export const useCompleteSession = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<AISession>, ApiError, string>({
    mutationFn: (sessionId) =>
      api.patch<ApiResponse<AISession>>(
        `/esol/sessions/${sessionId}/complete`,
        {},
      ),
    onSuccess: (res, sessionId) => {
      toast.success(res.message || "Session completed");
      qc.invalidateQueries({ queryKey: ["esolSession", sessionId] });
      qc.invalidateQueries({ queryKey: ["esolSessions"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to complete session");
    },
  });
};

/* ── Teacher prep note ── */

export const useGetPrepNote = (sessionId: string | undefined) => {
  return useQuery<ApiResponse<TeacherPrepNote>, ApiError>({
    queryKey: ["esolPrepNote", sessionId],
    queryFn: () =>
      api.get<ApiResponse<TeacherPrepNote>>(`/esol/sessions/${sessionId}/prep`),
    enabled: Boolean(sessionId),
  });
};

/* ── Generate access token ── */

export const useGenerateAccessToken = () => {
  return useMutation<ApiResponse<SessionAccessToken>, ApiError, string>({
    mutationFn: (sessionId) =>
      api.post<ApiResponse<SessionAccessToken>>(
        `/esol/sessions/${sessionId}/access-token`,
        {},
      ),
    onSuccess: () => {
      toast.success("Access token generated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to generate token");
    },
  });
};

/* ── Join session via token ── */

export const useJoinSession = () => {
  return useMutation<
    ApiResponse<{
      sessionId: string;
      sessionMode: AISessionMode;
      esolLevel: string;
      topic?: string;
    }>,
    ApiError,
    string
  >({
    mutationFn: (token) => api.post("/esol/sessions/join", { token }),
    onError: (err) => {
      toast.error(err.response?.data?.message || "Could not join session");
    },
  });
};
