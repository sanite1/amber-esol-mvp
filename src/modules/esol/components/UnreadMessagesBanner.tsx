/**
 * Learner dashboard unread-messages banner — Final Addendum §11.
 *
 * Renders on the learner home page when the calling learner has one
 * or more unread TeacherMessage rows. Silent failure: returns null
 * when there's nothing to show.
 *
 * If any unread message has `trigger: "cron"` (re-engagement
 * auto-send), the banner shows a small "Auto-sent" badge.
 */

import { Link as RouterLink } from "react-router-dom";
import { Mail, Sparkles } from "lucide-react";

import { useUnreadMessages } from "../api/learnerMessagesApi";

export default function UnreadMessagesBanner() {
  const { data, isLoading, isError } = useUnreadMessages();

  if (isLoading || isError) return null;

  const payload = data?.data;
  const count = payload?.count ?? 0;
  if (count === 0) return null;

  const newest = payload?.messages?.[0];
  const senderFirst = newest?.teacher_firstname ?? null;
  const anyAutoSent = (payload?.messages ?? []).some(
    (m) => m.trigger === "cron",
  );

  const headline =
    count === 1
      ? senderFirst
        ? `${senderFirst} sent you a message`
        : "You have a new message from your tutor"
      : `You have ${count} unread messages from your tutor${count === 1 ? "" : "s"}`;

  const ctaLabel =
    count === 1 ? "View your message" : `View your ${count} unread messages`;

  return (
    <section
      aria-label="Unread tutor messages"
      className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 border-l-4 border-l-sky-600 p-4 sm:p-5"
    >
      <Mail
        size={20}
        aria-hidden="true"
        className="shrink-0 mt-1 text-sky-700"
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-1 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-sky-900">
              {headline}
            </h2>
            {anyAutoSent && (
              <span
                title="At least one of these is from the re-engagement scheduler, not a one-off note from your teacher."
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-sky-300 bg-white text-sky-800"
              >
                <Sparkles size={10} aria-hidden="true" />
                Auto-sent
              </span>
            )}
          </div>
          <p className="text-sm text-sky-900/80 mt-0.5 leading-relaxed">
            Your tutor's notes are waiting in your inbox.
          </p>
        </div>
        <RouterLink
          to="/esol/messages"
          aria-label={ctaLabel}
          className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 transition-colors whitespace-nowrap"
        >
          View {count > 1 ? `(${count})` : ""}
        </RouterLink>
      </div>
    </section>
  );
}
