import { useState } from "react";
import {
  Pin,
  VolumeX,
  Archive,
  MoreVertical,
  MessageSquare,
} from "lucide-react";
import type { TutorUIConversation } from "../../../lib/types/messaging";
import { getCurrentUserId } from "../../../lib/utils/messagingHelpers";

interface Props {
  conversations: TutorUIConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onMute: (id: string) => void;
  onArchive: (id: string) => void;
  showArchived: boolean;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onPin,
  onMute,
  onArchive,
  showArchived,
}: Props) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const currentUserId = getCurrentUserId();

  const filtered = conversations
    .filter((c) => (showArchived ? c.archived : !c.archived))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime()
      );
    });

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) {
      return d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) {
      return d.toLocaleDateString("en-GB", { weekday: "short" });
    }
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-400",
    trial: "bg-[#ff7c22]",
    inactive: "bg-[#0B2343]/20",
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
        <MessageSquare className="w-10 h-10 text-[#0B2343]/15 mb-3" />
        <p className="text-xs text-[#0B2343]/25">
          {showArchived
            ? "No archived conversations"
            : "No conversations found"}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#0B2343]/[0.04]">
      {filtered.map((conv) => {
        const isMine = conv.lastMessageSenderId === currentUserId;
        const preview = conv.lastMessage
          ? `${isMine ? "You: " : ""}${conv.lastMessage}`
          : "No messages yet";

        return (
          <div key={conv.id} className="relative group">
            <button
              onClick={() => {
                onSelect(conv.id);
                setMenuOpenId(null);
              }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 transition-colors ${
                activeId === conv.id
                  ? "bg-[#0B2343]/[0.04]"
                  : "hover:bg-[#0B2343]/[0.02]"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[11px] font-bold text-[#0B2343]/30 overflow-hidden">
                  {conv.student.avatar ? (
                    <img
                      src={conv.student.avatar}
                      alt={conv.student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials(conv.student.name)
                  )}
                </div>
                {conv.student.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {conv.pinned && (
                      <Pin
                        size={10}
                        className="text-[#0B2343]/20 shrink-0 rotate-45"
                      />
                    )}
                    <p
                      className={`text-[12px] sm:text-[13px] truncate ${
                        conv.unreadCount > 0
                          ? "font-bold text-[#0B2343]"
                          : "font-medium text-[#0B2343]/70"
                      }`}
                    >
                      {conv.student.name}
                    </p>
                    {conv.student.level && (
                      <span className="text-[9px] text-[#0B2343]/20 shrink-0">
                        {conv.student.level}
                      </span>
                    )}
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        statusColors[conv.student.status]
                      }`}
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-[#0B2343]/25 shrink-0 whitespace-nowrap">
                    {formatTime(conv.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p
                    className={`text-[11px] truncate ${
                      conv.unreadCount > 0
                        ? "text-[#0B2343]/60 font-medium"
                        : "text-[#0B2343]/30"
                    }`}
                  >
                    {preview}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {conv.muted && (
                      <VolumeX size={10} className="text-[#0B2343]/15" />
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="w-4.5 h-4.5 min-w-[18px] flex items-center justify-center rounded-full bg-[#ff7c22] text-white text-[9px] font-bold px-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>

            {/* Context menu trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
              }}
              className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-[#0B2343]/[0.06] transition-all"
            >
              <MoreVertical size={13} className="text-[#0B2343]/25" />
            </button>

            {/* Context menu */}
            {menuOpenId === conv.id && (
              <div className="absolute top-8 right-2 z-20 bg-white rounded-lg border border-[#0B2343]/[0.08] shadow-lg py-1 min-w-[140px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPin(conv.id);
                    setMenuOpenId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
                >
                  <Pin size={11} className="rotate-45" />
                  {conv.pinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMute(conv.id);
                    setMenuOpenId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
                >
                  <VolumeX size={11} />
                  {conv.muted ? "Unmute" : "Mute"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(conv.id);
                    setMenuOpenId(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
                >
                  <Archive size={11} />
                  {conv.archived ? "Unarchive" : "Archive"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
