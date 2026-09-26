import { Loader2, Pause, Play, Send, Trash2 } from "lucide-react";

import { t, type BankLang } from "./copy";

/**
 * Voice-note style recording bar (F32). Replaces the text input while
 * the microphone is live so the learner can SEE that they are being
 * heard: a running clock, a live level meter, pause/resume, discard,
 * and send. Purely presentational — the audio still goes to
 * /esol/session/turn-voice on send exactly as before.
 *
 * Accessibility: every control is a 44px button with a translated
 * label; the clock is a role="timer"; the meter is decorative and
 * hidden from assistive tech (the clock already conveys progress).
 */
interface RecordingBarProps {
  elapsedMs: number;
  /** Recent input levels, 0..1, oldest first. Fixed length. */
  levels: number[];
  paused: boolean;
  /** True once the recording has been handed to the server. */
  sending: boolean;
  bankLang: BankLang;
  onDiscard: () => void;
  onTogglePause: () => void;
  onSend: () => void;
}

const formatClock = (ms: number): string => {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const RecordingBar = ({
  elapsedMs,
  levels,
  paused,
  sending,
  bankLang,
  onDiscard,
  onTogglePause,
  onSend,
}: RecordingBarProps) => (
  <div
    role="group"
    aria-label={t(bankLang, "rec_status")}
    className="flex items-center gap-2 px-2 py-2 min-h-[64px]"
  >
    <button
      type="button"
      onClick={onDiscard}
      disabled={sending}
      aria-label={t(bankLang, "rec_discard")}
      className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full text-[#0B2343]/60 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <Trash2 size={20} aria-hidden="true" />
    </button>

    <span className="flex items-center gap-1.5 shrink-0">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full bg-red-500 ${paused ? "opacity-40" : "animate-pulse"}`}
      />
      <span
        role="timer"
        aria-live="off"
        className="tabular-nums text-[#0B2343] font-medium text-base min-w-[2.75rem]"
      >
        {formatClock(elapsedMs)}
      </span>
    </span>

    {/* Level meter. Newest sample on the end, so speech "scrolls" in
        from the send side, like a phone voice note. Locked LTR so the
        chronology reads the same under RTL page direction. */}
    <div
      aria-hidden="true"
      dir="ltr"
      className="flex-1 min-w-0 h-10 flex items-center gap-[2px] overflow-hidden"
    >
      {levels.map((v, i) => (
        <span
          key={i}
          className={`w-[3px] shrink-0 rounded-full transition-[height] duration-75 ${
            paused ? "bg-[#0B2343]/30" : "bg-[#0B2343]/70"
          }`}
          style={{ height: `${Math.max(10, Math.round(v * 100))}%` }}
        />
      ))}
    </div>

    <button
      type="button"
      onClick={onTogglePause}
      disabled={sending}
      aria-label={paused ? t(bankLang, "rec_resume") : t(bankLang, "rec_pause")}
      aria-pressed={paused}
      className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {paused ? (
        <Play size={18} aria-hidden="true" />
      ) : (
        <Pause size={18} aria-hidden="true" />
      )}
    </button>

    <button
      type="button"
      onClick={onSend}
      disabled={sending}
      aria-label={t(bankLang, "mic_stop")}
      className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full bg-[#0B2343] text-white hover:bg-[#ff7c22] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {sending ? (
        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      ) : (
        <Send size={18} aria-hidden="true" />
      )}
    </button>
  </div>
);
