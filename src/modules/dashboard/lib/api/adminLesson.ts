import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AdminLessonsStats } from "../types/adminLesson";
import type { Booking } from "../types/booking";

/* ──────────────────────────────────────────────
   Helper
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
   ADMIN: LESSON STATS
   GET /api/bookings/admin/stats
   ═══════════════════════════════════════════════ */

export const fetchAdminLessonStats = async (): Promise<
  ApiResponse<AdminLessonsStats>
> => {
  const res = await api.get<ApiResponse<AdminLessonsStats>>(
    "/bookings/admin/stats",
  );
  return res;
};

export const useFetchAdminLessonStats = () => {
  return useQuery<ApiResponse<AdminLessonsStats>, ApiError>({
    queryKey: ["adminLessonStats"],
    queryFn: fetchAdminLessonStats,
  });
};

/* ═══════════════════════════════════════════════
   ADMIN: FLAG / UNFLAG BOOKING
   PATCH /api/bookings/:id/flag
   ═══════════════════════════════════════════════ */

interface FlagBookingPayload {
  flagged: boolean;
  flagReason?: string;
}

export const flagBooking = async (
  id: string,
  payload: FlagBookingPayload,
): Promise<ApiResponse<Booking>> => {
  const res = await api.patch<ApiResponse<Booking>>(
    `/bookings/${id}/flag`,
    payload,
  );
  return res;
};

export const useFlagBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Booking>,
    ApiError,
    { id: string; payload: FlagBookingPayload }
  >({
    mutationFn: ({ id, payload }) => flagBooking(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["adminLessonStats"] });

      toast.success("Lesson Updated", {
        description: response.message,
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};
