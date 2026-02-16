import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  ArrowLeft,
  MoreVertical,
  Pin,
  VolumeX,
  Archive,
  FileText,
  Calendar,
  Download,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import type {
  Conversation,
  ChatMessage,
} from "../../../data/tutor/tutorMessagesData";
import { Link } from "react-router-dom";

interface Props {
  conversation: Conversation;
  tutorId: string;
  onSendMessage: (convId: string, text: string) => void;
  onSendFile: (convId: string, fileName: string) => void;
  onBack: () => void;
  onPin: (id: string) => void;
  onMute: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function ChatArea({
  conversation,
  tutorId,
  onSendMessage,
  onSendFile,
  onBack,
  onPin,
  onMute,
  onArchive,
}: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { student, messages } = conversation;

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [text]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msg = text.trim();
    setText("");
    setSending(true);
    await new Promise((r) => setTimeout(r, 300));
    onSendMessage(conversation.id, msg);
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendFile(conversation.id, file.name);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const lastSeenLabel = () => {
    if (student.isOnline) return "Online";
    if (!student.lastSeen) return "Offline";
    const d = new Date(student.lastSeen);
    const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diffMin < 60) return `Last seen ${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `Last seen ${diffHrs}h ago`;
    return `Last seen ${d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })}`;
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const date = new Date(msg.timestamp).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      groupedMessages.push({ date, messages: [msg] });
    }
  });

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusColors: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-600",
    trial: "bg-[#ff7c22]/10 text-[#ff7c22]",
    inactive: "bg-[#0B2343]/[0.05] text-[#0B2343]/35",
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 border-b border-[#0B2343]/[0.06] bg-white shrink-0">
        {/* Back (mobile) */}
        <button
          onClick={onBack}
          className="lg:hidden shrink-0 p-1 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
        >
          <ArrowLeft size={18} className="text-[#0B2343]/40" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[11px] font-bold text-[#0B2343]/30 overflow-hidden">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          {student.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              to={`/tutor/students`}
              className="text-[13px] sm:text-sm font-semibold text-[#0B2343] truncate hover:underline"
            >
              {student.name}
            </Link>
            <span className="text-[9px] sm:text-[10px] text-[#0B2343]/25 shrink-0">
              {student.countryCode}
            </span>
            <span
              className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full capitalize shrink-0 ${
                statusColors[student.status]
              }`}
            >
              {student.status}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#0B2343]/30">
            {lastSeenLabel()} · {student.level}
          </p>
        </div>

        {/* Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <MoreVertical size={16} className="text-[#0B2343]/30" />
          </button>
          {showMenu && (
            <div className="absolute top-9 right-0 z-20 bg-white rounded-lg border border-[#0B2343]/[0.08] shadow-lg py-1 min-w-[140px]">
              <button
                onClick={() => {
                  onPin(conversation.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
              >
                <Pin size={11} className="rotate-45" />
                {conversation.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                onClick={() => {
                  onMute(conversation.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
              >
                <VolumeX size={11} />
                {conversation.muted ? "Unmute" : "Mute"}
              </button>
              <button
                onClick={() => {
                  onArchive(conversation.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-[#0B2343]/50 hover:bg-[#0B2343]/[0.03] transition-colors"
              >
                <Archive size={11} />
                {conversation.archived ? "Unarchive" : "Archive"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-3 sm:px-4 sm:py-4 space-y-4 bg-[#fafbfc]">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            {/* Date divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-[#0B2343]/[0.06]" />
              <span className="text-[10px] sm:text-[11px] text-[#0B2343]/25 font-medium whitespace-nowrap">
                {group.date}
              </span>
              <div className="flex-1 h-px bg-[#0B2343]/[0.06]" />
            </div>

            {/* Messages */}
            <div className="space-y-2">
              {group.messages.map((msg) => {
                const isMine = msg.senderType === "tutor";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] ${
                        isMine
                          ? "bg-[#0B2343] text-white rounded-2xl rounded-br-md"
                          : "bg-white border border-[#0B2343]/[0.06] text-[#0B2343]/70 rounded-2xl rounded-bl-md"
                      } px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-sm`}
                    >
                      {/* Text */}
                      {msg.type === "text" && (
                        <p className="text-[12px] sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}

                      {/* File */}
                      {msg.type === "file" && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isMine ? "bg-white/10" : "bg-[#0B2343]/[0.04]"
                            }`}
                          >
                            <FileText
                              size={14}
                              className={
                                isMine ? "text-white/70" : "text-[#0B2343]/30"
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] sm:text-xs font-medium truncate">
                              {msg.fileName}
                            </p>
                            <p
                              className={`text-[9px] ${
                                isMine ? "text-white/50" : "text-[#0B2343]/25"
                              }`}
                            >
                              File
                            </p>
                          </div>
                          <a
                            href={msg.fileUrl || "#"}
                            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                              isMine
                                ? "hover:bg-white/10"
                                : "hover:bg-[#0B2343]/[0.04]"
                            }`}
                          >
                            <Download
                              size={13}
                              className={
                                isMine ? "text-white/60" : "text-[#0B2343]/30"
                              }
                            />
                          </a>
                        </div>
                      )}

                      {/* Lesson link */}
                      {msg.type === "lesson_link" && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isMine ? "bg-white/10" : "bg-blue-50"
                            }`}
                          >
                            <Calendar
                              size={14}
                              className={
                                isMine ? "text-white/70" : "text-blue-400"
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] sm:text-xs font-medium">
                              Lesson Booking
                            </p>
                            {msg.lessonDate && (
                              <p
                                className={`text-[9px] sm:text-[10px] ${
                                  isMine ? "text-white/50" : "text-[#0B2343]/30"
                                }`}
                              >
                                {new Date(msg.lessonDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <p
                        className={`text-[9px] mt-1 text-right ${
                          isMine ? "text-white/40" : "text-[#0B2343]/20"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 border-t border-[#0B2343]/[0.06] bg-white">
        <div className="flex items-end gap-2">
          {/* Attach */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 p-2 rounded-lg text-[#0B2343]/25 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/40 transition-colors mb-0.5"
          >
            <Paperclip size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Textarea */}
          <div className="flex-1 min-w-0 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-xs sm:text-[13px] text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors resize-none overflow-y-auto scrollbar-hide max-h-[120px]"
            />
          </div>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-[#ff7c22] text-white hover:bg-[#e56a10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors mb-0.5"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
