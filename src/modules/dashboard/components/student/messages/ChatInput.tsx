import { useState, useRef, useCallback } from "react";
import { Send, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  onSendFile?: (file: File) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onSendFile,
  disabled,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = (file: File) => file.type.startsWith("image/");

  const clearFile = useCallback(() => {
    setPendingFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  }, [filePreviewUrl]);

  const handleSend = useCallback(() => {
    if (pendingFile && onSendFile) {
      onSendFile(pendingFile);
      clearFile();
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, onSend, onSendFile, pendingFile, clearFile]);

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

      // Hide scrollbar while growing, show it once max height is reached
      if (el.scrollHeight > 132) {
        el.classList.remove("overflow-hidden");
        el.classList.add("overflow-y-auto");
      } else {
        el.classList.remove("overflow-y-auto");
        el.classList.add("overflow-hidden");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingFile(file);
    if (isImage(file)) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
    e.target.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const canSend = pendingFile || text.trim();

  return (
    <div className="border-t border-[#0B2343]/[0.06] bg-white">
      {pendingFile ? (
        /* ── File preview mode: replaces the entire input area ── */
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FB] border border-[#0B2343]/[0.06]">
            {/* Thumbnail / icon */}
            {filePreviewUrl && isImage(pendingFile) ? (
              <img
                src={filePreviewUrl}
                alt={pendingFile.name}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#0B2343]/30" />
              </div>
            )}

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0B2343] truncate">
                {pendingFile.name}
              </p>
              <p className="text-[11px] text-[#0B2343]/35 mt-0.5 flex items-center gap-1.5">
                {formatFileSize(pendingFile.size)}
                {isImage(pendingFile) && (
                  <span className="inline-flex items-center gap-0.5 text-[#0B2343]/25">
                    <ImageIcon className="w-3 h-3" />
                    Image
                  </span>
                )}
              </p>
            </div>

            {/* Remove */}
            <button
              onClick={clearFile}
              disabled={disabled}
              className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.08] transition-colors shrink-0"
              title="Remove file"
            >
              <X className="w-4 h-4 text-[#0B2343]/40" />
            </button>

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={disabled}
              className="p-2.5 rounded-xl bg-[#ff7c22] text-white hover:bg-[#e86e1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              title="Send file"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ── Normal text input mode ── */
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Attachment button */}
            {onSendFile && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-lg hover:bg-[#F8F9FB] transition-colors shrink-0"
                  title="Attach file"
                  disabled={disabled}
                >
                  <Paperclip className="w-5 h-5 text-[#0B2343]/40" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden text-base lg:text-sm"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
              </>
            )}

            {/* Auto-expanding textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder="Type a message..."
              disabled={disabled}
              rows={1}
              className="flex-1 resize-none rounded-xl bg-[#F8F9FB] border border-[#0B2343]/[0.06] px-4 py-2.5 text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 outline-none focus:ring-2 focus:ring-[#ff7c22]/20 focus:border-[#ff7c22]/30 transition-all disabled:opacity-50 overflow-hidden"
              style={{ maxHeight: 132 }}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={disabled || !canSend}
              className="p-2.5 rounded-xl bg-[#ff7c22] text-white hover:bg-[#e86e1a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-[#0B2343]/25 mt-1.5 text-center">
            Press <span className="font-medium">Enter</span> to send,{" "}
            <span className="font-medium">Shift + Enter</span> for new line
          </p>
        </div>
      )}
    </div>
  );
}
