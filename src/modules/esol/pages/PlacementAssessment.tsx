import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { refresh as refreshJwt } from "../../dashboard/lib/api/authOnboarding";

import {
  useStartPlacement,
  useAnswerPlacement,
  useSubmitPlacement,
  PlacementQuestion,
  PlacementResult,
  EsolLevel,
} from "../api/esolApi";
import { LANGUAGES, LangCode } from "../data/translations";

/**
 * /esol/placement — brief Function 6.
 *
 * Drives the three-step backend flow:
 *   1. POST /esol/placement/start   → first question
 *   2. POST /esol/placement/answer  × 20
 *   3. POST /esol/placement/submit  → Gemini-scored result
 *
 * Language: hydrated from localStorage `esol_lang` (set by JoinWizard
 * during onboarding). Falls back to English if absent or unsupported
 * by the placement bank — the bank covers 5 languages (en/ar/so/fa/zh);
 * the wizard's 14 extras and Pashto degrade to English here.
 *
 * WCAG 2.1 AA:
 *   - 44 × 44 px minimum tap targets (each option button is ≥ 64px tall
 *     by default and stretches to fit content)
 *   - aria-live region announces "Question N of 20" on each transition
 *   - First option button auto-focuses when a new question lands
 *   - High-contrast focus rings on all interactive elements
 *   - Inputs disabled during network in-flight to prevent double-submit
 *   - No "back" button — the brief mandates one-way progression
 *
 * No-show-the-score: the learner sees only their final level and a
 * brief encouraging message. Confidence, correctness counts, percentage
 * accuracy — all withheld per the brief.
 */

// ─────────────────────────────────────────────────────────────────────
// Language wiring
// ─────────────────────────────────────────────────────────────────────

/**
 * The placement bank speaks five languages: en, ar, so, fa, zh.
 * Map the wizard's wider LangCode set onto this narrower one.
 *   - Pashto (ps) has no bank content → degrade to English
 *   - Cantonese (yue) → zh (the bank uses the macrolanguage tag)
 *   - Anything outside MVP → English
 */
type BankLang = "en" | "ar" | "so" | "fa" | "zh";

const LANG_TO_BANK: Record<string, BankLang> = {
  en: "en",
  ar: "ar",
  so: "so",
  "fa-AF": "fa",
  ps: "en",
  yue: "zh",
  zh: "zh",
  // Phase 5 / Final Addendum §5 (BE-F) — Bengali + Urdu degrade to
  // English for the placement assessment. The AI tutor already
  // carries real bn + ur chrome translations (AiTutorSession.tsx)
  // but the placement-bank JSON (question_bn / question_ur /
  // option_bn / option_ur fields) doesn't exist yet, so reading
  // the bn or ur slot here would render undefined for every
  // question. Degrading to "en" matches the existing pattern used
  // for Pashto. Lifting this requires (1) adding the *_bn / *_ur
  // fields to placement-bank.json, (2) widening BankLang to
  // include them, (3) adding bn/ur entries to QUESTION_FIELD,
  // OPTION_FIELD, and the COPY table below.
  bn: "en",
  ur: "en",
};

const readSavedLang = (): LangCode => {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem("esol_lang");
  return (LANGUAGES.find((l) => l.code === raw)?.code ?? "en") as LangCode;
};

const QUESTION_FIELD: Record<BankLang, keyof PlacementQuestion> = {
  en: "question_en",
  ar: "question_ar",
  so: "question_so",
  fa: "question_fa",
  zh: "question_zh",
};

const OPTION_FIELD: Record<
  BankLang,
  "text_en" | "text_ar" | "text_so" | "text_fa" | "text_zh"
> = {
  en: "text_en",
  ar: "text_ar",
  so: "text_so",
  fa: "text_fa",
  zh: "text_zh",
};

// ─────────────────────────────────────────────────────────────────────
// Local i18n — placement-specific copy only.
// Wizard translations live in data/translations.ts; this page has its
// own table because the keys are page-local and we don't want to bloat
// the wizard dictionary.
// ─────────────────────────────────────────────────────────────────────

