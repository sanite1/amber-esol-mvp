import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Paperclip,
  ArrowLeft,
  MoreVertical,
  Pin,
  VolumeX,
  Archive,
  FileText,
  Download,
  Loader2,
  X,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import type {
  TutorUIConversation,
  TutorChatMessage,
} from "../../../lib/types/messaging";
import { Link } from "react-router-dom";

interface Props {
  conversation: TutorUIConversation;
  messages: TutorChatMessage[];
  tutorId: string;
  onSendMessage: (convId: string, text: string) => void;
  onSendFile: (convId: string, file: File) => void;
  onBack: () => void;
  onPin: (id: string) => void;
  onMute: (id: string) => void;
  onArchive: (id: string) => void;
  isLoadingMessages?: boolean;
  isSending?: boolean;
}

export default function ChatArea({
  conversation,
  messages,
  tutorId,
  onSendMessage,
  onSendFile,
  onBack,
  onPin,
  onMute,
  onArchive,
  isLoadingMessages,
  isSending,
}: Props) {
  const [text, setText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { student } = conversation;

  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const isImageFile = (file: File) => file.type.startsWith("image/");

  const clearFile = useCallback(() => {
    setPendingFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  }, [filePreviewUrl]);

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

  const handleSend = () => {
    // File mode
    if (pendingFile) {
      onSendFile(conversation.id, pendingFile);
      clearFile();
      return;
    }
    // Text mode
    if (!text.trim() || isSending) return;
    onSendMessage(conversation.id, text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const capped = Math.min(el.scrollHeight, 132); // ~5 lines
      el.style.height = `${capped}px`;

      // Hide scrollbar while growing, show once max height reached
      if (el.scrollHeight > 132) {
        el.classList.remove("overflow-hidden");
        el.classList.add("overflow-y-auto");
      } else {
        el.classList.remove("overflow-y-auto");
        el.classList.add("overflow-hidden");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    if (isImageFile(file)) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
  const groupedMessages: { date: string; messages: TutorChatMessage[] }[] = [];
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

  const canSend = pendingFile || text.trim();

  return (
    <div className="flex flex-col h-full">
      {/*  Header  */}
      <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 border-b border-[#0B2343]/[0.06] bg-white shrink-0">
        <button
          onClick={onBack}
          className="lg:hidden shrink-0 p-1 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
        >
          <ArrowLeft size={18} className="text-[#0B2343]/40" />
        </button>

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

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              to={`/tutor/students`}
              className="text-[13px] sm:text-sm font-semibold text-[#0B2343] truncate hover:underline"
            >
              {student.name}
            </Link>
            {student.countryCode && (
              <span className="text-[9px] sm:text-[10px] text-[#0B2343]/25 shrink-0">
                {student.countryCode}
              </span>
            )}
            <span
              className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full capitalize shrink-0 ${
                statusColors[student.status]
              }`}
            >
              {student.status}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#0B2343]/30">
            {lastSeenLabel()}
            {student.level && <> · {student.level}</>}
          </p>
        </div>

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

      {/*  Messages  */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-3 sm:px-4 sm:py-4 space-y-4 bg-[#fafbfc]">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="text-[#0B2343]/20 animate-spin" />
          </div>
        ) : (
          <>
            {groupedMessages.map((group) => (
              <div key={group.date}>
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-[#0B2343]/[0.06]" />
                  <span className="text-[10px] sm:text-[11px] text-[#0B2343]/25 font-medium whitespace-nowrap">
                    {group.date}
                  </span>
                  <div className="flex-1 h-px bg-[#0B2343]/[0.06]" />
                </div>

                <div className="space-y-2">
                  {group.messages.map((msg) => {
                    const isMine = msg.senderId === tutorId;
                    const isPending = msg.status === "pending";
                    const isFailed = msg.status === "failed";

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
                          } px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-sm ${
                            isPending ? "opacity-70" : ""
                          }`}
                        >
                          {/* Text */}
                          {msg.type === "text" && (
                            <p className="text-[12px] sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                              {msg.text}
                            </p>
                          )}

                          {/* Image */}
                          {msg.type === "image" && msg.fileUrl && (
                            <div>
                              <img
                                src={msg.fileUrl}
                                alt={msg.fileName || "Image"}
                                className="max-w-full rounded-lg mb-1"
                              />
                              {msg.text && (
                                <p className="text-[12px] sm:text-[13px] leading-relaxed whitespace-pre-wrap mt-1">
                                  {msg.text}
                                </p>
                              )}
                            </div>
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
                                    isMine
                                      ? "text-white/70"
                                      : "text-[#0B2343]/30"
                                  }
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] sm:text-xs font-medium truncate">
                                  {msg.fileName || "File"}
                                </p>
                                <p
                                  className={`text-[9px] ${
                                    isMine
                                      ? "text-white/50"
                                      : "text-[#0B2343]/25"
                                  }`}
                                >
                                  File
                                </p>
                              </div>
                              {msg.fileUrl && !isPending && (
                                <a
                                  href={msg.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                                    isMine
                                      ? "hover:bg-white/10"
                                      : "hover:bg-[#0B2343]/[0.04]"
                                  }`}
                                >
                                  <Download
                                    size={13}
                                    className={
                                      isMine
                                        ? "text-white/60"
                                        : "text-[#0B2343]/30"
                                    }
                                  />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Timestamp / status row */}
                          <div
                            className={`flex items-center gap-1.5 mt-1 ${
                              isMine ? "justify-end" : "justify-start"
                            }`}
                          >
                            {isPending ? (
                              <span
                                className={`flex items-center gap-1 text-[9px] ${
                                  isMine ? "text-white/40" : "text-[#0B2343]/20"
                                }`}
                              >
                                <Loader2 size={10} className="animate-spin" />
                                Sending…
                              </span>
                            ) : isFailed ? (
                              <span
                                className={`flex items-center gap-1 text-[9px] ${
                                  isMine ? "text-red-300" : "text-red-400"
                                }`}
                              >
                                <AlertCircle size={10} />
                                Failed to send
                              </span>
                            ) : (
                              <span
                                className={`flex items-center gap-1 text-[9px] ${
                                  isMine ? "text-white/40" : "text-[#0B2343]/20"
                                }`}
                              >
                                {formatTime(msg.timestamp)}
                                {isMine && <Check size={10} />}
                              </span>
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
          </>
        )}
      </div>

      {/*  Input  */}
      <div className="shrink-0 border-t border-[#0B2343]/[0.06] bg-white">
        {pendingFile ? (
          /* ── File preview mode: replaces entire input ── */
          <div className="px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.06]">
              {filePreviewUrl && isImageFile(pendingFile) ? (
                <img
                  src={filePreviewUrl}
                  alt={pendingFile.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-lg bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-[#0B2343]/30" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[12px] sm:text-[13px] font-medium text-[#0B2343] truncate">
                  {pendingFile.name}
                </p>
                <p className="text-[10px] text-[#0B2343]/30 mt-0.5 flex items-center gap-1.5">
                  {formatFileSize(pendingFile.size)}
                  {isImageFile(pendingFile) && (
                    <span className="inline-flex items-center gap-0.5 text-[#0B2343]/25">
                      <ImageIcon size={10} />
                      Image
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={clearFile}
                disabled={isSending}
                className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.08] transition-colors shrink-0"
                title="Remove file"
              >
                <X size={14} className="text-[#0B2343]/35" />
              </button>

              <button
                onClick={handleSend}
                disabled={isSending}
                className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-[#ff7c22] text-white hover:bg-[#e56a10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Send file"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* ── Normal text input mode ── */
          <div className="px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-2">
              {/* Attachment button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
                className="shrink-0 p-2 rounded-lg text-[#0B2343]/25 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/40 transition-colors disabled:opacity-40"
              >
                <Paperclip size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />

              {/* Auto-expanding textarea */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                placeholder="Type a message..."
                rows={1}
                disabled={isSending}
                className="flex-1 resize-none rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.08] px-4 py-2.5 text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors disabled:opacity-50 overflow-hidden"
                style={{ maxHeight: 132 }}
              />

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!canSend || isSending}
                className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-[#ff7c22] text-white hover:bg-[#e56a10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Send"
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-[#0B2343]/25 mt-1.5 text-center">
              Press <span className="font-medium">Enter</span> to send,{" "}
              <span className="font-medium">Shift + Enter</span> for new line
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
