import { ApiError, ApiResponse } from "../../../../lib/network/axios";
import api from "../../../../lib/network/api";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Conversation,
  StartConversationPayload,
  SendMessagePayload,
  ConversationFilters,
  MessageFilters,
  ListConversationsResponse,
  ListMessagesResponse,
  SendMessageResponse,
} from "../types/messaging";

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
   LIST CONVERSATIONS
   GET /api/conversations
   ═══════════════════════════════════════════════ */

export const fetchConversations = async (
  filters?: ConversationFilters,
): Promise<ApiResponse<ListConversationsResponse>> => {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);

  const res = await api.get<ApiResponse<ListConversationsResponse>>(
    `/conversations?${params.toString()}`,
  );
  return res;
};

export const useFetchConversations = (filters?: ConversationFilters) => {
  return useQuery<ApiResponse<ListConversationsResponse>, ApiError>({
    queryKey: ["conversations", filters],
    queryFn: () => fetchConversations(filters),
    refetchInterval: 30_000, // poll every 30s as fallback for WS
  });
};

/* ═══════════════════════════════════════════════
   START CONVERSATION
   POST /api/conversations
   ═══════════════════════════════════════════════ */

export const startConversation = async (
  payload: StartConversationPayload,
): Promise<ApiResponse<Conversation>> => {
  const res = await api.post<ApiResponse<Conversation>>(
    "/conversations",
    payload,
  );
  return res;
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Conversation>,
    ApiError,
    StartConversationPayload
  >({
    mutationFn: startConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to Start Conversation", {
        description: getErrorMessage(
          error,
          "Could not start conversation. Please try again.",
        ),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   FETCH MESSAGES (paginated)
   GET /api/conversations/:id/messages
   ═══════════════════════════════════════════════ */

export const fetchMessages = async (
  conversationId: string,
  filters?: MessageFilters,
): Promise<ApiResponse<ListMessagesResponse>> => {
  const params = new URLSearchParams();
  if (filters?.page) params.append("page", String(filters.page));
  if (filters?.limit) params.append("limit", String(filters.limit));

  const res = await api.get<ApiResponse<ListMessagesResponse>>(
    `/conversations/${conversationId}/messages?${params.toString()}`,
  );
  return res;
};

export const useFetchMessages = (
  conversationId: string | null,
  filters?: MessageFilters,
) => {
  return useQuery<ApiResponse<ListMessagesResponse>, ApiError>({
    queryKey: ["messages", conversationId, filters],
    queryFn: () => fetchMessages(conversationId!, filters),
    enabled: !!conversationId,
    placeholderData: (prev) => prev,
  });
};

/* ═══════════════════════════════════════════════
   FETCH MESSAGES (infinite scroll — load older)
   GET /api/conversations/:id/messages?page=N
   ═══════════════════════════════════════════════ */

export const useFetchMessagesInfinite = (
  conversationId: string | null,
  limit = 50,
) => {
  return useInfiniteQuery<ApiResponse<ListMessagesResponse>, ApiError>({
    queryKey: ["messagesInfinite", conversationId],
    queryFn: ({ pageParam = 1 }) =>
      fetchMessages(conversationId!, { page: pageParam as number, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!conversationId,
  });
};

/* ═══════════════════════════════════════════════
   SEND TEXT MESSAGE
   POST /api/conversations/:id/messages
   ═══════════════════════════════════════════════ */

export const sendMessage = async (
  conversationId: string,
  payload: SendMessagePayload,
): Promise<ApiResponse<SendMessageResponse>> => {
  const res = await api.post<ApiResponse<SendMessageResponse>>(
    `/conversations/${conversationId}/messages`,
    payload,
  );
  return res;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SendMessageResponse>,
    ApiError,
    { conversationId: string; payload: SendMessagePayload }
  >({
    mutationFn: ({ conversationId, payload }) =>
      sendMessage(conversationId, payload),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["messagesInfinite", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: ApiError) => {
      toast.error("Message Failed", {
        description: getErrorMessage(error, "Failed to send message."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   SEND FILE MESSAGE
   POST /api/conversations/:id/messages/file
   ═══════════════════════════════════════════════ */

export const sendFileMessage = async (
  conversationId: string,
  file: File,
): Promise<ApiResponse<SendMessageResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<ApiResponse<SendMessageResponse>>(
    `/conversations/${conversationId}/messages/file`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res;
};

export const useSendFileMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SendMessageResponse>,
    ApiError,
    { conversationId: string; file: File }
  >({
    mutationFn: ({ conversationId, file }) =>
      sendFileMessage(conversationId, file),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["messagesInfinite", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: ApiError) => {
      toast.error("Upload Failed", {
        description: getErrorMessage(error, "Failed to send file."),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   MARK CONVERSATION AS READ
   PATCH /api/conversations/:id/read
   ═══════════════════════════════════════════════ */

export const markConversationRead = async (
  conversationId: string,
): Promise<ApiResponse<void>> => {
  const res = await api.patch<ApiResponse<void>>(
    `/conversations/${conversationId}/read`,
  );
  return res;
};

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: markConversationRead,
    onSuccess: (_response, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   TOGGLE PIN
   PATCH /api/conversations/:id/pin
   ═══════════════════════════════════════════════ */

export const togglePin = async (
  conversationId: string,
): Promise<ApiResponse<Conversation>> => {
  const res = await api.patch<ApiResponse<Conversation>>(
    `/conversations/${conversationId}/pin`,
  );
  return res;
};

export const useTogglePin = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Conversation>, ApiError, string>({
    mutationFn: togglePin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   TOGGLE MUTE
   PATCH /api/conversations/:id/mute
   ═══════════════════════════════════════════════ */

export const toggleMute = async (
  conversationId: string,
): Promise<ApiResponse<Conversation>> => {
  const res = await api.patch<ApiResponse<Conversation>>(
    `/conversations/${conversationId}/mute`,
  );
  return res;
};

export const useToggleMute = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Conversation>, ApiError, string>({
    mutationFn: toggleMute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};

/* ═══════════════════════════════════════════════
   TOGGLE ARCHIVE
   PATCH /api/conversations/:id/archive
   ═══════════════════════════════════════════════ */

export const toggleArchive = async (
  conversationId: string,
): Promise<ApiResponse<Conversation>> => {
  const res = await api.patch<ApiResponse<Conversation>>(
    `/conversations/${conversationId}/archive`,
  );
  return res;
};

export const useToggleArchive = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Conversation>, ApiError, string>({
    mutationFn: toggleArchive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Conversation Updated");
    },
    onError: (error: ApiError) => {
      toast.error("Action Failed", {
        description: getErrorMessage(error),
      });
    },
  });
};
