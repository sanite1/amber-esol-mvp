import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../../lib/network/axios";
import type { PaginatedResponse } from "../types/esol";

export interface VocabItem {
  _id: string;
  learnerId: string;
  orgId: string;
  sessionId: string;
  word: string;
  definition?: string;
  contextSentence?: string;
  esolLevel: string;
  topic?: string;
  introducedAt: string;
  revisedAt?: string;
  masteryScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VocabListResponse extends PaginatedResponse<VocabItem> {
  vocab: VocabItem[];
}

export interface ListVocabQuery {
  page?: number;
  limit?: number;
  learnerId?: string;
  esolLevel?: string;
  topic?: string;
  search?: string;
}

/* ── List vocab ── */

export const useListVocab = (query?: ListVocabQuery) => {
  return useQuery<ApiResponse<VocabListResponse>, ApiError>({
    queryKey: [
      "esolVocab",
      query?.page,
      query?.limit,
      query?.learnerId,
      query?.esolLevel,
      query?.topic,
      query?.search,
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.learnerId) params.append("learnerId", query.learnerId);
      if (query?.esolLevel) params.append("esolLevel", query.esolLevel);
      if (query?.topic) params.append("topic", query.topic);
      if (query?.search) params.append("search", query.search);
      const qs = params.toString();
      return api.get<ApiResponse<VocabListResponse>>(
        `/esol/vocab${qs ? `?${qs}` : ""}`,
      );
    },
    placeholderData: (prev) => prev,
  });
};

/* ── Update mastery ── */

export const useUpdateMastery = () => {
  const qc = useQueryClient();
  return useMutation<
    ApiResponse<VocabItem>,
    ApiError,
    { vocabId: string; masteryScore: number }
  >({
    mutationFn: ({ vocabId, masteryScore }) =>
      api.patch<ApiResponse<VocabItem>>(`/esol/vocab/${vocabId}/mastery`, {
        masteryScore,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["esolVocab"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update mastery");
    },
  });
};
