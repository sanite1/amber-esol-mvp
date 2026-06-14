/**
 * /esol/messages — ESOL learner inbox for teacher messages.
 *
 * Final Addendum §11. Renders the calling learner's unread
 * TeacherMessage rows with per-row Mark-as-read action.
 *
 * Backend reality (verified in
 *   amber-esol-backend/src/routes/esolMessages.routes.ts
 *   amber-esol-backend/src/services/learnerUnreadMessages.service.ts
 * ):
 *
 *   GET /api/esol/messages/unread          → list of UNREAD messages only
 *   PATCH /api/esol/messages/:id/read      → mark single message as read
 *
 * There is intentionally **no read-history endpoint** today. Once a
 * learner taps "Mark as read" the message disappears from the
 * unread list and from this page. If the backend adds a list-all
 * endpoint later, this page can grow a "Read history" tab without
 * the unread surface needing to change.
 *
 * Trigger semantics (TeacherMessage.trigger):
 *   - "manual"          — teacher typed and sent
 *   - "priority_queue"  — teacher triggered from priority queue
 *   - "cron"            — auto-sent by the re-engagement cron
 *                         (Final Addendum §11)
 *
 * Only `cron` messages render the "Auto-sent" badge — the others
 * are indistinguishable from the learner's perspective (a real
 * teacher hit Send either way).
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Inbox,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useUnreadMessages } from "../api/learnerMessagesApi";
import { useMarkTeacherMessageRead } from "../api/esolApi";

const formatTime = (iso: string): string => {
  const then = new Date(iso);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export default function LearnerMessages() {
  const { data, isLoading, isError, error, refetch } = useUnreadMessages();
  const { mutate: markRead, isPending: marking } = useMarkTeacherMessageRead();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const messages = data?.data?.messages ?? [];
  const count = data?.data?.count ?? 0;

  const handleMarkRead = (messageId: string): void => {
    markRead(
      { messageId },
      {
        onSuccess: () => {
          // The list query has its own staleTime; force a refetch
          // so the just-read message disappears immediately.
          refetch();
        },
      },
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2343] tracking-tight">
            Messages from your tutor
          </h1>
          <p className="text-sm text-[#0B2343]/50 mt-1">
            {count === 0
              ? "You're caught up."
              : `${count} unread ${count === 1 ? "message" : "messages"}.`}
          </p>
        </div>
        <Link
          to="/esol/home"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B2343]/60 hover:text-[#ff7c22] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-12 text-center">
          <Loader2
            size={24}
            className="text-[#ff7c22] animate-spin mx-auto mb-2"
          />
          <p className="text-sm text-[#0B2343]/40">Loading messages…</p>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#0B2343]">
              Couldn't load your messages
            </p>
            <p className="text-xs text-[#0B2343]/60 mt-0.5">
              {error?.response?.data?.message ??
                "Check your connection and try again."}
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && messages.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-3">
            <Inbox size={20} className="text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-[#0B2343]">
            You're all caught up
          </p>
          <p className="text-xs text-[#0B2343]/40 mt-1 max-w-md mx-auto">
            New messages from your tutor will appear here. You'll also see them
            on your home page banner and in your next AI tutor session.
          </p>
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((msg) => {
            const senderName = [msg.teacher_firstname, msg.teacher_lastname]
              .filter(Boolean)
              .join(" ");
            const isAutoSent = msg.trigger === "cron";
            const isTranslated = msg.original_text !== null;

            return (
              <article
                key={msg._id}
                className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden"
              >
                <header className="px-5 py-3 border-b border-[#0B2343]/[0.04] bg-[#fafbfc] flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#fff8ee] flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-[#ff7c22]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#0B2343] truncate">
                        {senderName || "Your tutor"}
                      </p>
                      <p className="text-[11px] text-[#0B2343]/50">
                        {formatTime(msg.sent_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAutoSent && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[#0B2343]/[0.06] text-[#0B2343]/70"
                        title="Auto-sent by the re-engagement scheduler — not a one-off teacher reply"
                      >
                        <Sparkles size={10} />
                        Auto-sent
                      </span>
                    )}
                    {isTranslated && (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-blue-50 text-blue-700"
                        title={`Original (English): "${msg.original_text}"`}
                      >
                        Translated · {msg.language}
                      </span>
                    )}
                  </div>
                </header>

                <div className="px-5 py-4">
                  <p
                    className="text-sm text-[#0B2343] leading-relaxed whitespace-pre-wrap"
                    lang={msg.language || undefined}
                    dir={
                      ["ar", "ur", "ps", "fa"].includes(msg.language ?? "")
                        ? "rtl"
                        : undefined
                    }
                  >
                    {msg.message_text}
                  </p>
                </div>

                <footer className="px-5 py-3 border-t border-[#0B2343]/[0.04] flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleMarkRead(msg._id)}
                    disabled={marking}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0B2343]/[0.08] text-xs font-bold text-[#0B2343]/60 rounded-lg hover:bg-[#0B2343]/[0.02] disabled:opacity-50 transition-colors"
                    aria-label={`Mark message from ${senderName || "your tutor"} as read`}
                  >
                    {marking ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                    Mark as read
                  </button>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
