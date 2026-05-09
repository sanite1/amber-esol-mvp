import React from "react";
import { MessageSquare, Paperclip, User, GraduationCap } from "lucide-react";
import type { AdminTicket } from "../../../lib/types/adminTickets";
import {
  categoryLabels,
  priorityConfig,
  statusConfig,
} from "../../../lib/types/adminTickets";

interface Props {
  ticket: AdminTicket;
  onClick: (ticket: AdminTicket) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="w-full h-full rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-[#0B2343]/50">
      {initials}
    </div>
  );
}

// const priorityOrder: Record<string, number> = {
//   urgent: 0,
//   high: 1,
//   medium: 2,
//   low: 3,
// };

export default function TicketCard({ ticket, onClick }: Props) {
  const status = statusConfig[ticket.status] || statusConfig.open;
  const priority = priorityConfig[ticket.priority] || priorityConfig.medium;
  const category = categoryLabels[ticket.category] || ticket.category;
  const lastMessage = ticket.messages[ticket.messages.length - 1];
  const hasAttachments = ticket.messages.some(
    (m) => m.attachments && m.attachments.length > 0,
  );
  const unrespondedByAdmin =
    ticket.status !== "resolved" &&
    ticket.status !== "closed" &&
    lastMessage?.senderType !== "admin";

  return (
    <button
      onClick={() => onClick(ticket)}
      className={`w-full text-left bg-white rounded-2xl border transition-all hover:shadow-sm hover:border-[#0B2343]/[0.12] cursor-pointer ${
        ticket.priority === "urgent"
          ? "border-red-200 bg-red-50/20"
          : ticket.priority === "high"
            ? "border-amber-100"
            : "border-[#0B2343]/[0.06]"
      }`}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 relative">
            <Initials name={ticket.submitterName} />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-md flex items-center justify-center ${
                ticket.submitterType === "tutor"
                  ? "bg-[#ff7c22]/10"
                  : "bg-blue-50"
              }`}
            >
              {ticket.submitterType === "tutor" ? (
                <GraduationCap size={9} className="text-[#ff7c22]" />
              ) : (
                <User size={9} className="text-blue-500" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[#0B2343] truncate">
                  {ticket.subject}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-[10px] sm:text-[11px] text-[#0B2343]/50">
                    {ticket.submitterName}
                  </span>
                  <span className="text-[10px] text-[#0B2343]/20">·</span>
                  <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                    {ticket.id}
                  </span>
                  <span className="text-[10px] text-[#0B2343]/20">·</span>
                  <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                    {timeAgo(ticket.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium ${priority.bg} ${priority.text}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${priority.dot} ${ticket.priority === "urgent" ? "animate-pulse" : ""}`}
                  />
                  <span className="hidden sm:inline">{priority.label}</span>
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium ${status.bg} ${status.text}`}
                >
                  {status.label}
                </span>
              </div>
            </div>

            {/* Preview */}
            <p className="text-[11px] sm:text-xs text-[#0B2343]/50 line-clamp-1 mt-1">
              {lastMessage
                ? `${lastMessage.senderType === "admin" ? "You: " : ""}${lastMessage.message}`
                : "No messages"}
            </p>

            {/* Bottom row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              <span className="px-1.5 py-0.5 rounded-md bg-[#0B2343]/[0.04] text-[9px] sm:text-[10px] font-medium text-[#0B2343]/50">
                {category}
              </span>
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/40">
                <MessageSquare size={10} />
                {ticket.messages.length}
              </span>
              {hasAttachments && (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  <Paperclip size={10} />
                  Files
                </span>
              )}
              {unrespondedByAdmin && (
                <span className="px-1.5 py-0.5 rounded-md bg-red-50 text-red-500 text-[9px] sm:text-[10px] font-medium">
                  Needs Reply
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
