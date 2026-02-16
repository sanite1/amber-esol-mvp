import { Search, MessageSquare } from "lucide-react";
import {
  Conversation,
  currentUserId,
} from "../../../data/student/messagesData";

interface Props {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Search header */}
      <div className="p-3 border-b border-[#0B2343]/[0.06]">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#0B2343]/[0.06] bg-[#fafbfc] text-xs text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/30 transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-1.5">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-[#0B2343]/[0.03] flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-[#0B2343]/15" />
            </div>
            <p className="text-xs text-[#0B2343]/35 text-center">
              {searchQuery
                ? "No conversations match your search"
                : "No conversations yet"}
            </p>
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isOwnLastMessage = conv.lastMessageSenderId === currentUserId;

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors mb-0.5 ${
                  isActive ? "bg-[#ff7c22]/[0.06]" : "hover:bg-[#0B2343]/[0.02]"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  {conv.participantIsOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm truncate ${
                        conv.unreadCount > 0
                          ? "font-bold text-[#0B2343]"
                          : "font-medium text-[#0B2343]/70"
                      }`}
                    >
                      {conv.participantName}
                    </p>
                    <span className="text-[10px] text-[#0B2343]/25 shrink-0">
                      {formatTimestamp(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className={`text-xs truncate ${
                        conv.unreadCount > 0
                          ? "text-[#0B2343]/55"
                          : "text-[#0B2343]/30"
                      }`}
                    >
                      {isOwnLastMessage && (
                        <span className="text-[#0B2343]/25">You: </span>
                      )}
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#ff7c22] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