type CopyKey =
  | "loading"
  | "intro"
  | "progress"
  | "submitting"
  | "result_title"
  | "result_message"
  | "result_cta"
  | "error_retry"
  | "error_generic";

const COPY: Record<BankLang, Record<CopyKey, string>> = {
  en: {
    loading: "Loading your first question…",
    intro: "Answer 20 short questions so we can find the right level for you.",
    progress: "Question {current} of {total}",
    submitting: "Scoring your answers…",
    result_title: "You are at {level}",
    result_message:
      "Great work! We have placed you at {level}. We will start your lessons at this level.",
    result_cta: "Continue to your first lesson",
    error_retry: "Try again",
    error_generic:
      "Something went wrong. Please check your connection and try again.",
  },
  ar: {
    loading: "جارٍ تحميل سؤالك الأول…",
    intro: "أجب على 20 سؤالًا قصيرًا حتى نتمكن من إيجاد المستوى المناسب لك.",
    progress: "السؤال {current} من {total}",
    submitting: "جارٍ تقييم إجاباتك…",
    result_title: "أنت في {level}",
    result_message: "أحسنت! لقد وضعناك في {level}. سنبدأ دروسك من هذا المستوى.",
    result_cta: "متابعة إلى درسك الأول",
    error_retry: "حاول مرة أخرى",
    error_generic: "حدث خطأ ما. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
  },
  so: {
    loading: "Waxaa la soo dejinayaa su'aashaada koowaad…",
    intro:
      "Ka jawaab 20 su'aalood oo gaagaaban si aan u helno heerka kuu habboon.",
    progress: "Su'aasha {current} ee {total}",
    submitting: "Waxaa la qiimeynayaa jawaabahaaga…",
    result_title: "Waxaad ku jirtaa {level}",
    result_message:
      "Shaqo wanaagsan! Waxaan ku meeleynay {level}. Casharradaada waxaan ka bilaabaynaa heerkan.",
    result_cta: "U gudub casharkaaga koowaad",
    error_retry: "Mar kale isku day",
    error_generic:
      "Wax baa qaldamay. Fadlan hubi xiriirkaaga oo mar kale isku day.",
  },
  fa: {
    loading: "در حال بارگذاری سوال اول شما…",
    intro: "به ۲۰ سوال کوتاه پاسخ دهید تا سطح مناسب شما را پیدا کنیم.",
    progress: "سوال {current} از {total}",
    submitting: "در حال ارزیابی پاسخ‌های شما…",
    result_title: "شما در {level} هستید",
    result_message:
      "آفرین! ما شما را در {level} قرار داده‌ایم. درس‌های شما از این سطح شروع می‌شود.",
    result_cta: "ادامه به اولین درس",
    error_retry: "دوباره امتحان کنید",
    error_generic:
      "مشکلی پیش آمد. لطفاً اتصال خود را بررسی کرده و دوباره امتحان کنید.",
  },
  zh: {
    loading: "正在載入您的第一個問題…",
    intro: "回答 20 個簡短問題,以便我們為您找到合適的程度。",
    progress: "第 {current} 題,共 {total} 題",
    submitting: "正在評估您的答案…",
    result_title: "您的程度是 {level}",
    result_message:
      "做得好!我們已將您安排在 {level}。我們會從這個程度開始您的課程。",
    result_cta: "繼續第一節課",
    error_retry: "再試一次",
    error_generic: "出現了問題。請檢查您的網路連線並重試。",
  },
};

const t = (
  bank: BankLang,
  key: CopyKey,
  vars?: Record<string, string | number>,
): string => {
  let out = COPY[bank][key] ?? COPY.en[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replace(`{${k}}`, String(v));
    }
  }
  return out;
};

