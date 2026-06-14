/**
 * UnreadMessagesBlockingModal — Phase 3 / Final Addendum §11 (BE-E).
 *
 * Self-contained gate that pops on first /esol/home visit when the
 * learner has unread teacher messages. The learner walks through the
 * stack one message at a time; each "Got it" marks that message read
 * server-side via PATCH /esol/messages/:id/read, and the next message
 * slides in. After the last message the modal closes and the
 * underlying dashboard becomes interactive.
 *
 * Why a blocking modal instead of just the existing banner
 * =======================================================
 *
 * The brief (§11) calls out that a learner whose teacher pinged them
 * about an urgent issue (safeguarding nudge, "you haven't been here
 * in a week", etc.) shouldn't be able to dismiss the alert by
 * scrolling past a passive banner. The modal pattern from
 * AiTutorSession already proves the UX in-session; this lifts that
 * idea to the dashboard root so a learner who never starts a session
 * still sees the messages.
 *
 * "Read later" semantics
 * ======================
 *
 * The brief's intent is "don't trap the learner forever" — a learner
 * with 5 messages who's logging in to do something else shouldn't be
 * forced to walk through every message before they can do anything.
 * So:
 *
 *   - "Got it" advances + marks-read (durable; survives sessions).
 *   - "Read later" closes the modal without marking anything read.
 *     The banner above is still present, the inbox still has the
 *     messages flagged, AND we stamp a sessionStorage key so the
 *     modal doesn't re-pop within the same browser session.
 *     A new session (tab close → reopen) re-shows it.
 *
 * The sessionStorage key is namespaced by the learner's user id
 * (read from the JWT) so a shared device that switches accounts
 * shows the modal to each learner exactly once per session.
 *
 * Failure modes
 * =============
 *
 *   - useUnreadMessages errors silently (returns no count) — the
 *     modal stays closed. Same fail-quiet pattern as
 *     UnreadMessagesBanner — a network blip shouldn't pop a
 *     blocking modal.
 *   - Mark-read mutation failure does NOT block the next-message
 *     advance. The session-start handler will mark them on the
 *     server side too, and the inbox PATCH retry will catch up.
 *     Trapping the learner because the network ate one PATCH is
 *     worse than a server that catches the second attempt.
 *
 * Accessibility
 * =============
 *
 *   - Built on the Modal primitive (role="dialog" + aria-modal +
 *     aria-labelledby). The primitive's corner close button, Esc
 *     handling and backdrop click are all disabled — this is a
 *     deliberately blocking dialog whose only exits are the
 *     explicit action buttons ("Got it", "Read later", "Open
 *     inbox").
 *   - Focus is moved to the action button on mount + on advance,
 *     so a keyboard-only user can dismiss without hunting for
 *     the focus.
 *   - Escape key triggers "Read later" via this component's own
 *     keydown listener — matches the OS modal convention. The
 *     button is still visible so SR users see it.
 *   - The progress indicator ("Message 2 of 4") gives the learner
 *     a sense of how much is left without forcing them to count.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ArrowRight, Inbox } from "lucide-react";

import Modal from "../../../components/Modal";
import { useUnreadMessages } from "../api/learnerMessagesApi";
import { useMarkTeacherMessageRead } from "../api/esolApi";
import { getDecodedJwt } from "../../dashboard/lib/auth";

// ─────────────────────────────────────────────────────────────────────
// SessionStorage helpers
//
// One key per learner. We deliberately use sessionStorage (not
// localStorage) so a fresh browser session re-shows the modal —
// the brief explicitly says "don't re-prompt forever, but don't
// silently skip on the next login either."
// ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = "esol.unreadBlockingModal.dismissedFor.";

const wasDismissedThisSession = (userId: string): boolean => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY_PREFIX + userId) === "1";
  } catch {
    // Private-mode browsers throw on storage access — treat as
    // "not dismissed" so the modal still fires once. The
    // sessionStorage-keyed re-show suppression is a UX nicety, not
    // a correctness requirement.
    return false;
  }
};

const markDismissedThisSession = (userId: string): void => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY_PREFIX + userId, "1");
  } catch {
    // Swallow; same reasoning as above.
  }
};

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

const UnreadMessagesBlockingModal: React.FC = () => {
  const decoded = getDecodedJwt();
  const userId = decoded?.id ?? "";

  const { data, isLoading, isError } = useUnreadMessages();
  const markRead = useMarkTeacherMessageRead();

  // Snapshot the unread list at the moment we decide to open. If
  // the parent re-renders because react-query polled, we don't
  // want to splice newly-arrived messages into the middle of the
  // current walk-through — those land in the banner / next-open
  // instead. The snapshot is the authoritative list for THIS
  // mount's walk-through.
  const [snapshot, setSnapshot] = useState<
    | {
        id: string;
        teacherFirst: string | null;
        text: string;
        sentAt: string;
      }[]
    | null
  >(null);
  const [idx, setIdx] = useState(0);
  // We intentionally don't auto-close on the LAST advance — the
  // "Got it" on the last message closes the modal so the learner
  // sees one final affordance. `closed` is set when either the
  // last message is acknowledged or "Read later" is clicked.
  const [closed, setClosed] = useState(false);

  // ── Decide whether to open ────────────────────────────────────────
  //
  // We pull the data into a snapshot only ONCE per mount + only
  // when:
  //   - the query has actually resolved successfully
  //   - there's at least one unread row
  //   - the user hasn't dismissed this session already
  //   - we haven't already snapshotted
  //
  // After snapshotting we don't re-evaluate — the walk-through is
  // driven by `idx` against the immutable `snapshot`.
  useEffect(() => {
    if (snapshot !== null) return;
    if (closed) return;
    if (isLoading || isError) return;
    if (!userId) return;
    if (wasDismissedThisSession(userId)) return;
    const messages = data?.data?.messages ?? [];
    if (messages.length === 0) return;

    setSnapshot(
      messages.map((m) => ({
        id: m._id,
        teacherFirst: m.teacher_firstname,
        text: m.message_text,
        sentAt: m.sent_at,
      })),
    );
  }, [snapshot, closed, isLoading, isError, userId, data?.data?.messages]);

  const total = snapshot?.length ?? 0;
  const open = !closed && snapshot !== null && idx < total;

  // ── Handlers ──────────────────────────────────────────────────────
  //
  // `onAdvance` is called by the "Got it" button. It:
  //   1. Fires the mark-read mutation for the CURRENT message
  //      (fire-and-forget; failure doesn't stall the advance).
  //   2. Increments idx — if we just acknowledged the last
  //      message, closes the modal and marks dismissed so a
  //      page-reload race doesn't re-open with empty content.
  const onAdvance = useCallback(() => {
    if (!snapshot || idx >= total) return;
    const current = snapshot[idx];
    markRead.mutate(
      { messageId: current.id },
      {
        // No onSuccess invalidate — we drive UI off the snapshot,
        // not the query cache. The next mount (tab close → reopen,
        // or a real page navigation back to /esol/home) will read
        // a fresh /unread response that already omits these IDs.
      },
    );
    const next = idx + 1;
    if (next >= total) {
      // Last message acknowledged — the dashboard is now usable.
      // Mark this session as dismissed so a stale query refetch
      // doesn't re-open the modal with an empty snapshot. The
      // banner above will refresh on focus and show the real
      // current unread count (likely 0).
      markDismissedThisSession(userId);
      setClosed(true);
    } else {
      setIdx(next);
    }
  }, [snapshot, idx, total, markRead, userId]);

  // `onReadLater` closes WITHOUT advancing / marking-read. The
  // banner above remains; the modal won't re-open this session.
  const onReadLater = useCallback(() => {
    markDismissedThisSession(userId);
    setClosed(true);
  }, [userId]);

  // ── Keyboard handling: Escape → Read later ───────────────────────
  //
  // The Modal primitive's own Esc handling is disabled
  // (disableEscapeKey) so this listener is the single source of
  // truth — Esc maps to the same "Read later" semantics as the
  // visible button, not a silent close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onReadLater();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onReadLater]);

  // ── Focus management: pin focus to the primary CTA on advance ────
  // The Modal primitive normally focuses its corner close button,
  // but that button is hidden here (hideCloseButton), so this
  // effect is what gives the keyboard user their landing spot.
  const advanceBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!open) return;
    // Small delay so the button is in the DOM before we focus.
    const id = window.setTimeout(() => {
      advanceBtnRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [open, idx]);

  const current = useMemo(
    () => (snapshot && snapshot[idx]) || null,
    [snapshot, idx],
  );

  // `current` is the render guard — the Modal primitive handles
  // `open`, but children below dereference `current`, so bail
  // before building them when there's nothing to show.
  if (!open || !current) return null;

  const isLast = idx === total - 1;
  const sentDate = (() => {
    try {
      return new Date(current.sentAt).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  })();

  return (
    <Modal
      open={open}
      onClose={onReadLater}
      title={
        current.teacherFirst
          ? `${current.teacherFirst} sent you a message`
          : "Message from your teacher"
      }
      titleId="unread-blocking-title"
      size="sm"
      hideCloseButton
      disableEscapeKey
      disableBackdropClick
    >
      <Modal.Body>
        {/* Progress eyebrow — Inbox icon + "x of y" context (was the
            header row of the hand-rolled panel). */}
        <div className="flex items-center gap-2.5 mb-1">
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-xl bg-[#ff7c22]/12 flex items-center justify-center"
          >
            <Inbox size={16} className="text-[#ff7c22]" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff7c22]">
            Message {idx + 1} of {total}
          </p>
        </div>

        {sentDate && (
          <p className="text-xs text-[#0B2343]/45 mb-4">{sentDate}</p>
        )}

        {/* Message body. `whitespace-pre-wrap` preserves teacher's
            line breaks; `break-words` keeps long words from
            overflowing the modal on narrow screens. */}
        <div className="rounded-2xl bg-[#fafbfc] border border-[#0B2343]/[0.06] p-4">
          <p className="text-sm text-[#0B2343] whitespace-pre-wrap break-words leading-relaxed">
            {current.text}
          </p>
        </div>
      </Modal.Body>
      <Modal.Actions>
        {/* flex-row-reverse: first child renders on the RIGHT. */}
        <button
          ref={advanceBtnRef}
          type="button"
          onClick={onAdvance}
          disabled={markRead.isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
        >
          {isLast ? "Got it — close" : "Got it — next"}
          <ArrowRight size={16} aria-hidden="true" />
        </button>

        <RouterLink
          to="/esol/messages"
          onClick={onReadLater}
          className="inline-flex items-center justify-center gap-1.5 px-2 py-2 min-h-[44px] text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md"
        >
          Open inbox
        </RouterLink>

        <button
          type="button"
          onClick={onReadLater}
          className="inline-flex items-center justify-center px-2 py-2 min-h-[44px] text-xs font-bold text-[#0B2343]/55 hover:text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md"
        >
          Read later
        </button>
      </Modal.Actions>
    </Modal>
  );
};

export default UnreadMessagesBlockingModal;
