import { useEffect, useRef } from "react";
import { Message, currentUserId } from "../../../data/student/messagesData";

interface Props {
  messages: Message[];
}

function formatMessageTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function shouldShowDateSeparator(messages: Message[], index: number): boolean {
  if (index === 0) return true;
  const current = new Date(messages[index].createdAt).toDateString();
  const previous = new Date(messages[index - 1].createdAt).toDateString();
  return current !== previous;
}

function shouldShowAvatar(messages: Message[], index: number): boolean {
  if (index === messages.length - 1) return true;
  return messages[index].senderId !== messages[index + 1].senderId;
}

export default function ChatMessages({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
      {messages.map((msg, i) => {
        const isOwn = msg.senderId === currentUserId;
        const showDate = shouldShowDateSeparator(messages, i);
        const showAvatar = shouldShowAvatar(messages, i);

        return (
          <div key={msg.id}>
            {/* Date separator */}
            {showDate && (
              <div className="flex items-center justify-center py-4">
                <span className="px-3 py-1 rounded-full bg-[#0B2343]/[0.03] text-[10px] font-semibold text-[#0B2343]/30">
                  {formatDateSeparator(msg.createdAt)}
                </span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`flex items-end gap-2 mb-0.5 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar placeholder for alignment */}
              {!isOwn && (
                <div className="w-7 shrink-0">
                  {showAvatar && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  )}
                </div>
              )}

              <div
                className={`max-w-[75%] sm:max-w-[65%] ${
                  isOwn ? "order-1" : ""
                }`}
              >
                <div
                  className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                    isOwn
                      ? "bg-[#ff7c22] text-white rounded-2xl rounded-br-md"
                      : "bg-[#0B2343]/[0.04] text-[#0B2343]/80 rounded-2xl rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
                {showAvatar && (
                  <p
                    className={`text-[10px] text-[#0B2343]/20 mt-1 ${
                      isOwn ? "text-right" : "text-left"
                    }`}
                  >
                    {formatMessageTime(msg.createdAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
