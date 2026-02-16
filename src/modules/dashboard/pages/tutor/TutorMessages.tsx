import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import {
  tutorMessagesData,
  type TutorMessagesData,
  type ChatMessage,
} from "../../data/tutor/tutorMessagesData";
import {
  ConversationListSkeleton,
  ChatAreaSkeleton,
} from "../../components/tutor/messages/MessagesSkeleton";
import ConversationList from "../../components/tutor/messages/ConversationList";
import ChatArea from "../../components/tutor/messages/ChatArea";
import EmptyChatState from "../../components/tutor/messages/EmptyChatState";

export default function TutorMessages() {
  const [data, setData] = useState<TutorMessagesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(tutorMessagesData);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Auto-select first unarchived conversation on desktop
  useEffect(() => {
    if (data && !activeConvId) {
      const first = data.conversations.find((c) => !c.archived);
      if (first && window.innerWidth >= 1024) {
        setActiveConvId(first.id);
      }
    }
  }, [data, activeConvId]);

  const activeConv = data?.conversations.find((c) => c.id === activeConvId);

  /* ── Mark as read when opening ── */
  useEffect(() => {
    if (activeConv && activeConv.unreadCount > 0) {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          conversations: prev.conversations.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  unreadCount: 0,
                  messages: c.messages.map((m) => ({ ...m, read: true })),
                }
              : c
          ),
        };
      });
    }
  }, [activeConvId, activeConv]);

  /* ── Handlers ── */
  const handleSendMessage = (convId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: data?.tutorId || "tutor-001",
      senderType: "tutor",
      text,
      timestamp: new Date().toISOString(),
      read: true,
      type: "text",
    };
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, newMsg],
                lastMessageAt: newMsg.timestamp,
              }
            : c
        ),
      };
    });
  };

  const handleSendFile = (convId: string, fileName: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: data?.tutorId || "tutor-001",
      senderType: "tutor",
      text: "",
      timestamp: new Date().toISOString(),
      read: true,
      type: "file",
      fileName,
      fileUrl: "#",
    };
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, newMsg],
                lastMessageAt: newMsg.timestamp,
              }
            : c
        ),
      };
    });
  };

  const handlePin = (convId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === convId ? { ...c, pinned: !c.pinned } : c
        ),
      };
    });
  };

  const handleMute = (convId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === convId ? { ...c, muted: !c.muted } : c
        ),
      };
    });
  };

  const handleArchive = (convId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        conversations: prev.conversations.map((c) =>
          c.id === convId ? { ...c, archived: !c.archived } : c
        ),
      };
    });
    // If archiving the active conversation, deselect it
    if (activeConvId === convId) {
      setActiveConvId(null);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
  };

  const handleBack = () => {
    setActiveConvId(null);
  };

  /* ── Render ── */
  if (loading || !data) {
    return (
      <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-100px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/5 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2343]/40" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
              Messages
            </h1>
            <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
              Chat with your students
            </p>
          </div>
        </div>
        <div className="flex-1 flex rounded-xl border border-[#0B2343]/[0.06] bg-white overflow-hidden">
          <div className="w-full lg:w-80 xl:w-96 border-r border-[#0B2343]/[0.06]">
            <ConversationListSkeleton />
          </div>
          <div className="hidden lg:flex flex-1">
            <ChatAreaSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3 sm:mb-4 shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/5 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2343]/40" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            Messages
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
            Chat with your students
          </p>
        </div>
      </div>

      {/* Chat container */}
      <div className="flex-1 flex rounded-xl border border-[#0B2343]/[0.06] bg-white overflow-hidden min-h-0">
        {/* Sidebar: conversation list */}
        <div
          className={`w-full lg:w-80 xl:w-96 border-r border-[#0B2343]/[0.06] shrink-0 ${
            activeConvId ? "hidden lg:flex lg:flex-col" : "flex flex-col"
          }`}
        >
          <ConversationList
            conversations={data.conversations}
            activeId={activeConvId}
            onSelect={handleSelectConversation}
            onPin={handlePin}
            onMute={handleMute}
            onArchive={handleArchive}
            showArchived={showArchived}
            onToggleArchived={() => setShowArchived(!showArchived)}
          />
        </div>

        {/* Chat area */}
        <div
          className={`flex-1 min-w-0 ${
            activeConvId ? "flex flex-col" : "hidden lg:flex lg:flex-col"
          }`}
        >
          {activeConv ? (
            <ChatArea
              conversation={activeConv}
              tutorId={data.tutorId}
              onSendMessage={handleSendMessage}
              onSendFile={handleSendFile}
              onBack={handleBack}
              onPin={handlePin}
              onMute={handleMute}
              onArchive={handleArchive}
            />
          ) : (
            <EmptyChatState />
          )}
        </div>
      </div>
    </div>
  );
}
