import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MyTutorsQuery,
  ListMyTutorsResponse,
  MyTutor,
  ToggleFavouriteResponse,
} from "../types/myTutors";

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
   LIST MY TUTORS (authenticated student)
   GET /api/my-tutors
   ═══════════════════════════════════════════════ */

export const fetchMyTutors = async (
  query?: MyTutorsQuery
): Promise<ApiResponse<ListMyTutorsResponse>> => {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);
  if (query?.filter) params.append("filter", query.filter);
  if (query?.sort) params.append("sort", query.sort);

  const url = params.toString()
    ? `/my-tutors?${params.toString()}`
    : "/my-tutors";

  const res = await api.get<ApiResponse<ListMyTutorsResponse>>(url);
  return res;
};

export const useFetchMyTutors = (query: MyTutorsQuery) => {
  return useQuery({
    queryKey: ["my-tutors", query],
    queryFn: () => fetchMyTutors(query),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // keep old data visible during refetch
  });
};

/* ═══════════════════════════════════════════════
   GET MY TUTOR DETAIL (authenticated student)
   GET /api/my-tutors/:tutorId
   ═══════════════════════════════════════════════ */

export const fetchMyTutorDetail = async (
  tutorId: string
): Promise<ApiResponse<MyTutor>> => {
  const res = await api.get<ApiResponse<MyTutor>>(`/my-tutors/${tutorId}`);
  return res;
};

export const useFetchMyTutorDetail = (tutorId: string) => {
  return useQuery<ApiResponse<MyTutor>, ApiError>({
    queryKey: ["my-tutors", tutorId],
    queryFn: () => fetchMyTutorDetail(tutorId),
    enabled: !!tutorId,
  });
};

/* ═══════════════════════════════════════════════
   TOGGLE FAVOURITE (authenticated student)
   POST /api/my-tutors/:tutorId/favourite
   ═══════════════════════════════════════════════ */

export const toggleFavouriteTutor = async (
  tutorId: string
): Promise<ApiResponse<ToggleFavouriteResponse>> => {
  const res = await api.post<ApiResponse<ToggleFavouriteResponse>>(
    `/my-tutors/${tutorId}/favourite`,
    {}
  );
  return res;
};

export const useToggleFavouriteTutor = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ToggleFavouriteResponse>, ApiError, string>({
    mutationFn: toggleFavouriteTutor,
    onSuccess: (response) => {
      // Invalidate the list so summary stats and favourite status refresh
      queryClient.invalidateQueries({ queryKey: ["my-tutors"] });

      const isFav = response.data?.isFavourite;
      toast.success(isFav ? "Added to Favourites" : "Removed from Favourites", {
        description: isFav
          ? "This tutor has been added to your favourites."
          : "This tutor has been removed from your favourites.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(
          error,
          "Could not update favourite status. Please try again."
        ),
      });
    },
  });
};
