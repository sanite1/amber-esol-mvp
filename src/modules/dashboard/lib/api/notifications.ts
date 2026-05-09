import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  NotificationQuery,
  ListNotificationsResponse,
  UnreadCountResponse,
  MarkReadResponse,
  MarkAllReadResponse,
} from "../types/notifications";

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
   LIST NOTIFICATIONS (authenticated)
   GET /api/notifications
   ═══════════════════════════════════════════════ */

export const fetchNotifications = async (
  query?: NotificationQuery,
): Promise<ApiResponse<ListNotificationsResponse>> => {
  const params = new URLSearchParams();

  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.read) params.append("read", query.read);
  if (query?.type) params.append("type", query.type);
  if (query?.sort) params.append("sort", query.sort);

  const url = params.toString()
    ? `/notifications?${params.toString()}`
    : "/notifications";

  const res = await api.get<ApiResponse<ListNotificationsResponse>>(url);
  return res;
};

export const useFetchNotifications = (query?: NotificationQuery) => {
  return useQuery<ApiResponse<ListNotificationsResponse>, ApiError>({
    queryKey: ["notifications", query],
    queryFn: () => fetchNotifications(query),
    refetchInterval: 60_000, // fallback polling every 60s
  });
};

/* ═══════════════════════════════════════════════
   GET UNREAD COUNT (authenticated)
   GET /api/notifications/unread-count
   ═══════════════════════════════════════════════ */

export const fetchUnreadCount = async (): Promise<
  ApiResponse<UnreadCountResponse>
> => {
  const res = await api.get<ApiResponse<UnreadCountResponse>>(
    "/notifications/unread-count",
  );
  return res;
};

export const useFetchUnreadCount = () => {
  return useQuery<ApiResponse<UnreadCountResponse>, ApiError>({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadCount,
    refetchInterval: 60_000, // fallback polling every 60s
  });
};

/* ═══════════════════════════════════════════════
   MARK SINGLE NOTIFICATION AS READ (authenticated)
   PATCH /api/notifications/:id/read
   ═══════════════════════════════════════════════ */

export const markNotificationRead = async (
  id: string,
): Promise<ApiResponse<MarkReadResponse>> => {
  const res = await api.patch<ApiResponse<MarkReadResponse>>(
    `/notifications/${id}/read`,
  );
  return res;
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<MarkReadResponse>, ApiError, string>({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      // Invalidate both the list and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to mark as read", {
        description: getErrorMessage(
          error,
          "Could not mark notification as read. Please try again.",
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   MARK ALL NOTIFICATIONS AS READ (authenticated)
   PATCH /api/notifications/read-all
   ═══════════════════════════════════════════════ */

export const markAllNotificationsRead = async (): Promise<
  ApiResponse<MarkAllReadResponse>
> => {
  const res = await api.patch<ApiResponse<MarkAllReadResponse>>(
    "/notifications/read-all",
  );
  return res;
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<MarkAllReadResponse>, ApiError, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      toast.success("All Read", {
        description:
          response.message || "All notifications have been marked as read.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed", {
        description: getErrorMessage(
          error,
          "Could not mark all notifications as read. Please try again.",
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   DELETE NOTIFICATION (authenticated)
   DELETE /api/notifications/:id
   ═══════════════════════════════════════════════ */

export const deleteNotification = async (id: string): Promise<ApiResponse> => {
  const res = await api.delete<ApiResponse>(`/notifications/${id}`);
  return res;
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, ApiError, string>({
    mutationFn: deleteNotification,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      toast.success("Notification Deleted", {
        description: response.message || "Notification has been removed.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Delete Failed", {
        description: getErrorMessage(
          error,
          "Could not delete notification. Please try again.",
        ),
      });
    },
  });
};
