import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../../lib/network/api";
import { ApiError, ApiResponse } from "../../../../lib/network/axios";

// ==================== INTERFACES ====================

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory =
  | "account"
  | "payment"
  | "technical"
  | "project"
  | "verification"
  | "other";

export interface TicketAttachment {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface TicketResponseItem {
  _id: string;
  message: string;
  respondedBy: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    profilePicture?: string;
  };
  respondedByName: string;
  attachments?: TicketAttachment[];
  createdAt: string;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  email: string;
  userId?: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    profilePicture?: string;
  };
  attachments: TicketAttachment[];
  responses: TicketResponseItem[];
  assignedTo?: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketPayload {
  category: string;
  priority: string;
  subject: string;
  description: string;
  email: string;
  attachments: File[];
}

export interface TicketSubmitResponse {
  ticketNumber: string;
  _id: string;
}

export interface TicketQueryParams {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TicketListResponse {
  tickets: Ticket[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TicketStatsResponse {
  byStatus: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  total: number;
  recentTickets: Ticket[];
}

export interface RespondToTicketPayload {
  ticketId: string;
  message: string;
  status?: TicketStatus;
  attachments?: File[];
}

export interface UpdateTicketStatusPayload {
  ticketId: string;
  status: TicketStatus;
  assignedTo?: string;
}

// ==================== API FUNCTIONS ====================

// User: Submit a new ticket
export const submitTicket = async (
  payload: TicketPayload
): Promise<ApiResponse<TicketSubmitResponse>> => {
  const formData = new FormData();

  formData.append("category", payload.category);
  formData.append("priority", payload.priority);
  formData.append("subject", payload.subject);
  formData.append("description", payload.description);
  formData.append("email", payload.email);

  if (payload.attachments && payload.attachments.length > 0) {
    payload.attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  const res = await api.post<ApiResponse<TicketSubmitResponse>>(
    "/tickets",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res;
};

// Admin: Get all tickets with filters
export const getAdminTickets = async (
  params: TicketQueryParams
): Promise<ApiResponse<TicketListResponse>> => {
  const res = await api.get<ApiResponse<TicketListResponse>>("/tickets/admin", {
    ...params,
  });
  return res;
};

// Admin: Get single ticket by ID
export const getTicketById = async (
  ticketId: string
): Promise<ApiResponse<Ticket>> => {
  const res = await api.get<ApiResponse<Ticket>>(`/tickets/admin/${ticketId}`);
  return res;
};

// Admin: Get ticket statistics
export const getTicketStats = async (): Promise<
  ApiResponse<TicketStatsResponse>
> => {
  const res = await api.get<ApiResponse<TicketStatsResponse>>(
    "/tickets/admin/stats"
  );
  return res;
};

// Admin: Respond to a ticket
export const respondToTicket = async (
  payload: RespondToTicketPayload
): Promise<ApiResponse<Ticket>> => {
  const formData = new FormData();

  formData.append("message", payload.message);
  if (payload.status) {
    formData.append("status", payload.status);
  }

  if (payload.attachments && payload.attachments.length > 0) {
    payload.attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  const res = await api.post<ApiResponse<Ticket>>(
    `/tickets/admin/${payload.ticketId}/respond`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res;
};

// Admin: Update ticket status
export const updateTicketStatus = async (
  payload: UpdateTicketStatusPayload
): Promise<ApiResponse<Ticket>> => {
  const res = await api.patch<ApiResponse<Ticket>>(
    `/tickets/admin/${payload.ticketId}/status`,
    {
      status: payload.status,
      assignedTo: payload.assignedTo,
    }
  );
  return res;
};

// User: Track ticket by number
export const trackTicket = async (
  ticketNumber: string
): Promise<ApiResponse<Ticket>> => {
  const res = await api.get<ApiResponse<Ticket>>(
    `/tickets/track/${ticketNumber}`
  );
  return res;
};

// User: Get my tickets
export const getMyTickets = async (
  params: TicketQueryParams
): Promise<ApiResponse<TicketListResponse>> => {
  const res = await api.get<ApiResponse<TicketListResponse>>(
    "/tickets/my-tickets",
    { ...params }
  );
  return res;
};

// ==================== HOOKS ====================

// User: Submit ticket
export const useSubmitTicket = () => {
  return useMutation<
    ApiResponse<TicketSubmitResponse>,
    ApiError,
    TicketPayload
  >({
    mutationFn: submitTicket,
    onSuccess: (response) => {
      toast.success("Ticket Submitted", {
        description:
          response.message ||
          `Your ticket ${response.data?.ticketNumber} has been created successfully.`,
      });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.fields?.[0]?.message ||
        error.response?.data?.message ||
        "Failed to submit ticket. Please try again.";

      toast.error("Submission Failed", {
        description: errorMessage,
      });
    },
  });
};

// Admin: Get all tickets
export const useGetAdminTickets = (params: TicketQueryParams) => {
  return useQuery<ApiResponse<TicketListResponse>, ApiError>({
    queryKey: ["admin-tickets", params],
    queryFn: () => getAdminTickets(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Admin: Get single ticket
export const useGetTicketById = (ticketId: string | null) => {
  return useQuery<ApiResponse<Ticket>, ApiError>({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketById(ticketId!),
    enabled: !!ticketId,
    staleTime: 1000 * 60, // 1 minute
  });
};

// Admin: Get ticket stats
export const useGetTicketStats = () => {
  return useQuery<ApiResponse<TicketStatsResponse>, ApiError>({
    queryKey: ["ticket-stats"],
    queryFn: getTicketStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Admin: Respond to ticket
export const useRespondToTicket = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Ticket>, ApiError, RespondToTicketPayload>({
    mutationFn: respondToTicket,
    onSuccess: (response, variables) => {
      toast.success("Response Sent", {
        description: "Your response has been sent to the user.",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["ticket-stats"] });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || "Failed to send response.";
      toast.error("Response Failed", {
        description: errorMessage,
      });
    },
  });
};

// Admin: Update ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Ticket>, ApiError, UpdateTicketStatusPayload>({
    mutationFn: updateTicketStatus,
    onSuccess: (response, variables) => {
      toast.success("Status Updated", {
        description: `Ticket status changed to ${variables.status.replace("_", " ")}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      queryClient.invalidateQueries({
        queryKey: ["ticket", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["ticket-stats"] });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update status.";
      toast.error("Update Failed", {
        description: errorMessage,
      });
    },
  });
};

// User: Track ticket
export const useTrackTicket = (ticketNumber: string | null) => {
  return useQuery<ApiResponse<Ticket>, ApiError>({
    queryKey: ["track-ticket", ticketNumber],
    queryFn: () => trackTicket(ticketNumber!),
    enabled: !!ticketNumber,
  });
};

// User: Get my tickets
export const useGetMyTickets = (params: TicketQueryParams) => {
  return useQuery<ApiResponse<TicketListResponse>, ApiError>({
    queryKey: ["my-tickets", params],
    queryFn: () => getMyTickets(params),
    staleTime: 1000 * 60 * 2,
  });
};