const PRETTY_LEVEL: Record<EsolLevel, string> = {
  e1: "Entry Level 1",
  e2: "Entry Level 2",
  e3: "Entry Level 3",
  l1: "Level 1",
  l2: "Level 2",
};

// ─────────────────────────────────────────────────────────────────────
// State machine
// ─────────────────────────────────────────────────────────────────────

type Stage =
  | { kind: "loading" }
  | {
      kind: "question";
      q: PlacementQuestion;
      answered: number;
      total: number;
      busy: boolean;
    }
  | { kind: "submitting" }
  | { kind: "result"; result: PlacementResult }
  | { kind: "error"; message: string; retry: "start" | null };

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

export default function PlacementAssessment() {
  const navigate = useNavigate();

  const lang = useMemo(readSavedLang, []);
  const meta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const bankLang: BankLang = LANG_TO_BANK[lang] ?? "en";

  // Mirror lang + direction on the document for screen readers + CSS.
  useEffect(() => {
    const prevLang = document.documentElement.lang;
    const prevDir = document.documentElement.dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    return () => {
      document.documentElement.lang = prevLang;
      document.documentElement.dir = prevDir;
    };
  }, [lang, meta.dir]);

  const [stage, setStage] = useState<Stage>({ kind: "loading" });
  // Collected as we go — the /submit endpoint takes all 20 as a self-check.
  const answersRef = useRef<{ question_id: string; answer: string }[]>([]);
  // For focus management — the first option button on each new question.
  const firstOptionRef = useRef<HTMLButtonElement | null>(null);

  const startMutation = useStartPlacement();
  const answerMutation = useAnswerPlacement();
  const submitMutation = useSubmitPlacement();

  // ── Bootstrap: hit /start on mount ─────────────────────────────────
  //
  // StrictMode safety: React 18 dev mounts every component twice, runs
  // each effect's cleanup in between. A simple `useRef(false)` guard
  // does NOT survive the remount — the ref is per-instance, so the
  // second mount sees `current = false` and fires a second request.
  // Meanwhile the first mount's onSuccess/onError tries to setState on
  // an unmounted instance and React silently drops it. Net result was:
  // the request returned 500, but the page stayed on "Loading…" forever
  // because the live instance never saw the error.
  //
  // Fix: use a `cancelled` closure flag with proper cleanup. The first
  // mount's onSuccess/onError checks `cancelled` and bails. The second
  // mount fires its own request with its own `cancelled = false` and
  // its callback successfully updates the live instance.
  useEffect(() => {
    let cancelled = false;

    startMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (cancelled) return;
        const data = res.data;
        if (data.done || !data.next_question) {
          // Server says the attempt is already complete — flip straight
          // to submit. The body needs the 20 answers but we don't have
          // them in client state on a fresh load; fall back to an error
          // that the user can recover from via reload.
          setStage({
            kind: "error",
            message:
              "This placement was already completed in another session. Please reload to see your result.",
            retry: null,
          });
          return;
        }
        setStage({
          kind: "question",
          q: data.next_question,
          answered: data.progress.answered,
          total: data.progress.total,
          busy: false,
        });
      },
      onError: (err: any) => {
        if (cancelled) return;
        setStage({
          kind: "error",
          message: err?.response?.data?.message || t(bankLang, "error_generic"),
          retry: "start",
        });
      },
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Focus the first option whenever a new question lands ──────────
  const activeQuestionId =
    stage.kind === "question" ? (stage as any).q.id : null;
  useEffect(() => {
    if (activeQuestionId !== null && firstOptionRef.current) {
      firstOptionRef.current.focus();
    }
  }, [activeQuestionId]);

  // ── Submit one answer ─────────────────────────────────────────────
  const handleAnswer = useCallback(
    (optionId: string) => {
      if (stage.kind !== "question" || stage.busy) return;
      const questionId = stage.q.id;
      // Mark busy so option buttons don't double-fire.
      setStage({ ...stage, busy: true });

      answerMutation.mutate(
        { question_id: questionId, answer: optionId },
        {
          onSuccess: (res) => {
            const data = res.data;
            answersRef.current.push({
              question_id: questionId,
              answer: optionId,
            });

            if (data.done || !data.next_question) {
              // All 20 collected — submit for Gemini scoring.
              setStage({ kind: "submitting" });
              submitMutation.mutate(
                { answers: answersRef.current },
                {
                  onSuccess: (sres) =>
                    setStage({ kind: "result", result: sres.data }),
                  onError: (err: any) =>
                    setStage({
                      kind: "error",
                      message:
                        err?.response?.data?.message ||
                        t(bankLang, "error_generic"),
                      retry: null,
                    }),
                },
              );
              return;
            }

            setStage({
              kind: "question",
              q: data.next_question,
              answered: data.progress.answered,
              total: data.progress.total,
              busy: false,
            });
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || t(bankLang, "error_generic"),
            );
            // Re-enable the buttons so the learner can retry their answer.
            setStage((s) =>
              s.kind === "question" ? { ...s, busy: false } : s,
            );
          },
        },
      );
    },
    [stage, answerMutation, submitMutation, bankLang],
  );

  // ── Render branches ───────────────────────────────────────────────
  if (stage.kind === "loading") {
    return <CenteredLoader label={t(bankLang, "loading")} />;
  }

  if (stage.kind === "submitting") {
    return <CenteredLoader label={t(bankLang, "submitting")} />;
  }

  if (stage.kind === "error") {
    return (
      <ErrorPanel
        message={stage.message}
        canRetry={stage.retry === "start"}
        retryLabel={t(bankLang, "error_retry")}
        onRetry={() => {
          // Hard reload remounts the page, which re-fires the bootstrap
          // useEffect with a fresh `cancelled = false` closure. Simpler
          // and more reliable than trying to manually re-run the
          // mutation in-place — react-query mutation state survives
          // unless we tear the whole tree down.
          window.location.reload();
        }}
      />
    );
  }

  if (stage.kind === "result") {
    return (
      <ResultPanel
        bankLang={bankLang}
        result={stage.result}
        onContinue={async () => {
          // After scoring, the backend has updated the User doc's
          // esolLevel — but the JWT in localStorage still holds the
          // stale value from login (the JWT carries user state, it
          // doesn't auto-resync with Mongo). Without refreshing the
          // token, /esol/home re-renders the cold-start view because
          // getDecodedJwt() still reports esolLevel: null.
          //
          // Hit /users/refresh first to get a new JWT, dispatch the
          // 'userUpdated' event so AuthContext re-reads, then
          // navigate. If refresh fails (network, expired refresh
          // token, etc.) we still navigate — better to land on /home
          // with a stale view than block the learner here.
          try {
            await refreshJwt();
            window.dispatchEvent(new Event("userUpdated"));
          } catch {
            // Silent — the stale-JWT case will self-heal on next
            // auth event or the user can refresh manually.
          }
          navigate("/esol/home");
        }}
      />
    );
  }

  // stage.kind === "question"
  return (
    <QuestionPanel
      q={stage.q}
      bankLang={bankLang}
      answered={stage.answered}
      total={stage.total}
      busy={stage.busy}
      firstOptionRef={firstOptionRef}
      onAnswer={handleAnswer}
    />
  );
}

