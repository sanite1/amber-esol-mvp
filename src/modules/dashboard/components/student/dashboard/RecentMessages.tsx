import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";
import { RecentMessage } from "../../../data/student/studentDashboardData";

interface Props {
  messages: RecentMessage[];
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentMessages({ messages }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#ff7c22]" />
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Recent Messages
          </h3>
        </div>
        <Link
          to="/messages"
          className="text-xs font-semibold text-[#ff7c22] hover:underline flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#0B2343]/[0.03] flex items-center justify-center mx-auto mb-3">
            <MessageSquare size={20} className="text-[#0B2343]/20" />
          </div>
          <p className="text-sm text-[#0B2343]/40">No messages yet</p>
        </div>
      ) : (
        <div className="divide-y divide-[#0B2343]/[0.04]">
          {messages.map((msg) => (
            <Link
              key={msg.id}
              to="/messages"
              className="flex items-start gap-3 p-4 hover:bg-[#0B2343]/[0.01] transition-colors"
            >
              <div className="relative shrink-0">
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {msg.unread && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ff7c22] border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      msg.unread
                        ? "font-semibold text-[#0B2343]"
                        : "font-medium text-[#0B2343]/70"
                    }`}
                  >
                    {msg.senderName}
                  </p>
                  <span className="text-[10px] text-[#0B2343]/25 shrink-0">
                    {timeAgo(msg.timestamp)}
                  </span>
                </div>
                <p
                  className={`text-xs mt-0.5 line-clamp-2 ${
                    msg.unread ? "text-[#0B2343]/55" : "text-[#0B2343]/35"
                  }`}
                >
                  {msg.lastMessage}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
