/**
 * Post-session celebration panel — score, vocab count, the AI
 * tutor's session summary, and emoji feedback. Extracted from
 * AiTutorSession.tsx.
 */

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { EndSessionResponse } from "../../api/esolApi";
import { t, type BankLang } from "./copy";
import { playCompletionChime } from "./chime";

// ─────────────────────────────────────────────────────────────────────
// SessionCompletePanel + emoji feedback
// ─────────────────────────────────────────────────────────────────────

export function SessionCompletePanel({
  bankLang,
  result,
  scoreFontClass,
  onFinish,
}: {
  bankLang: BankLang;
  result: EndSessionResponse;
  scoreFontClass: string;
  onFinish: () => void;
}) {
  const [feedback, setFeedback] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // F31 — warm chime on the COMPLETE beat. Best-effort; no-ops when
  // audio is blocked or the learner prefers reduced motion. Fires once
  // on mount (the panel is only mounted when a session completes).
  useEffect(() => {
    playCompletionChime();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center px-4 py-10"
      role="status"
      aria-live="polite"
    >
      <main className="max-w-md w-full text-center">
        <div
          aria-hidden="true"
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center"
        >
          <CheckCircle2 size={28} className="text-emerald-600" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B2343] mb-1">
          {t(bankLang, "session_complete_title")}
        </h1>

        <dl className="grid grid-cols-2 gap-3 my-6">
          <div className="bg-white border border-[#0B2343]/[0.06] rounded-xl py-3">
            <dt className="text-xs text-[#0B2343]/50 uppercase tracking-wide font-bold">
              {t(bankLang, "session_complete_score")}
            </dt>
            <dd
              className={`font-extrabold ${scoreFontClass} ${
                result.passed ? "text-emerald-600" : "text-[#0B2343]"
              }`}
            >
              {/* Real percentage — the original "show no scores" rule
                  was reversed by product: learners ended sessions and
                  saw only a dash, which read as a bug. final_score is
                  the mean of per-turn AI grades (0..1). */}
              {Math.round(result.final_score * 100)}%
            </dd>
          </div>
          <div className="bg-white border border-[#0B2343]/[0.06] rounded-xl py-3">
            <dt className="text-xs text-[#0B2343]/50 uppercase tracking-wide font-bold">
              {t(bankLang, "session_complete_vocab")}
            </dt>
            <dd className={`font-extrabold text-[#0B2343] ${scoreFontClass}`}>
              {result.vocabulary_retained_count}
            </dd>
          </div>
        </dl>

        {/* AI tutor's session summary — generated at end-time from the
            transcript (engagement, vocab introduced, focus for next
            session). Null for zero-turn sessions or if generation
            failed, in which case we simply omit the card. */}
        {result.session_summary && (
          <div className="text-left rounded-2xl bg-[#fff8ee] border border-[#ff7c22]/25 p-4 sm:p-5 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#ff7c22] mb-1.5">
              Your tutor's note
            </p>
            <p className="text-sm text-[#0B2343]/80 leading-relaxed whitespace-pre-wrap">
              {result.session_summary}
            </p>
          </div>
        )}

        {/* Emoji feedback — UI only for MVP. Persistence is a Phase Y
            endpoint; we silently swallow the choice until that lands. */}
        {!submitted ? (
          <div className="mb-6">
            <p className="text-sm text-[#0B2343]/70 mb-3">
              {t(bankLang, "feedback_prompt")}
            </p>
            <div
              className="flex justify-center gap-2"
              role="radiogroup"
              aria-label={t(bankLang, "feedback_prompt")}
            >
              {["😞", "🙁", "😐", "🙂", "😄"].map((emoji, idx) => (
                <button
                  key={emoji}
                  type="button"
                  role="radio"
                  aria-checked={feedback === idx}
                  onClick={() => {
                    setFeedback(idx);
                    setSubmitted(true);
                  }}
                  className="min-h-[44px] min-w-[44px] text-2xl rounded-xl hover:bg-[#ff7c22]/10 focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors"
                  aria-label={`Rating ${idx + 1} of 5`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-emerald-700 mb-6">
            {t(bankLang, "feedback_thanks")}
          </p>
        )}

        <button
          type="button"
          onClick={onFinish}
          className="w-full min-h-[48px] inline-flex items-center justify-center px-5 py-3 bg-[#ff7c22] text-white text-base font-bold rounded-xl hover:bg-[#e56a10] focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 transition-colors"
        >
          {t(bankLang, "session_complete_finish")}
        </button>
      </main>
    </div>
  );
}
