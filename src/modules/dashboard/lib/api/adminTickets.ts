import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  AdminTicketsResponse,
  AdminTicketsQuery,
  AdminTicket,
} from "../types/adminTickets";

/* ═══════════════════════════════════════════════
   FETCH ADMIN TICKETS
   GET /api/tickets/admin
   ═══════════════════════════════════════════════ */

export const fetchAdminTickets = async (
  query?: AdminTicketsQuery
): Promise<ApiResponse<AdminTicketsResponse>> => {
  const params = new URLSearchParams();
  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  if (query?.search) params.append("search", query.search);
  if (query?.status && query.status !== "all")
    params.append("status", query.status);
  if (query?.category && query.category !== "all")
    params.append("category", query.category);
  if (query?.priority && query.priority !== "all")
    params.append("priority", query.priority);
  if (query?.submitterType && query.submitterType !== "all")
    params.append("submitterType", query.submitterType);
  if (query?.sort) params.append("sort", query.sort);

  const qs = params.toString();
  const res = await api.get<ApiResponse<AdminTicketsResponse>>(
    `/tickets/admin${qs ? `?${qs}` : ""}`
  );
  return res;
};

export const useFetchAdminTickets = (query?: AdminTicketsQuery) => {
  return useQuery<ApiResponse<AdminTicketsResponse>, ApiError>({
    queryKey: [
      "adminTickets",
      query?.page,
      query?.limit,
      query?.search,
      query?.status,
      query?.category,
      query?.priority,
      query?.submitterType,
      query?.sort,
    ],
    queryFn: () => fetchAdminTickets(query),
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   ADMIN REPLY
   POST /api/tickets/admin/:id/reply
   ═══════════════════════════════════════════════ */

export const adminReplyTicket = async (
  ticketId: string,
  message: string
): Promise<ApiResponse<AdminTicket>> => {
  const res = await api.post<ApiResponse<AdminTicket>>(
    `/tickets/admin/${ticketId}/reply`,
    { message }
  );
  return res;
};

export const useAdminReplyTicket = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<AdminTicket>,
    ApiError,
    { ticketId: string; message: string }
  >({
    mutationFn: ({ ticketId, message }) => adminReplyTicket(ticketId, message),
    onSuccess: () => {
      toast.success("Reply sent");
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send reply");
    },
  });
};

/* ═══════════════════════════════════════════════
   UPDATE STATUS
   PATCH /api/tickets/admin/:id/status
   ═══════════════════════════════════════════════ */

export const updateTicketStatus = async (
  ticketId: string,
  status: AdminTicket["status"]
): Promise<
  ApiResponse<{ id: string; status: string; resolvedAt?: string }>
> => {
  const res = await api.patch<
    ApiResponse<{ id: string; status: string; resolvedAt?: string }>
  >(`/tickets/admin/${ticketId}/status`, { status });
  return res;
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<{ id: string; status: string; resolvedAt?: string }>,
    ApiError,
    { ticketId: string; status: AdminTicket["status"] }
  >({
    mutationFn: ({ ticketId, status }) => updateTicketStatus(ticketId, status),
    onSuccess: (res) => {
      toast.success(res.message || "Status updated");
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });
};

/* ═══════════════════════════════════════════════
   UPDATE PRIORITY
   PATCH /api/tickets/admin/:id/priority
   ═══════════════════════════════════════════════ */

export const updateTicketPriority = async (
  ticketId: string,
  priority: AdminTicket["priority"]
): Promise<ApiResponse<{ id: string; priority: string }>> => {
  const res = await api.patch<ApiResponse<{ id: string; priority: string }>>(
    `/tickets/admin/${ticketId}/priority`,
    { priority }
  );
  return res;
};

export const useUpdateTicketPriority = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<{ id: string; priority: string }>,
    ApiError,
    { ticketId: string; priority: AdminTicket["priority"] }
  >({
    mutationFn: ({ ticketId, priority }) =>
      updateTicketPriority(ticketId, priority),
    onSuccess: (res) => {
      toast.success(res.message || "Priority updated");
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update priority");
    },
  });
};
