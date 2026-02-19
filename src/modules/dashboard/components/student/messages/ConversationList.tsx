import { MessageSquare } from "lucide-react";
import { UIConversation } from "../../../lib/types/messaging";
import { getCurrentUserId } from "../../../lib/utils/messagingHelpers";

interface ConversationListProps {
  conversations: UIConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const currentUserId = getCurrentUserId();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <MessageSquare className="w-10 h-10 text-[#0B2343]/15 mb-3" />
        <p className="text-sm text-[#0B2343]/40">No conversations found.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => {
        const isActive = conv.id === activeConversationId;
        const isMine = conv.lastMessageSenderId === currentUserId;
        const preview = isMine ? `You: ${conv.lastMessage}` : conv.lastMessage;

        return (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F8F9FB] ${
              isActive ? "bg-[#ff7c22]/[0.04] border-l-2 border-[#ff7c22]" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={
                  conv.participantAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.participantName)}&background=0B2343&color=fff&size=40`
                }
                alt={conv.participantName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {conv.participantIsOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0B2343] truncate">
                  {conv.participantName}
                </span>
                <span className="text-[10px] text-[#0B2343]/40 shrink-0 ml-2">
                  {conv.lastMessageAt ? formatTime(conv.lastMessageAt) : ""}
                </span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-[#0B2343]/50 truncate pr-2">
                  {preview || "No messages yet"}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-[#ff7c22] text-white text-[10px] font-bold">
                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
