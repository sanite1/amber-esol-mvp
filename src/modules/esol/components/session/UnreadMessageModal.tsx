/**
 * Unread teacher-message walk-through modal — shown before the
 * chat when /start returns unread messages. Extracted from
 * AiTutorSession.tsx.
 */

import { ArrowRight } from "lucide-react";
import { TeacherMessage } from "../../api/esolApi";
import { t, type BankLang } from "./copy";

export function UnreadMessageModal({
  bankLang,
  message,
  isLast,
  onNext,
  fontSizeClass,
}: {
  bankLang: BankLang;
  message: TeacherMessage;
  isLast: boolean;
  onNext: () => void;
  fontSizeClass: string;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unread-msg-title"
      className="fixed inset-0 z-50 bg-[#0B2343]/40 flex items-center justify-center px-4"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h2
          id="unread-msg-title"
          className="text-lg font-extrabold text-[#0B2343] mb-1"
        >
          {t(bankLang, "unread_title")}
        </h2>
        <p className="text-xs text-[#0B2343]/50 mb-4">
          {/* Backend doesn't currently include the teacher's firstname
              in the response; placeholder until Phase 24 enriches the
              shape with teacher metadata. */}
          {t(bankLang, "unread_from_teacher")} ·{" "}
          {new Date(message.created_at).toLocaleDateString(
            bankLang === "en" ? "en-GB" : undefined,
          )}
        </p>
        <div
          className={`text-[#0B2343] whitespace-pre-wrap break-words mb-6 ${fontSizeClass}`}
        >
          {message.message_text}
        </div>
        <button
          type="button"
          onClick={onNext}
          className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#ff7c22] text-white text-base font-bold rounded-xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors"
        >
          {isLast ? t(bankLang, "unread_done") : t(bankLang, "unread_next")}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
