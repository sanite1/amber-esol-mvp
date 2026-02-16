import { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";

interface Props {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    // Allow growth up to ~6 lines (~160px) before scrolling
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [message]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-4 py-3 border-t border-[#0B2343]/[0.06] bg-white">
      <div className="flex items-end gap-2">
        {/* Attachment — pinned to bottom so it stays level with the last line */}
        <button
          className="p-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors shrink-0 mb-[7px]"
          title="Attach file"
        >
          <Paperclip size={16} className="text-[#0B2343]/25" />
        </button>

        {/* Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            disabled={disabled}
            className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/30 focus:bg-white resize-none transition-colors disabled:opacity-50 scrollbar-none"
            style={{
              /* Hide scrollbar across all browsers */
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE / Edge */,
            }}
          />
          {/* Webkit scrollbar hide */}
          <style>{`
            textarea.scrollbar-none::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        {/* Send — also pinned to bottom */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-2.5 rounded-xl bg-[#ff7c22] text-white hover:bg-[#e56a10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0 mb-[5px]"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="text-[10px] text-[#0B2343]/15 mt-1.5 ml-11">
        Press Enter to send · Shift + Enter for new line
      </p>
    </div>
  );
}