/**
 * The actual question UI. Extracted so the axe scan can render this
 * branch in isolation without needing to drive the page through its
 * full state machine.
 */
export function QuestionPanel({
  q,
  bankLang,
  answered,
  total,
  busy,
  firstOptionRef,
  onAnswer,
}: {
  q: PlacementQuestion;
  bankLang: BankLang;
  answered: number;
  total: number;
  busy: boolean;
  firstOptionRef?: React.MutableRefObject<HTMLButtonElement | null>;
  onAnswer: (optionId: string) => void;
}) {
  const stem = q[QUESTION_FIELD[bankLang]] as string;
  const currentNumber = answered + 1;
  const optionTextField = OPTION_FIELD[bankLang];

  return (
    <div className="min-h-screen bg-[#fafbfc] py-10 px-4">
      <main className="max-w-2xl mx-auto">
        {/* Progress + announcement ───────────────────────────────── */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mb-6"
        >
          <p className="text-sm font-bold text-[#0B2343]/70">
            {t(bankLang, "progress", { current: currentNumber, total })}
          </p>
          <div
            className="mt-2 h-2 bg-[#0B2343]/[0.06] rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={currentNumber}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label={t(bankLang, "progress", {
              current: currentNumber,
              total,
            })}
          >
            <div
              className="h-full bg-[#ff7c22] transition-[width] duration-200"
              style={{ width: `${(currentNumber / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Question stem ─────────────────────────────────────────── */}
        <h1 className="text-xl md:text-2xl font-bold text-[#0B2343] mb-6 leading-relaxed">
          {stem}
        </h1>

        {/* Options ─────────────────────────────────────────────────── */}
        <ul className="space-y-3 list-none p-0">
          {q.options.map((opt, idx) => (
            <li key={opt.id}>
              <button
                ref={idx === 0 ? firstOptionRef : undefined}
                type="button"
                onClick={() => onAnswer(opt.id)}
                disabled={busy}
                className="
                  w-full text-left
                  min-h-[44px] min-w-[44px]
                  px-5 py-4
                  bg-white border-2 border-[#0B2343]/[0.12]
                  rounded-2xl
                  text-base font-medium text-[#0B2343]
                  hover:border-[#ff7c22] hover:bg-[#ff7c22]/[0.04]
                  focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40 focus:border-[#ff7c22]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
                aria-label={`${opt.id.toUpperCase()}: ${opt[optionTextField]}`}
              >
                <span className="inline-flex items-baseline gap-3">
                  <span className="text-[#ff7c22] font-bold uppercase">
                    {opt.id}
                  </span>
                  <span>{opt[optionTextField]}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────

export function CenteredLoader({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-4"
    >
      <Loader2
        size={32}
        className="text-[#ff7c22] animate-spin mb-3"
        aria-hidden="true"
      />
      <p className="text-sm font-semibold text-[#0B2343]">{label}</p>
    </div>
  );
}

export function ErrorPanel({
  message,
  canRetry,
  retryLabel,
  onRetry,
}: {
  message: string;
  canRetry: boolean;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfc] px-4"
    >
      <div className="max-w-md w-full text-center">
        <AlertCircle
          size={32}
          className="text-red-600 mx-auto mb-3"
          aria-hidden="true"
        />
        <p className="text-base font-semibold text-[#0B2343] mb-4">{message}</p>
        {canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="
              inline-flex items-center gap-2
              min-h-[44px] min-w-[44px]
              px-5 py-3
              bg-[#ff7c22] text-white text-sm font-bold rounded-xl
              hover:bg-[#e56a10]
              focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40
              transition-colors
            "
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function ResultPanel({
  bankLang,
  result,
  onContinue,
}: {
  bankLang: BankLang;
  result: PlacementResult;
  onContinue: () => void;
}) {
  const levelPretty = PRETTY_LEVEL[result.esol_level];
  const confidencePct = Math.round((result.confidence ?? 0) * 100);

  // Confidence buckets drive both the badge colour and a short label.
  // Threshold matches the backend's CONFIDENCE_CONSERVATIVE_FLOOR (0.7)
  // so the learner's UI tells the same story as the audit log:
  // anything below 70% triggered a one-level-down safety placement.
  const confidenceTone =
    confidencePct >= 70
      ? {
          label: "High",
          classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
        }
      : confidencePct >= 40
        ? {
            label: "Medium",
            classes: "bg-amber-50 text-amber-700 border-amber-200",
          }
        : {
            label: "Provisional",
            classes: "bg-rose-50 text-rose-700 border-rose-200",
          };

  // Detect the fallback-to-e1 rationale so we can show a clear notice
  // banner instead of pretending the placement was authoritative.
  // Matches the exact string in placement.service.ts so frontend stays
  // in sync — if the backend copy changes, update here.
  const isProvisionalFallback = result.rationale.startsWith(
    "Automatic scoring was unavailable",
  );

  return (
    <div className="min-h-screen bg-[#fafbfc] px-4 py-10">
      <main role="status" aria-live="polite" className="max-w-2xl mx-auto">
        {/* Hero — level callout */}
        <header className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff7c22]/10 flex items-center justify-center"
            aria-hidden="true"
          >
            <Sparkles size={28} className="text-[#ff7c22]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B2343] mb-2">
            {t(bankLang, "result_title", { level: levelPretty })}
          </h1>
          <p className="text-base text-[#0B2343]/65 leading-relaxed">
            {t(bankLang, "result_message", { level: levelPretty })}
          </p>
        </header>

        {/* Provisional-placement notice. Renders only when the backend
            fell back to e1 because automatic scoring failed. Sits at
            the top so the learner knows the level isn't final. */}
        {isProvisionalFallback && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="text-sm font-bold text-amber-800">
              Provisional placement
            </p>
            <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
              Automatic scoring couldn't complete this time, so we've placed you
              at Entry 1 for now. Your teacher will review and adjust your level
              after you've completed a few sessions.
            </p>
          </div>
        )}

        {/* Confidence + Level summary card */}
        <section className="mb-5 bg-white rounded-2xl border border-[#0B2343]/[0.08] overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-[#0B2343]/[0.06]">
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
                Assigned level
              </p>
              <p className="text-3xl font-extrabold text-[#0B2343] mt-1.5">
                {result.esol_level.toUpperCase()}
              </p>
              <p className="text-xs text-[#0B2343]/55 mt-1">{levelPretty}</p>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
                Confidence
              </p>
              <p className="text-3xl font-extrabold text-[#0B2343] mt-1.5">
                {confidencePct}%
              </p>
              <span
                className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${confidenceTone.classes}`}
              >
                {confidenceTone.label}
              </span>
            </div>
          </div>
        </section>

        {/* Rationale card — the AI's plain-English explanation. This
            was previously hidden from the learner per the original
            brief; surfaced now because transparency was the explicit
            ask. Org admins will see the same string in their reports. */}
        <section className="mb-5 bg-white rounded-2xl border border-[#0B2343]/[0.08] p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-2">
            Why this level
          </p>
          <p className="text-sm text-[#0B2343]/80 leading-relaxed">
            {result.rationale}
          </p>
        </section>

        {/* Stage 3 objectives — the learning goals the system has
            pre-set from the placement result. Helps the learner see
            what they'll be working on. */}
        {result.stage3_objectives && result.stage3_objectives.length > 0 && (
          <section className="mb-6 bg-white rounded-2xl border border-[#0B2343]/[0.08] p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-3">
              Your learning goals
            </p>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {result.stage3_objectives.map((obj) => (
                <li key={obj.id} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 w-5 h-5 rounded-full bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center shrink-0 text-[10px] font-bold uppercase"
                  >
                    {obj.skill_domain.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-[#0B2343] leading-relaxed">
                      {obj.description}
                    </p>
                    {obj.target_level && (
                      <p className="text-[11px] text-[#0B2343]/45 mt-0.5">
                        Target level: {obj.target_level.toUpperCase()} ·{" "}
                        {obj.skill_domain}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <button
          type="button"
          onClick={onContinue}
          className="
            inline-flex items-center justify-center
            w-full min-h-[48px]
            px-5 py-3
            bg-[#ff7c22] text-white text-base font-bold rounded-xl
            hover:bg-[#e56a10]
            focus:outline-none focus:ring-2 focus:ring-[#ff7c22]/40
            transition-colors
          "
        >
          {t(bankLang, "result_cta")}
        </button>
      </main>
    </div>
  );
}
