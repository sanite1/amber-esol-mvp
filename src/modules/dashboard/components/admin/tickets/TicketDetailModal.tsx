import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Paperclip,
  User,
  GraduationCap,
  Shield,
  Loader2,
  CheckCircle,
} from "lucide-react";
import type {
  AdminTicket,
  TicketMessage,
} from "../../../data/admin/adminTicketsData";
import {
  categoryLabels,
  priorityConfig,
  statusConfig,
} from "../../../data/admin/adminTicketsData";

interface Props {
  ticket: AdminTicket;
  onClose: () => void;
  onReply: (ticketId: string, message: string) => void;
  onChangeStatus: (ticketId: string, status: AdminTicket["status"]) => void;
  onChangePriority: (
    ticketId: string,
    priority: AdminTicket["priority"]
  ) => void;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} at ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const senderStyles: Record<
  string,
  {
    bg: string;
    align: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
  }
> = {
  student: {
    bg: "bg-blue-50/50 border-blue-100",
    align: "items-start",
    icon: User,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  tutor: {
    bg: "bg-[#ff7c22]/[0.04] border-[#ff7c22]/10",
    align: "items-start",
    icon: GraduationCap,
    iconBg: "bg-[#ff7c22]/10",
    iconColor: "text-[#ff7c22]",
  },
  admin: {
    bg: "bg-emerald-50/50 border-emerald-100",
    align: "items-end",
    icon: Shield,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
};

const statusOptions: { value: AdminTicket["status"]; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "awaiting_user", label: "Awaiting User" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const priorityOptions: { value: AdminTicket["priority"]; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function TicketDetailModal({
  ticket,
  onClose,
  onReply,
  onChangeStatus,
  onChangePriority,
}: Props) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const status = statusConfig[ticket.status] || statusConfig.open;
  const priority = priorityConfig[ticket.priority] || priorityConfig.medium;
  const category = categoryLabels[ticket.category] || ticket.category;
  const isClosed = ticket.status === "closed" || ticket.status === "resolved";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.messages]);

  function autoGrow() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function handleSend() {
    if (!replyText.trim() || sending) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 500));
    onReply(ticket.id, replyText.trim());
    setReplyText("");
    setSending(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: TicketMessage[] }[] = [];
  ticket.messages.forEach((msg) => {
    const dateKey = new Date(msg.createdAt).toDateString();
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (
      lastGroup &&
      new Date(lastGroup.messages[0].createdAt).toDateString() === dateKey
    ) {
      lastGroup.messages.push(msg);
    } else {
      groupedMessages.push({ date: msg.createdAt, messages: [msg] });
    }
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop — fixed & full-viewport */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer / Modal panel */}
      <div className="relative z-[10000] w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col">
        {/* Header — pinned */}
        <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-[15px] font-semibold text-[#0B2343] leading-snug">
                {ticket.subject}
              </h2>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {ticket.id}
                </span>
                <span className="text-[10px] text-[#0B2343]/20">·</span>
                <span
                  className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-medium ${
                    ticket.submitterType === "tutor"
                      ? "text-[#ff7c22]"
                      : "text-blue-500"
                  }`}
                >
                  {ticket.submitterType === "tutor" ? (
                    <GraduationCap size={10} />
                  ) : (
                    <User size={10} />
                  )}
                  {ticket.submitterName}
                </span>
                <span className="text-[10px] text-[#0B2343]/20">·</span>
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {ticket.submitterEmail}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors shrink-0"
            >
              <X size={16} className="text-[#0B2343]/30" />
            </button>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <span className="px-2 py-0.5 rounded-md bg-[#0B2343]/[0.04] text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50">
              {category}
            </span>

            {/* Priority selector */}
            <select
              value={ticket.priority}
              onChange={(e) =>
                onChangePriority(
                  ticket.id,
                  e.target.value as AdminTicket["priority"]
                )
              }
              className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium border-0 cursor-pointer focus:outline-none ${priority.bg} ${priority.text}`}
            >
              {priorityOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* Status selector */}
            <select
              value={ticket.status}
              onChange={(e) =>
                onChangeStatus(
                  ticket.id,
                  e.target.value as AdminTicket["status"]
                )
              }
              className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium border-0 cursor-pointer focus:outline-none ${status.bg} ${status.text}`}
            >
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {ticket.resolvedAt && (
              <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                <CheckCircle size={10} />
                Resolved {formatDateTime(ticket.resolvedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Messages — scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 space-y-4">
          {groupedMessages.map((group, gi) => (
            <div key={gi}>
              {/* Date divider */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-[#0B2343]/[0.06]" />
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/30 font-medium shrink-0">
                  {formatDate(group.date)}
                </span>
                <div className="flex-1 h-px bg-[#0B2343]/[0.06]" />
              </div>

              <div className="space-y-3">
                {group.messages.map((msg) => {
                  const style =
                    senderStyles[msg.senderType] || senderStyles.student;
                  const SenderIcon = style.icon;
                  const isAdmin = msg.senderType === "admin";

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] sm:max-w-[75%]`}>
                        <div
                          className={`rounded-2xl border p-3 sm:p-3.5 ${style.bg}`}
                        >
                          {/* Sender header */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div
                              className={`w-5 h-5 rounded-md ${style.iconBg} flex items-center justify-center`}
                            >
                              <SenderIcon
                                size={10}
                                className={style.iconColor}
                              />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-semibold text-[#0B2343]">
                              {msg.senderName}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-[#0B2343]/30">
                              {new Date(msg.createdAt).toLocaleTimeString(
                                "en-GB",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>

                          {/* Message body */}
                          <p className="text-[11px] sm:text-xs text-[#0B2343]/80 leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>

                          {/* Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {msg.attachments.map((att, ai) => (
                                <div
                                  key={ai}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/60 border border-[#0B2343]/[0.06]"
                                >
                                  <Paperclip
                                    size={10}
                                    className="text-[#0B2343]/40 shrink-0"
                                  />
                                  <span className="text-[10px] text-[#0B2343]/60 truncate">
                                    {att.name}
                                  </span>
                                  <span className="text-[9px] text-[#0B2343]/30 shrink-0">
                                    {att.size}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer — pinned reply bar / closed notice */}
        {!isClosed ? (
          <div className="shrink-0 bg-white border-t border-[#0B2343]/[0.06] px-4 sm:px-5 py-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);
                    autoGrow();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your reply…"
                  rows={1}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm sm:text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-[#ff7c22]/30 transition-colors resize-none overflow-hidden"
                  style={{ maxHeight: 120 }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!replyText.trim() || sending}
                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343] flex items-center justify-center text-white hover:bg-[#0B2343]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <p className="text-[9px] sm:text-[10px] text-[#0B2343]/30 mt-1.5">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        ) : (
          <div className="shrink-0 bg-[#0B2343]/[0.02] border-t border-[#0B2343]/[0.06] px-4 sm:px-5 py-3 text-center">
            <p className="text-[11px] sm:text-xs text-[#0B2343]/40">
              This ticket is{" "}
              {ticket.status === "closed" ? "closed" : "resolved"}.{" "}
              <button
                onClick={() => onChangeStatus(ticket.id, "open")}
                className="text-[#ff7c22] font-medium hover:underline"
              >
                Reopen
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
