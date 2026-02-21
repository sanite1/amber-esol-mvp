import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Booking,
  CreateBookingPayload,
  CreateBookingResponse,
  CancelBookingPayload,
  DeclineBookingPayload,
  BookingFilters,
  ListBookingsResponse,
  UpcomingQuery,
  UpcomingBookingsResponse,
  BookingStatsResponse,
} from "../types/booking";

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
   CREATE BOOKING (student)
   POST /api/bookings
   ═══════════════════════════════════════════════ */

export const createBooking = async (
  payload: CreateBookingPayload
): Promise<ApiResponse<CreateBookingResponse>> => {
  const res = await api.post<ApiResponse<CreateBookingResponse>>(
    "/bookings",
    payload
  );
  return res;
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<CreateBookingResponse>,
    ApiError,
    CreateBookingPayload
  >({
    mutationFn: createBooking,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });

      // If payment is required, the component will redirect to checkoutUrl
      // If free (trial), show success toast
      if (!response.data.paymentRequired) {
        toast.success("Booking Submitted", {
          description:
            response.message || "Your booking request has been sent.",
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("Booking Failed", {
        description: getErrorMessage(
          error,
          "Failed to create booking. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   LIST BOOKINGS (role-aware)
   GET /api/bookings
   ═══════════════════════════════════════════════ */

export const fetchBookings = async (
  filters: BookingFilters
): Promise<ApiResponse<ListBookingsResponse>> => {
  const params = new URLSearchParams();
  console.log("status");
  console.log(filters.status);

  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.status) params.append("status", filters.status);
  if (filters.type) params.append("type", filters.type);
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);

  const res = await api.get<ApiResponse<ListBookingsResponse>>(
    `/bookings?${params.toString()}`
  );
  return res;
};

export const useFetchBookings = (filters: BookingFilters) => {
  return useQuery<ApiResponse<ListBookingsResponse>, ApiError>({
    queryKey: ["bookings", filters],
    queryFn: () => fetchBookings(filters),
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   GET BOOKING BY ID
   GET /api/bookings/:id
   ═══════════════════════════════════════════════ */

export const fetchBookingById = async (
  id: string
): Promise<ApiResponse<Booking>> => {
  const res = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
  return res;
};

export const useFetchBookingById = (id: string) => {
  return useQuery<ApiResponse<Booking>, ApiError>({
    queryKey: ["booking", id],
    queryFn: () => fetchBookingById(id),
    enabled: !!id,
  });
};

/* ═══════════════════════════════════════════════
   UPCOMING BOOKINGS (dashboard widget)
   GET /api/bookings/upcoming
   ═══════════════════════════════════════════════ */

export const fetchUpcomingBookings = async (
  query?: UpcomingQuery
): Promise<ApiResponse<UpcomingBookingsResponse>> => {
  const params = new URLSearchParams();
  if (query?.limit) params.append("limit", String(query.limit));

  const res = await api.get<ApiResponse<UpcomingBookingsResponse>>(
    `/bookings/upcoming?${params.toString()}`
  );
  return res;
};

export const useFetchUpcomingBookings = (query?: UpcomingQuery) => {
  return useQuery<ApiResponse<UpcomingBookingsResponse>, ApiError>({
    queryKey: ["upcomingBookings", query?.limit],
    queryFn: () => fetchUpcomingBookings(query),
  });
};

/* ═══════════════════════════════════════════════
   BOOKING STATS
   GET /api/bookings/stats
   ═══════════════════════════════════════════════ */

export const fetchBookingStats = async (): Promise<
  ApiResponse<BookingStatsResponse>
> => {
  const res =
    await api.get<ApiResponse<BookingStatsResponse>>("/bookings/stats");
  return res;
};

export const useFetchBookingStats = () => {
  return useQuery<ApiResponse<BookingStatsResponse>, ApiError>({
    queryKey: ["bookingStats"],
    queryFn: fetchBookingStats,
  });
};

/* ═══════════════════════════════════════════════
   CONFIRM BOOKING (tutor)
   PATCH /api/bookings/:id/confirm
   ═══════════════════════════════════════════════ */

export const confirmBooking = async (
  id: string
): Promise<ApiResponse<Booking>> => {
  const res = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/confirm`);
  return res;
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Booking>, ApiError, string>({
    mutationFn: confirmBooking,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });

      toast.success("Booking Confirmed", {
        description:
          response.message || "The booking has been confirmed successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Confirmation Failed", {
        description: getErrorMessage(
          error,
          "Failed to confirm booking. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   DECLINE BOOKING (tutor)
   PATCH /api/bookings/:id/decline
   ═══════════════════════════════════════════════ */

export const declineBooking = async (
  id: string,
  payload: DeclineBookingPayload
): Promise<ApiResponse<Booking>> => {
  const res = await api.patch<ApiResponse<Booking>>(
    `/bookings/${id}/decline`,
    payload
  );
  return res;
};

export const useDeclineBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Booking>,
    ApiError,
    { id: string; payload: DeclineBookingPayload }
  >({
    mutationFn: ({ id, payload }) => declineBooking(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });

      toast.success("Booking Declined", {
        description:
          response.message ||
          "The booking has been declined. A refund will be issued if applicable.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Decline Failed", {
        description: getErrorMessage(
          error,
          "Failed to decline booking. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   CANCEL BOOKING (student / tutor / admin)
   PATCH /api/bookings/:id/cancel
   ═══════════════════════════════════════════════ */

export const cancelBooking = async (
  id: string,
  payload: CancelBookingPayload
): Promise<ApiResponse<Booking>> => {
  const res = await api.patch<ApiResponse<Booking>>(
    `/bookings/${id}/cancel`,
    payload
  );
  return res;
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Booking>,
    ApiError,
    { id: string; payload: CancelBookingPayload }
  >({
    mutationFn: ({ id, payload }) => cancelBooking(id, payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });

      toast.success("Booking Cancelled", {
        description: response.message || "The booking has been cancelled.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Cancellation Failed", {
        description: getErrorMessage(
          error,
          "Failed to cancel booking. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   COMPLETE BOOKING (tutor / admin)
   PATCH /api/bookings/:id/complete
   ═══════════════════════════════════════════════ */

export const completeBooking = async (
  id: string
): Promise<ApiResponse<Booking>> => {
  const res = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/complete`);
  return res;
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Booking>, ApiError, string>({
    mutationFn: completeBooking,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });

      toast.success("Lesson Completed", {
        description:
          response.message || "The lesson has been marked as completed.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(
          error,
          "Failed to mark lesson as completed. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   NO-SHOW (tutor / admin)
   PATCH /api/bookings/:id/no-show
   ═══════════════════════════════════════════════ */

export const noShowBooking = async (
  id: string
): Promise<ApiResponse<Booking>> => {
  const res = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/no-show`);
  return res;
};

export const useNoShowBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Booking>, ApiError, string>({
    mutationFn: noShowBooking,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });

      toast.success("Marked as No-Show", {
        description:
          response.message || "The lesson has been marked as a no-show.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(
          error,
          "Failed to mark as no-show. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   UPDATE MEETING URL (tutor)
   PATCH /api/bookings/:id/meeting-url
   ═══════════════════════════════════════════════ */

export const updateMeetingUrl = async (
  id: string,
  meetingUrl: string
): Promise<ApiResponse<Booking>> => {
  const res = await api.patch<ApiResponse<Booking>>(
    `/bookings/${id}/meeting-url`,
    { meetingUrl }
  );
  return res;
};

export const useUpdateMeetingUrl = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Booking>,
    ApiError,
    { id: string; meetingUrl: string }
  >({
    mutationFn: ({ id, meetingUrl }) => updateMeetingUrl(id, meetingUrl),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({ queryKey: ["tutorDashboard"] });

      toast.success("Meeting Link Updated", {
        description:
          response.message || "The meeting link has been updated successfully.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Update Failed", {
        description: getErrorMessage(
          error,
          "Failed to update meeting link. Please check the URL and try again."
        ),
      });
    },
  });
};
