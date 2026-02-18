import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DateOverride,
  GetAvailabilityResponse,
  SetSchedulePayload,
  SetScheduleResponse,
  UpdateSettingsPayload,
  UpdateSettingsResponse,
  CreateOverridePayload,
  AvailableSlotsQuery,
  GetAvailableSlotsResponse,
} from "../types/availability";

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
   GET AVAILABILITY (public)
   GET /api/availability/:tutorId
   ═══════════════════════════════════════════════ */

export const fetchAvailability = async (
  tutorId: string
): Promise<ApiResponse<GetAvailabilityResponse>> => {
  const res = await api.get<ApiResponse<GetAvailabilityResponse>>(
    `/availability/${tutorId}`
  );
  return res;
};

export const useFetchAvailability = (tutorId: string) => {
  return useQuery<ApiResponse<GetAvailabilityResponse>, ApiError>({
    queryKey: ["availability", tutorId],
    queryFn: () => fetchAvailability(tutorId),
    enabled: !!tutorId,
  });
};

/* ═══════════════════════════════════════════════
   SET / REPLACE WEEKLY SCHEDULE (authenticated tutor)
   PUT /api/availability
   ═══════════════════════════════════════════════ */

export const setSchedule = async (
  payload: SetSchedulePayload
): Promise<ApiResponse<SetScheduleResponse>> => {
  const res = await api.put<ApiResponse<SetScheduleResponse>>(
    "/availability",
    payload
  );
  return res;
};

export const useSetSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SetScheduleResponse>,
    ApiError,
    SetSchedulePayload
  >({
    mutationFn: setSchedule,
    onSuccess: (response) => {
      // Invalidate availability queries so components refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["availability"] });

      toast.success("Schedule Updated", {
        description: response.message || "Your weekly schedule has been saved.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Schedule Update Failed", {
        description: getErrorMessage(
          error,
          "Failed to update schedule. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   UPDATE BOOKING SETTINGS (authenticated tutor)
   PATCH /api/availability/settings
   ═══════════════════════════════════════════════ */

export const updateAvailabilitySettings = async (
  payload: UpdateSettingsPayload
): Promise<ApiResponse<UpdateSettingsResponse>> => {
  const res = await api.patch<ApiResponse<UpdateSettingsResponse>>(
    "/availability/settings",
    payload
  );
  return res;
};

export const useUpdateAvailabilitySettings = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UpdateSettingsResponse>,
    ApiError,
    UpdateSettingsPayload
  >({
    mutationFn: updateAvailabilitySettings,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });

      toast.success("Settings Updated", {
        description:
          response.message || "Your booking settings have been saved.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Settings Update Failed", {
        description: getErrorMessage(
          error,
          "Failed to update settings. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   CREATE DATE OVERRIDE (authenticated tutor)
   POST /api/availability/overrides
   ═══════════════════════════════════════════════ */

export const createOverride = async (
  payload: CreateOverridePayload
): Promise<ApiResponse<DateOverride>> => {
  const res = await api.post<ApiResponse<DateOverride>>(
    "/availability/overrides",
    payload
  );
  return res;
};

export const useCreateOverride = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<DateOverride>,
    ApiError,
    CreateOverridePayload
  >({
    mutationFn: createOverride,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });

      toast.success("Override Created", {
        description: response.message || "Date override has been added.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Override Failed", {
        description: getErrorMessage(
          error,
          "Failed to create date override. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   DELETE DATE OVERRIDE (authenticated tutor)
   DELETE /api/availability/overrides/:id
   ═══════════════════════════════════════════════ */

export const deleteOverride = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete<ApiResponse>(`/availability/overrides/${id}`);
  return res;
};

export const useDeleteOverride = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, string>({
    mutationFn: deleteOverride,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });

      toast.success("Override Removed", {
        description: response.message || "Date override has been removed.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Remove Failed", {
        description: getErrorMessage(
          error,
          "Failed to remove date override. Please try again."
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   GET AVAILABLE SLOTS (public)
   GET /api/availability/:tutorId/slots?date=YYYY-MM-DD&duration=60
   ═══════════════════════════════════════════════ */

export const fetchAvailableSlots = async (
  tutorId: string,
  query: AvailableSlotsQuery
): Promise<ApiResponse<GetAvailableSlotsResponse>> => {
  const params = new URLSearchParams();
  params.append("date", query.date);
  if (query.duration) params.append("duration", String(query.duration));

  const res = await api.get<ApiResponse<GetAvailableSlotsResponse>>(
    `/availability/${tutorId}/slots?${params.toString()}`
  );
  return res;
};

export const useFetchAvailableSlots = (
  tutorId: string,
  query: AvailableSlotsQuery
) => {
  return useQuery<ApiResponse<GetAvailableSlotsResponse>, ApiError>({
    queryKey: ["availableSlots", tutorId, query.date, query.duration],
    queryFn: () => fetchAvailableSlots(tutorId, query),
    enabled: !!tutorId && !!query.date,
  });
};
