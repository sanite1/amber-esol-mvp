import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  conversations as initialConversations,
  messagesByConversation as initialMessages,
  currentUserId,
  Conversation,
  Message,
} from "../../data/student/messagesData";

import ConversationList from "../../components/student/messages/ConversationList";
import ChatArea from "../../components/student/messages/ChatArea";
import EmptyChat from "../../components/student/messages/EmptyChat";
import {
  ConversationListSkeleton,
  ChatAreaSkeleton,
} from "../../components/student/messages/MessagesSkeleton";

export default function Messages() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [messageMap, setMessageMap] =
    useState<Record<string, Message[]>>(initialMessages);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => {
      setConversations(initialConversations);
      setMessageMap(initialMessages);

      // Auto-select conversation from URL param
      const tutorParam = searchParams.get("tutor");
      if (tutorParam) {
        const conv = initialConversations.find(
          (c) => c.participantSlug === tutorParam
        );
        if (conv) setActiveConversationId(conv.id);
      }

      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // ── Filtered conversations ──
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.participantName.toLowerCase().includes(q) ||
        c.participantSpecialty.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  // ── Active conversation + messages ──
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const activeMessages = activeConversationId
    ? messageMap[activeConversationId] || []
    : [];

  // ── Select conversation ──
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);

    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );

    // Mark messages as read
    setMessageMap((prev) => ({
      ...prev,
      [id]: (prev[id] || []).map((m) => ({ ...m, isRead: true })),
    }));
  };

  // ── Send message ──
  const handleSendMessage = (content: string) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `msg-new-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: currentUserId,
      senderName: "You",
      senderAvatar: "",
      content,
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    // Add message
    setMessageMap((prev) => ({
      ...prev,
      [activeConversationId]: [
        ...(prev[activeConversationId] || []),
        newMessage,
      ],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? {
              ...c,
              lastMessage: content,
              lastMessageAt: newMessage.createdAt,
              lastMessageSenderId: currentUserId,
            }
          : c
      )
    );
  };

  // ── Back to list (mobile) ──
  const handleBack = () => setActiveConversationId(null);

  // ── Unread count ──
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

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
        {isLoading ? (
          <div className="flex h-full">
            <div className="w-80 border-r border-[#0B2343]/[0.06] hidden lg:block">
              <ConversationListSkeleton />
            </div>
            <ChatAreaSkeleton />
          </div>
        ) : (
          <div className="flex h-full">
            {/* Conversation list — always visible on desktop, conditional on mobile */}
            <div
              className={`w-full lg:w-80 border-r border-[#0B2343]/[0.06] shrink-0 ${
                activeConversationId
                  ? "hidden lg:flex lg:flex-col"
                  : "flex flex-col"
              }`}
            >
              <ConversationList
                conversations={filteredConversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Chat area */}
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
                  onBack={handleBack}
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
