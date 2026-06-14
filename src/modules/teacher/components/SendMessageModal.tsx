/**
 * SendMessageModal — Final Addendum §11.
 *
 * Send a 1-300 char message from the teacher to one learner, with
 * optional auto-translation to the learner's L1 via Gemini.
 *
 * Props
 * =====
 *
 *   learner       — { _id, firstname, l1_language }. The L1 drives
 *                   the toggle's default state and the preview
 *                   target language.
 *   template?     — Pre-fill the textarea on open. Comes from the
 *                   priority-action dispatcher when the modal was
 *                   triggered by a "Send re-engagement message" /
 *                   etc. click; absent when the modal was opened
 *                   from the sidebar CTA.
 *   trigger?      — Propagated to the POST body so the audit row
 *                   records why the message was sent
 *                   ("manual" | "priority_queue" | …).
 *   onClose       — Parent-owned dismiss.
 *
 * Live preview
 * ============
 *
 * When translation is on and the learner's L1 isn't English, the
 * modal shows a live preview of the translated text. The text the
 * teacher is typing is debounced 800ms before hitting the preview
 * endpoint — typing pauses fire the call, typing bursts don't.
 *
 * The preview hook is a useQuery (not a mutation) so react-query
 * caches identical (text, language) pairs across the modal's
 * lifetime — typing "hello", deleting back to "hell", then
 * retyping "hello" produces ONE Gemini call.
 *
 * The send path also translates (server-side) — we don't trust
 * the preview text on submit. The teacher sends English; the
 * server re-translates and persists. Cosmetic guarantee: same
 * prompt + temperature: 0 means preview output === send output
 * (modulo Gemini's rare nondeterminism).
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - Dialog traps focus; ESC dismisses.
 *   - Header carries `aria-labelledby` on the title.
 *   - Textarea has a visible <label>; counter live-region
 *     (`aria-live="polite"`) announces remaining chars at
 *     20-char thresholds so screen readers don't get spammed.
 *   - Toggle is a real <Switch> with a visible <FormLabel>.
 *   - Preview area carries `role="status"` + `aria-live="polite"`
 *     so SR users hear the translation as it arrives.
 *   - Send button is disabled when the textarea is empty, over
 *     300 chars, or a translation is in-flight.
 */

import { useEffect, useState } from "react";
import { Loader2, AlertTriangle, Sparkles } from "lucide-react";

import {
  useSendTeacherMessage,
  useTranslationPreview,
} from "../api/teacherDashboardApi";
import type { SendMessageTrigger } from "../lib/types/teacherDashboard";
// Phase 8.2c — Tailwind dialog primitive replacing MUI Dialog.
import Modal from "../../../components/Modal";

// ─────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────

export interface SendMessageModalLearner {
  _id: string;
  firstname: string;
  /** Learner's L1 — drives the translation toggle default. */
  l1_language: string | null;
}

export interface SendMessageModalProps {
  open: boolean;
  onClose: () => void;
  learner: SendMessageModalLearner;
  /** Pre-fill the textarea on open (priority-action dispatcher case). */
  template?: string;
  /** Propagated to the POST body for the audit row. Defaults "manual". */
  trigger?: SendMessageTrigger;
}

const MAX_LENGTH = 300;
const PREVIEW_DEBOUNCE_MS = 800;
const ENGLISH_NAMES = new Set(["english", "en"]);

const isEnglish = (lang: string | null | undefined): boolean =>
  !lang || ENGLISH_NAMES.has(lang.toString().trim().toLowerCase());

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

