/**
 * Chat bubbles for the unified AI tutor session page — extracted
 * from AiTutorSession.tsx. Exported for axe scanning + reuse.
 */

import { Sparkles, Volume2, Loader2, Mic } from "lucide-react";
import { t, type BankLang } from "./copy";
import type { PronunciationAssessment } from "../../api/esolApi";

export type ChatMessage = {
  id: string;
  role: "amber" | "learner";
  text: string;
  safeguarding?: boolean;
  timestamp: Date;
  /** F32 — true when this learner turn went through the voice endpoint. */
  spoken?: boolean;
  /** F32 — pronunciation assessment for a spoken turn (AI signal). */
  pronunciation?: PronunciationAssessment | null;
};

/** Clarity bucket → copy key + colour classes. Colour never carries the
 *  meaning alone: every chip has a text label (WCAG 1.4.1). */
const CLARITY_STYLE: Record<
  PronunciationAssessment["clarity"],
  { key: "pron_clear" | "pron_mostly" | "pron_unclear"; cls: string }
> = {
  clear: {
    key: "pron_clear",
    cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  mostly_clear: {
    key: "pron_mostly",
    cls: "bg-amber-50 text-amber-800 border-amber-200",
  },
  unclear: {
    key: "pron_unclear",
    cls: "bg-rose-50 text-rose-800 border-rose-200",
  },
};

export function MessageBubble({
  message,
  bankLang = "en",
  fontSizeClass,
  onListen,
  listenState,
}: {
  message: ChatMessage;
  bankLang?: BankLang;
  fontSizeClass: string;
  /** F28 — when provided (TTS available), Amber bubbles show a Listen
   *  button that plays the line aloud. */
  onListen?: () => void;
  /** Playback state for THIS bubble: idle | loading | playing. */
  listenState?: "idle" | "loading" | "playing";
}) {
  const isLearner = message.role === "learner";

  // Claude-style:
  //   - Learner messages are end-aligned rounded bubbles in a soft
  //     cream/grey, NOT the harsh dark-navy of before.
  //   - Amber messages are FLAT (no bubble), with a small "Amber" label
  //     + sparkle icon above the prose. Reads like a document.
  //   - Safeguarding replies keep an amber tint so they stand out — but
  //     as a start-border accent rather than a filled card.
  //
  // Logical properties (ms-/me-/ps-/rounded-ee-…) throughout so the
  // layout mirrors correctly when the page is RTL (Arabic, Urdu, Farsi).
  if (isLearner) {
    const clarity =
      message.spoken && message.pronunciation
        ? (CLARITY_STYLE[message.pronunciation.clarity] ??
          CLARITY_STYLE.unclear)
        : null;
    return (
      <div className="flex flex-col items-end">
        <div
          className={`
            max-w-[85%] px-4 py-2.5 rounded-2xl rounded-ee-md
            bg-[#0B2343]/[0.06] text-[#0B2343]
            ${fontSizeClass}
          `}
        >
          <p className="whitespace-pre-wrap break-words">
            {/* F32 — spoken turns carry a small mic glyph + sr-only
                label so the transcript distinguishes voice from typing. */}
            {message.spoken && (
              <>
                <Mic
                  size={14}
                  aria-hidden="true"
                  className="inline-block align-[-2px] me-1.5 text-[#ff7c22]"
                />
                <span className="sr-only">{t(bankLang, "spoken_label")} </span>
              </>
            )}
            {message.text}
          </p>
        </div>
        {/* F32 — pronunciation chip under a spoken bubble. Clarity label
            (coloured) + the one-line tip for the learner. */}
        {clarity && message.pronunciation && (
          <div className="max-w-[85%] mt-1.5 flex items-start gap-2 flex-wrap justify-end">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${clarity.cls}`}
            >
              {t(bankLang, clarity.key)}
            </span>
            {message.pronunciation.tip_for_learner && (
              <p
                className={`text-[#0B2343]/60 leading-snug text-end ${fontSizeClass === "text-lg" ? "text-base" : "text-sm"}`}
              >
                {message.pronunciation.tip_for_learner}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3">
      <div
        aria-hidden="true"
        className="w-7 h-7 rounded-full bg-[#ff7c22]/12 flex items-center justify-center shrink-0 mt-1"
      >
        <Sparkles size={14} className="text-[#ff7c22]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0B2343]/40 mb-1.5">
          Amber
        </p>
        <div
          className={`
            ${fontSizeClass} text-[#0B2343] leading-relaxed
            ${
              message.safeguarding
                ? "border-s-2 border-amber-400 ps-3 -ms-3"
                : ""
            }
          `}
        >
          {/* Preserves newlines from Amber's multi-line replies. */}
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        {/* F28 — Listen: play Amber's line aloud (TTS). Only rendered
            when voice is available (onListen supplied). */}
        {onListen && (
          <button
            type="button"
            onClick={onListen}
            disabled={listenState === "loading"}
            aria-label={
              listenState === "playing" ? "Playing aloud" : "Listen to this"
            }
            className="mt-1.5 inline-flex items-center gap-1.5 min-h-[32px] px-2 -ms-2 text-[11px] font-semibold text-[#0B2343]/45 hover:text-[#ff7c22] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors disabled:opacity-60"
          >
            {listenState === "loading" ? (
              <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            ) : (
              <Volume2 size={13} aria-hidden="true" />
            )}
            Listen
          </button>
        )}
        {/* L1 translation hint block removed — no backend translation
            for AI replies today. Re-add a real <p> here showing the
            translated text when the backend ships the endpoint. */}
      </div>
    </div>
  );
}

export function TypingIndicator({ label }: { label: string }) {
  // Mirrors the Amber message layout: avatar + "Amber" label + three
  // bouncing dots in the prose area (not inside a bubble).
  return (
    <div role="status" aria-live="polite" className="flex justify-start gap-3">
      <div
        aria-hidden="true"
        className="w-7 h-7 rounded-full bg-[#ff7c22]/12 flex items-center justify-center shrink-0 mt-1"
      >
        <Sparkles size={14} className="text-[#ff7c22]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0B2343]/40 mb-1.5">
          Amber
        </p>
        <div className="inline-flex items-center gap-1 py-1">
          <span className="sr-only">{label}</span>
          {/* Three bouncing dots. aria-hidden because the sr-only label
              above carries the semantic meaning. */}
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 bg-[#0B2343]/35 rounded-full animate-bounce [animation-delay:-0.3s]"
          />
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 bg-[#0B2343]/35 rounded-full animate-bounce [animation-delay:-0.15s]"
          />
          <span
            aria-hidden="true"
            className="w-1.5 h-1.5 bg-[#0B2343]/35 rounded-full animate-bounce"
          />
        </div>
      </div>
    </div>
  );
}
