import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";
import type { RecentStudentMessage } from "../../../data/tutor/tutorDashboardData";

interface Props {
  messages: RecentStudentMessage[];
}

export default function TutorRecentMessages({ messages }: Props) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#0B2343]">Messages</h3>
        <Link
          to="/tutor/messages"
          className="flex items-center gap-1 text-[10px] text-[#ff7c22] font-medium hover:underline"
        >
          View all
          <ArrowRight size={10} />
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="py-6 text-center">
          <MessageSquare size={18} className="text-[#0B2343]/10 mx-auto mb-2" />
          <p className="text-xs text-[#0B2343]/25">No recent messages</p>
        </div>
      ) : (
        <div className="space-y-1">
          {messages.slice(0, 4).map((msg) => (
            <Link
              key={msg.id}
              to="/tutor/messages"
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[9px] font-semibold text-[#0B2343]/25">
                  {msg.studentAvatar ? (
                    <img
                      src={msg.studentAvatar}
                      alt={msg.studentName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    msg.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </div>
                {msg.unread && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#ff7c22] border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs truncate ${
                      msg.unread
                        ? "font-semibold text-[#0B2343]/70"
                        : "font-medium text-[#0B2343]/50"
                    }`}
                  >
                    {msg.studentName}
                  </p>
                  <span className="text-[9px] text-[#0B2343]/20 shrink-0">
                    {timeAgo(msg.timestamp)}
                  </span>
                </div>
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    msg.unread ? "text-[#0B2343]/45" : "text-[#0B2343]/25"
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