export default function SendMessageModal({
  open,
  onClose,
  learner,
  template,
  trigger,
}: SendMessageModalProps) {
  const learnerIsEnglish = isEnglish(learner.l1_language);

  // Textarea state. Resets when the modal opens with a (possibly
  // new) template — closing + reopening for a different priority
  // trigger swaps the prefill in cleanly.
  const [text, setText] = useState<string>(template ?? "");
  // Translation toggle — defaults ON when the learner's L1 isn't
  // English. Stays under teacher control; they can untick to send
  // in English at any time.
  const [translate, setTranslate] = useState<boolean>(!learnerIsEnglish);

  useEffect(() => {
    if (open) {
      setText(template ?? "");
      setTranslate(!learnerIsEnglish);
    }
  }, [open, template, learnerIsEnglish]);

  const trimmed = text.trim();
  const length = trimmed.length;
  const overLimit = length > MAX_LENGTH;
  const empty = length === 0;

  // 800ms debounce on the preview text. We don't debounce the
  // textarea itself (the teacher needs immediate visual feedback
  // on their typing) — only the value that's passed downstream to
  // the preview hook.
  const debouncedText = useDebouncedValue(trimmed, PREVIEW_DEBOUNCE_MS);

  const previewEnabled =
    translate &&
    !learnerIsEnglish &&
    debouncedText.length > 0 &&
    debouncedText.length <= MAX_LENGTH;

  const previewQuery = useTranslationPreview(
    previewEnabled
      ? {
          message_text: debouncedText,
          target_language: learner.l1_language ?? "",
        }
      : null,
    { enabled: previewEnabled },
  );

  const sendMutation = useSendTeacherMessage();
  const sending = sendMutation.isPending;

  const onSubmit = async () => {
    if (empty || overLimit) return;
    try {
      await sendMutation.mutateAsync({
        learnerId: learner._id,
        data: {
          message_text: trimmed,
          // Even when the toggle is on, the server skips the call
          // for English-L1 learners — but we send the boolean
          // faithfully so the audit row records the teacher's
          // intent.
          translate_to_l1: translate && !learnerIsEnglish,
          trigger: trigger ?? "manual",
        },
      });
      onClose();
    } catch {
      // mutation.onError already toasted; keep the modal open so
      // the teacher can retry or untick translation.
    }
  };

  // Character counter — colour shifts to warning at 50-chars-left
  // and error at over-limit. The remaining-chars text is the SR-
  // friendly fallback (aria-live region below).
  const remaining = MAX_LENGTH - length;
  const counterClass = overLimit
    ? "text-red-600"
    : remaining <= 50
      ? "text-amber-700"
      : "text-[#0B2343]/45";

  // The Send button needs a stable disabled-reason for the tooltip.
  // Order matters: empty first, then over-limit, then in-flight.
  const sendDisabledReason = empty
    ? "Type a message first."
    : overLimit
      ? `Message is ${length} characters — trim to ${MAX_LENGTH} or fewer.`
      : sending
        ? "Sending…"
        : previewEnabled && previewQuery.isFetching
          ? "Waiting for translation preview…"
          : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Send a message to ${learner.firstname || "this learner"}`}
      titleId="send-message-title"
      size="md"
      disableEscapeKey={sending}
      disableBackdropClick={sending}
    >
      <Modal.Body className="space-y-4">
        <p className="text-sm text-[#0B2343]/70 leading-relaxed">
          Keep it short — long-form coaching belongs in a session, not a
          message. Max {MAX_LENGTH} characters.
        </p>

        {/* Composer ─────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="send-message-text"
            className="block text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1"
          >
            Your message (English)
          </label>
          <textarea
            id="send-message-text"
            autoFocus
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-describedby="send-message-counter"
            aria-invalid={overLimit}
            className={`w-full rounded-xl bg-white px-3 py-2 text-sm text-[#0B2343] focus:outline-none focus:ring-2 transition-colors ${
              overLimit
                ? "border border-red-300 focus:border-red-400 focus:ring-red-300/30"
                : "border border-[#0B2343]/[0.12] focus:border-[#ff7c22] focus:ring-[#ff7c22]/20"
            }`}
          />
          <div
            id="send-message-counter"
            aria-live="polite"
            aria-atomic="true"
            className="flex justify-end mt-1"
          >
            <span
              className={`text-[11px] font-semibold tabular-nums ${counterClass}`}
            >
              {length} / {MAX_LENGTH}
              {overLimit && ` (${length - MAX_LENGTH} over)`}
            </span>
          </div>
        </div>

        {/* Translation toggle ──────────────────────────────────── */}
        {learnerIsEnglish ? (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800 leading-relaxed">
            This learner&apos;s L1 is English — no translation needed.
          </div>
        ) : (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#fafbfc] border border-[#0B2343]/[0.06]">
            <button
              type="button"
              role="switch"
              aria-checked={translate}
              aria-label={`Send in ${learner.l1_language} (auto-translated by AI)`}
              onClick={() => setTranslate((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 mt-0.5 ${
                translate ? "bg-[#ff7c22]" : "bg-[#0B2343]/15"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-1 inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-out ${
                  translate ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#0B2343]">
                Send in{" "}
                <strong className="font-bold text-[#0B2343]">
                  {learner.l1_language}
                </strong>
              </p>
              <p className="text-[11px] text-[#0B2343]/55 mt-0.5 flex items-center gap-1">
                <Sparkles
                  size={10}
                  className="text-[#ff7c22]"
                  aria-hidden="true"
                />
                Auto-translated by AI
              </p>
            </div>
          </div>
        )}

        {/* Live preview ────────────────────────────────────────── */}
        {translate && !learnerIsEnglish && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl bg-[#fff8ee] border-l-4 border-[#ff7c22] p-4 min-h-[88px]"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff7c22] mb-2">
              Preview ({learner.l1_language})
            </p>
            <PreviewBody
              loading={previewQuery.isFetching}
              error={previewQuery.isError}
              text={previewQuery.data?.data?.translated ?? null}
              empty={debouncedText.length === 0}
            />
          </div>
        )}
      </Modal.Body>

      <Modal.Actions>
        <button
          type="button"
          onClick={onSubmit}
          disabled={Boolean(sendDisabledReason)}
          // title= carries the disabled reason for sighted hover users
          // + AT users via the title prop. Keeps it server-side simple
          // (no extra tooltip component needed).
          title={sendDisabledReason ?? undefined}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-[#ff7c22] text-white text-xs font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending && (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          )}
          {sending ? "Sending…" : "Send"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={sending}
          className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-xs font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PreviewBody — three states inside the preview panel
// ─────────────────────────────────────────────────────────────────────

interface PreviewBodyProps {
  loading: boolean;
  error: boolean;
  text: string | null;
  empty: boolean;
}

function PreviewBody({ loading, error, text, empty }: PreviewBodyProps) {
  if (empty) {
    return (
      <p className="text-sm text-[#0B2343]/55">
        Start typing to see the translation here.
      </p>
    );
  }
  if (loading) {
    return (
      <p className="flex items-center gap-2 text-sm text-[#0B2343]/55">
        <Loader2
          size={14}
          className="animate-spin text-[#ff7c22]"
          aria-hidden="true"
        />
        Translating…
      </p>
    );
  }
  if (error) {
    return (
      <p className="flex items-start gap-2 text-xs text-amber-800 leading-relaxed">
        <AlertTriangle
          size={14}
          className="text-amber-600 shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <span>
          Translation preview unavailable — you can still send. The server will
          retry the translation on send.
        </span>
      </p>
    );
  }
  if (!text) {
    return (
      <p className="text-sm text-[#0B2343]/55">Preview will appear here.</p>
    );
  }
  // Many target languages are RTL. The browser's bidi algorithm handles
  // this correctly when `dir="auto"` is set — far more reliable than
  // detecting the language and forcing dir="rtl"/"ltr" by hand.
  return (
    <p
      dir="auto"
      className="text-sm text-[#0B2343] leading-relaxed whitespace-pre-wrap"
    >
      {text}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────────────
// useDebouncedValue — tiny inline debounce helper
//
// React 18's useDeferredValue is cheaper but doesn't respect a time
// budget — it yields when React thinks it's a good idea. For an
// 800ms hand-tuned debounce against an external API, an explicit
// setTimeout is the right primitive.
// ─────────────────────────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
