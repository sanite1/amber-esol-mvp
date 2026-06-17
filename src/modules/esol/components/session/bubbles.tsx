/**
 * Chat bubbles for the unified AI tutor session page — extracted
 * from AiTutorSession.tsx. Exported for axe scanning + reuse.
 */

import { Sparkles, Volume2, Loader2 } from "lucide-react";
import { type BankLang } from "./copy";

export type ChatMessage = {
  id: string;
  role: "amber" | "learner";
  text: string;
  safeguarding?: boolean;
  timestamp: Date;
};

export function MessageBubble({
  message,
  fontSizeClass,
  onListen,
  listenState,
}: {
  message: ChatMessage;
  bankLang?: BankLang; // reserved — see L1 toggle comment in the form footer
  fontSizeClass: string;
  /** F28 — when provided (TTS available), Amber bubbles show a Listen
   *  button that plays the line aloud. */
  onListen?: () => void;
  /** Playback state for THIS bubble: idle | loading | playing. */
  listenState?: "idle" | "loading" | "playing";
}) {
  const isLearner = message.role === "learner";

  // Claude-style:
  //   - Learner messages are right-aligned rounded bubbles in a soft
  //     cream/grey, NOT the harsh dark-navy of before.
  //   - Amber messages are FLAT (no bubble), with a small "Amber" label
  //     + sparkle icon above the prose. Reads like a document.
  //   - Safeguarding replies keep an amber tint so they stand out — but
  //     as a left-border accent rather than a filled card.
  if (isLearner) {
    return (
      <div className="flex justify-end">
        <div
          className={`
            max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md
            bg-[#0B2343]/[0.06] text-[#0B2343]
            ${fontSizeClass}
          `}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>
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
                ? "border-l-2 border-amber-400 pl-3 -ml-3"
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
            className="mt-1.5 inline-flex items-center gap-1.5 min-h-[32px] px-2 -ml-2 text-[11px] font-semibold text-[#0B2343]/45 hover:text-[#ff7c22] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors disabled:opacity-60"
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
