import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, Archive } from "lucide-react";

import {
  useFetchConversations,
  useFetchMessages,
  useSendMessage,
  useSendFileMessage,
  useMarkConversationRead,
  useTogglePin,
  useToggleMute,
  useToggleArchive,
} from "../../lib/api/messaging";
import type {
  TutorUIConversation,
  TutorChatMessage,
} from "../../lib/types/messaging";
import {
  getCurrentUserId,
  mapTutorConversations,
  mapTutorMessages,
} from "../../lib/utils/messagingHelpers";

import ConversationList from "../../components/tutor/messages/ConversationList";
import ChatArea from "../../components/tutor/messages/ChatArea";
import EmptyChatState from "../../components/tutor/messages/EmptyChatState";
import { ConversationListSkeleton } from "../../components/tutor/messages/MessagesSkeleton";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function TutorMessages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(searchParams.get("chat"));
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState<
    TutorChatMessage[]
  >([]);

  const currentUserId = getCurrentUserId();
  const optimisticIdCounter = useRef(0);

  const debouncedSearch = useDebounce(searchQuery.trim(), 400);

  // ── Fetch conversations ──
  const {
    data: conversationsRes,
    isLoading: conversationsLoading,
    isError: conversationsError,
  } = useFetchConversations(
    debouncedSearch ? { search: debouncedSearch } : undefined,
  );

  // ── Fetch messages for active conversation ──
  const { data: messagesRes, isLoading: messagesLoading } = useFetchMessages(
    activeConversationId,
    { limit: 100 },
  );

  // ── Mutations ──
  const sendMessageMutation = useSendMessage();
  const sendFileMutation = useSendFileMessage();
  const markReadMutation = useMarkConversationRead();
  const togglePinMutation = useTogglePin();
  const toggleMuteMutation = useToggleMute();
  const toggleArchiveMutation = useToggleArchive();

  // ── Map API data to UI shapes ──
  const conversations: TutorUIConversation[] = useMemo(() => {
    if (!conversationsRes?.data?.conversations) return [];
    return mapTutorConversations(
      conversationsRes.data.conversations,
      currentUserId,
    );
  }, [conversationsRes, currentUserId]);

  const serverMessages: TutorChatMessage[] = useMemo(() => {
    if (!messagesRes?.data?.messages) return [];
    return mapTutorMessages(messagesRes.data.messages);
  }, [messagesRes]);

  const activeMessages: TutorChatMessage[] = useMemo(() => {
    const pending = optimisticMessages.filter(
      (m) => m.conversationId === activeConversationId,
    );
    return [...serverMessages, ...pending];
  }, [serverMessages, optimisticMessages, activeConversationId]);

  // Clear optimistic messages when server refreshes
  useEffect(() => {
    if (serverMessages.length > 0 && activeConversationId) {
      setOptimisticMessages((prev) =>
        prev.filter(
          (m) =>
            m.conversationId !== activeConversationId || m.status === "pending",
        ),
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
    const studentParam = searchParams.get("student");

    if (chatParam) {
      const conv = conversations.find((c) => c.id === chatParam);
      if (conv) {
        setActiveConversationId(conv.id);
        return;
      }
    }

    if (studentParam) {
      const conv = conversations.find((c) => c.student.id === studentParam);
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
      setOptimisticMessages([]);
    },
    [setSearchParams, markReadMutation],
  );

  const handleSendMessage = useCallback(
    (convId: string, text: string) => {
      const tempId = `optimistic-${Date.now()}-${optimisticIdCounter.current++}`;
      const optimisticMsg: TutorChatMessage = {
        id: tempId,
        conversationId: convId,
        senderId: currentUserId,
        senderType: "tutor",
        senderName: "You",
        text,
        type: "text",
        timestamp: new Date().toISOString(),
        read: true,
        status: "pending",
      };

      setOptimisticMessages((prev) => [...prev, optimisticMsg]);

      sendMessageMutation.mutate(
        {
          conversationId: convId,
          payload: { content: text },
        },
        {
          onSuccess: () => {
            setOptimisticMessages((prev) =>
              prev.filter((m) => m.id !== tempId),
            );
          },
          onError: () => {
            setOptimisticMessages((prev) =>
              prev.map((m) =>
                m.id === tempId ? { ...m, status: "failed" as const } : m,
              ),
            );
          },
        },
      );
    },
    [currentUserId, sendMessageMutation],
  );

  const handleSendFile = useCallback(
    (convId: string, file: File) => {
      const tempId = `optimistic-file-${Date.now()}-${optimisticIdCounter.current++}`;
      const isImage = file.type.startsWith("image/");
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

      const optimisticMsg: TutorChatMessage = {
        id: tempId,
        conversationId: convId,
        senderId: currentUserId,
        senderType: "tutor",
        senderName: "You",
        text: "",
        type: isImage ? "image" : "file",
        fileName: file.name,
        fileUrl: previewUrl,
        timestamp: new Date().toISOString(),
        read: true,
        status: "pending",
      };

      setOptimisticMessages((prev) => [...prev, optimisticMsg]);

      sendFileMutation.mutate(
        {
          conversationId: convId,
          file,
        },
        {
          onSuccess: () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setOptimisticMessages((prev) =>
              prev.filter((m) => m.id !== tempId),
            );
          },
          onError: () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setOptimisticMessages((prev) =>
              prev.map((m) =>
                m.id === tempId ? { ...m, status: "failed" as const } : m,
              ),
            );
          },
        },
      );
    },
    [currentUserId, sendFileMutation],
  );

  const handlePin = useCallback(
    (id: string) => togglePinMutation.mutate(id),
    [togglePinMutation],
  );

  const handleMute = useCallback(
    (id: string) => toggleMuteMutation.mutate(id),
    [toggleMuteMutation],
  );

  const handleArchive = useCallback(
    (id: string) => toggleArchiveMutation.mutate(id),
    [toggleArchiveMutation],
  );

  const handleBack = useCallback(() => {
    setActiveConversationId(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  const totalUnread = conversations
    .filter((c) => !c.archived)
    .reduce((sum, c) => sum + c.unreadCount, 0);

  const archivedCount = conversations.filter((c) => c.archived).length;

  const isInitialLoad = conversationsLoading && conversations.length === 0;
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
          Chat with your students about lessons, progress, and materials.
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
              {/* Search bar + archive toggle — always mounted */}
              <div className="shrink-0 border-b border-[#0B2343]/[0.06] bg-white px-3 pt-3 pb-2.5 sm:px-4 sm:pt-4">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <h2 className="text-[13px] sm:text-sm font-semibold text-[#0B2343]">
                    {showArchived ? "Archived" : "Messages"}
                    {!showArchived && totalUnread > 0 && (
                      <span className="ml-1.5 text-[10px] font-bold text-white bg-[#ff7c22] px-1.5 py-0.5 rounded-full">
                        {totalUnread}
                      </span>
                    )}
                  </h2>
                  {archivedCount > 0 && (
                    <button
                      onClick={() => setShowArchived(!showArchived)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors ${
                        showArchived
                          ? "bg-[#0B2343] text-white"
                          : "text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04]"
                      }`}
                    >
                      <Archive size={11} />
                      <span className="hidden sm:inline">
                        Archived{archivedCount > 0 ? ` (${archivedCount})` : ""}
                      </span>
                      <span className="sm:hidden">
                        {archivedCount > 0 ? archivedCount : ""}
                      </span>
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0B2343]/20"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students..."
                    className="w-full pl-8 pr-8 py-1.5 sm:py-2 rounded-lg border border-[#0B2343]/[0.06] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors"
                  />
                  {isSearchRefetching && (
                    <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#ff7c22]/60 animate-spin" />
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
                    activeId={activeConversationId}
                    onSelect={handleSelectConversation}
                    onPin={handlePin}
                    onMute={handleMute}
                    onArchive={handleArchive}
                    showArchived={showArchived}
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
                  tutorId={currentUserId}
                  onSendMessage={handleSendMessage}
                  onSendFile={handleSendFile}
                  onBack={handleBack}
                  onPin={handlePin}
                  onMute={handleMute}
                  onArchive={handleArchive}
                  isLoadingMessages={messagesLoading}
                  isSending={false}
                />
              ) : (
                <EmptyChatState />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
