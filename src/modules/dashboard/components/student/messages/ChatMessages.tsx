import { useEffect, useRef } from "react";
import { UIMessage } from "../../../lib/types/messaging";
import { getCurrentUserId } from "../../../lib/utils/messagingHelpers";
import { Loader2, FileText, Check, AlertCircle } from "lucide-react";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading?: boolean;
}

/* ── Helpers ── */

const formatTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateSeparator = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const shouldShowDate = (
  msg: UIMessage,
  prevMsg: UIMessage | undefined
): boolean => {
  if (!prevMsg) return true;
  return (
    new Date(msg.createdAt).toDateString() !==
    new Date(prevMsg.createdAt).toDateString()
  );
};

const shouldShowAvatar = (
  msg: UIMessage,
  nextMsg: UIMessage | undefined
): boolean => {
  if (!nextMsg) return true;
  return (
    nextMsg.senderId !== msg.senderId ||
    new Date(nextMsg.createdAt).getTime() - new Date(msg.createdAt).getTime() >
      5 * 60 * 1000
  );
};

export default function ChatMessages({
  messages,
  isLoading,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#0B2343]/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
      {messages.map((msg, idx) => {
        const isMe = msg.senderId === currentUserId;
        const isPending = msg.status === "pending";
        const isFailed = msg.status === "failed";
        const prevMsg = messages[idx - 1];
        const nextMsg = messages[idx + 1];
        const showDate = shouldShowDate(msg, prevMsg);
        const showAvatar = shouldShowAvatar(msg, nextMsg);

        return (
          <div key={msg.id}>
            {/* Date separator */}
            {showDate && (
              <div className="flex items-center justify-center my-4">
                <span className="text-[10px] text-[#0B2343]/30 bg-[#F8F9FB] px-3 py-1 rounded-full">
                  {formatDateSeparator(msg.createdAt)}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              } ${showAvatar ? "mb-2" : "mb-0.5"}`}
            >
              {/* Avatar for other user */}
              {!isMe && showAvatar ? (
                <img
                  src={
                    msg.senderAvatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=0B2343&color=fff&size=28`
                  }
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
              ) : !isMe ? (
                <div className="w-7 shrink-0" />
              ) : null}

              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? "bg-[#ff7c22] text-white rounded-br-md"
                    : "bg-[#F8F9FB] text-[#0B2343] rounded-bl-md"
                } ${isPending ? "opacity-70" : ""}`}
              >
                {/* Image message */}
                {msg.type === "image" && msg.fileUrl ? (
                  <div>
                    <img
                      src={msg.fileUrl}
                      alt={msg.fileName || "Image"}
                      className="max-w-full rounded-lg mb-1"
                    />
                    {msg.content && <p>{msg.content}</p>}
                  </div>
                ) : msg.type === "file" && (msg.fileUrl || isPending) ? (
                  /* File message */
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isMe ? "bg-white/15" : "bg-[#0B2343]/[0.06]"
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 ${
                          isMe ? "text-white/70" : "text-[#0B2343]/30"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {msg.fileName || "File"}
                      </p>
                    </div>
                    {msg.fileUrl && !isPending && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[10px] font-medium shrink-0 ${
                          isMe
                            ? "text-white/60 hover:text-white/80"
                            : "text-[#ff7c22] hover:underline"
                        }`}
                      >
                        Download
                      </a>
                    )}
                  </div>
                ) : (
                  /* Text message */
                  <p>{msg.content}</p>
                )}

                {/* Timestamp / status row */}
                <div
                  className={`flex items-center gap-1.5 mt-1 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {isPending ? (
                    <span
                      className={`flex items-center gap-1 text-[9px] ${
                        isMe ? "text-white/40" : "text-[#0B2343]/25"
                      }`}
                    >
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      Sending…
                    </span>
                  ) : isFailed ? (
                    <span
                      className={`flex items-center gap-1 text-[9px] ${
                        isMe ? "text-red-200" : "text-red-400"
                      }`}
                    >
                      <AlertCircle className="w-2.5 h-2.5" />
                      Failed to send
                    </span>
                  ) : (
                    <span
                      className={`flex items-center gap-1 text-[9px] ${
                        isMe ? "text-white/40" : "text-[#0B2343]/25"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                      {isMe && <Check className="w-2.5 h-2.5" />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
