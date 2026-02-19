import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";

import {
  useFetchConversations,
  useFetchMessages,
  useSendMessage,
  useSendFileMessage,
  useMarkConversationRead,
} from "../../lib/api/messaging";
import { UIConversation, UIMessage } from "../../lib/types/messaging";
import {
  getCurrentUserId,
  mapConversations,
  mapMessages,
} from "../../lib/utils/messagingHelpers";

import ConversationList from "../../components/student/messages/ConversationList";
import ChatArea from "../../components/student/messages/ChatArea";
import EmptyChat from "../../components/student/messages/EmptyChat";
import {
  ConversationListSkeleton,
  ChatAreaSkeleton,
} from "../../components/student/messages/MessagesSkeleton";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(searchParams.get("chat"));
  const [searchQuery, setSearchQuery] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState<UIMessage[]>([]);

  const currentUserId = getCurrentUserId();
  const optimisticIdCounter = useRef(0);

  const debouncedSearch = useDebounce(searchQuery.trim(), 400);

  // ── Fetch conversations ──
  const {
    data: conversationsRes,
    isLoading: conversationsLoading,
    isError: conversationsError,
  } = useFetchConversations(
    debouncedSearch ? { search: debouncedSearch } : undefined
  );

  // ── Fetch messages for active conversation ──
  const { data: messagesRes, isLoading: messagesLoading } = useFetchMessages(
    activeConversationId,
    { limit: 100 }
  );

  // ── Mutations ──
  const sendMessageMutation = useSendMessage();
  const sendFileMutation = useSendFileMessage();
  const markReadMutation = useMarkConversationRead();

  // ── Map API data to UI shapes ──
  const conversations: UIConversation[] = useMemo(() => {
    if (!conversationsRes?.data?.conversations) return [];
    return mapConversations(conversationsRes.data.conversations, currentUserId);
  }, [conversationsRes, currentUserId]);

  const serverMessages: UIMessage[] = useMemo(() => {
    if (!messagesRes?.data?.messages) return [];
    return mapMessages(messagesRes.data.messages);
  }, [messagesRes]);

  const activeMessages: UIMessage[] = useMemo(() => {
    const pending = optimisticMessages.filter(
      (m) => m.conversationId === activeConversationId
    );
    return [...serverMessages, ...pending];
  }, [serverMessages, optimisticMessages, activeConversationId]);

  useEffect(() => {
    if (serverMessages.length > 0 && activeConversationId) {
      setOptimisticMessages((prev) =>
        prev.filter(
          (m) =>
            m.conversationId !== activeConversationId || m.status === "pending"
        )
      );
    }
  }, [serverMessages, activeConversationId]);

  // ── URL param handling ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (conversations.length === 0) return;

    const chatParam = searchParams.get("chat");
    const tutorParam = searchParams.get("tutor");

    if (chatParam) {
      const conv = conversations.find((c) => c.id === chatParam);
      if (conv) {
        setActiveConversationId(conv.id);
        return;
      }
    }

    if (tutorParam) {
      const conv = conversations.find((c) => c.participantSlug === tutorParam);
      if (conv) {
        setActiveConversationId(conv.id);
        setSearchParams({ chat: conv.id }, { replace: true });
      }
    }
  }, [conversations, searchParams, setSearchParams]);

  // ── Handlers ──
  const handleSelectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      setSearchParams({ chat: id }, { replace: true });
      markReadMutation.mutate(id);
    },
    [setSearchParams, markReadMutation]
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeConversationId) return;

      const tempId = `optimistic-${Date.now()}-${optimisticIdCounter.current++}`;
      const optimisticMsg: UIMessage = {
        id: tempId,
        conversationId: activeConversationId,
        senderId: currentUserId,
        senderName: "You",
        senderAvatar: "",
        content,
        type: "text",
        createdAt: new Date().toISOString(),
        isRead: true,
        status: "pending",
      };

      setOptimisticMessages((prev) => [...prev, optimisticMsg]);

      sendMessageMutation.mutate(
        {
          conversationId: activeConversationId,
          payload: { content },
        },
        {
          onSuccess: () => {
            setOptimisticMessages((prev) =>
              prev.filter((m) => m.id !== tempId)
            );
          },
          onError: () => {
            setOptimisticMessages((prev) =>
              prev.map((m) =>
                m.id === tempId ? { ...m, status: "failed" as const } : m
              )
            );
          },
        }
      );
    },
    [activeConversationId, currentUserId, sendMessageMutation]
  );

  const handleSendFile = useCallback(
    (file: File) => {
      if (!activeConversationId) return;

      const tempId = `optimistic-file-${Date.now()}-${optimisticIdCounter.current++}`;
      const isImage = file.type.startsWith("image/");
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

      const optimisticMsg: UIMessage = {
        id: tempId,
        conversationId: activeConversationId,
        senderId: currentUserId,
        senderName: "You",
        senderAvatar: "",
        content: "",
        type: isImage ? "image" : "file",
        fileName: file.name,
        fileUrl: previewUrl,
        createdAt: new Date().toISOString(),
        isRead: true,
        status: "pending",
      };

      setOptimisticMessages((prev) => [...prev, optimisticMsg]);

      sendFileMutation.mutate(
        {
          conversationId: activeConversationId,
          file,
        },
        {
          onSuccess: () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setOptimisticMessages((prev) =>
              prev.filter((m) => m.id !== tempId)
            );
          },
          onError: () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setOptimisticMessages((prev) =>
              prev.map((m) =>
                m.id === tempId ? { ...m, status: "failed" as const } : m
              )
            );
          },
        }
      );
    },
    [activeConversationId, currentUserId, sendFileMutation]
  );

  const handleBack = useCallback(() => {
    setActiveConversationId(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Only true on very first mount with zero cached data
  const isInitialLoad = conversationsLoading && conversations.length === 0;
  // True when refetching after a search change (data already exists)
  const isSearchRefetching = conversationsLoading && !conversationsLoading;

  return (
    <div className="-mt-2 sm:-mt-4 lg:-mt-6">
      {/* Header */}
      <div className="mb-4 pt-2 sm:pt-4 lg:pt-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B2343] tracking-tight">
            Messages
          </h1>
          {totalUnread > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-[#ff7c22] text-white text-xs font-bold">
              {totalUnread}
            </span>
          )}
        </div>
        <p className="text-sm text-[#0B2343]/40 mt-1">
          Chat with your tutors about lessons, materials, and progress.
        </p>
      </div>

      {/* Chat container */}
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] overflow-hidden h-[calc(100vh-13rem)]">
        {conversationsError ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-[#0B2343]/60 text-sm">
                Failed to load conversations.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-[#ff7c22] hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full">
            {/* ── Left panel: search + conversation list ── */}
            <div
              className={`w-full lg:w-80 shrink-0 border-r border-[#0B2343]/[0.06] flex flex-col ${
                activeConversationId ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Search bar — always mounted, never replaced by skeleton */}
              <div className="shrink-0 border-b border-[#0B2343]/[0.06] bg-white px-4 py-3">
                <h2 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] mb-3">
                  Messages
                  {totalUnread > 0 && (
                    <span className="ml-1.5 text-[10px] font-bold text-white bg-[#ff7c22] px-1.5 py-0.5 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B2343]/30" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-sm rounded-lg bg-[#F8F9FB] border border-[#0B2343]/[0.06] text-[#0B2343] placeholder:text-[#0B2343]/30 outline-none focus:ring-2 focus:ring-[#ff7c22]/20 focus:border-[#ff7c22]/30 transition-all"
                  />
                  {isSearchRefetching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff7c22]/60 animate-spin" />
                  )}
                </div>
              </div>

              {/* List area — skeleton only here, search bar stays */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {isInitialLoad || isSearchRefetching ? (
                  <ConversationListSkeleton />
                ) : (
                  <ConversationList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={handleSelectConversation}
                  />
                )}
              </div>
            </div>

            {/* ── Right panel: chat area ── */}
            <div
              className={`flex-1 min-w-0 ${
                activeConversationId
                  ? "flex flex-col"
                  : "hidden lg:flex lg:flex-col"
              }`}
            >
              {activeConversation ? (
                <ChatArea
                  conversation={activeConversation}
                  messages={activeMessages}
                  onSend={handleSendMessage}
                  onSendFile={handleSendFile}
                  onBack={handleBack}
                  isLoadingMessages={messagesLoading}
                  isSending={false}
                />
              ) : (
                <EmptyChat />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
