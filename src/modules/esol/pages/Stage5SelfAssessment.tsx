/**
 * Stage 5 learner self-assessment page — brief Function 17.
 *
 * Route: /esol/stage5/:reviewId
 *
 * Three sections:
 *   1. Encouraging banner in the learner's L1 ("Well done — you
 *      completed Entry Level 2!").
 *   2. Confidence rating (3 emoji buttons).
 *   3. Per-Stage-3-objective rating (3 emoji buttons each).
 *   4. Next-steps preference (4 buttons).
 *
 * Submit produces a one-shot POST and swaps the page into a thank-
 * you state — the page DOES NOT redirect, so a learner who refreshes
 * lands back on the same screen and sees confirmation.
 *
 * Phase 8.1 visual refresh
 * ========================
 *
 * Re-skinned from MUI Card/Stack/Typography → Tailwind to match the
 * Amber design language used by EsolLearnerHome, Profile's
 * ComplianceTimelineSection, and the Phase 6 teacher dashboard.
 * Layout: rounded-2xl white surfaces, #0B2343 ink, #ff7c22 accent.
 * RTL handling preserved via the `dir` attribute on the outer
 * <main>. EmojiRatingGroup is untouched — only its surrounding
 * chrome changed.
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - Each rating group is a `radiogroup` with an `aria-labelledby`
 *     pointing at the section heading. Buttons inside are `role="radio"`
 *     with `aria-checked`.
 *   - Emoji are wrapped in `aria-hidden` spans; the screen reader
 *     announces the L1 label via `aria-label`.
 *   - The page direction flips to RTL for Arabic / Dari L1s.
 *   - Each section heading is a real `<h2>` so AT users can navigate
 *     by heading.
 *   - The submit button is disabled until every required field is
 *     answered; the disabled reason is announced via `aria-describedby`.
 *   - On submit success, the thank-you region is `aria-live="polite"`
 *     so it's announced without yanking focus.
 */

import { useEffect, useMemo, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import {
  useLearnerStage5Review,
  useSubmitStage5SelfAssessment,
} from "../api/stage5Api";
import EmojiRatingGroup, {
  type EmojiRatingOption,
} from "../components/EmojiRatingGroup";
import { resolveL1, isRtl, t, levelLabel } from "../lib/stage5/translations";
import type {
  ConfidenceRating,
  ObjectiveRating,
  NextStepsPreference,
  Stage3ObjectiveSnapshot,
} from "../lib/stage5/types";

// ─────────────────────────────────────────────────────────────────────
// Options builders — each option carries the value, emoji, and the
// L1/English labels resolved against the chosen language.
// ─────────────────────────────────────────────────────────────────────

const confidenceOptions = (
  l1: ReturnType<typeof resolveL1>,
): ReadonlyArray<EmojiRatingOption<ConfidenceRating>> => {
  const s = t(l1);
  const en = t("english");
  return [
    {
      value: "low",
      emoji: "😟",
      labelL1: s.confidence_low,
      labelEn: en.confidence_low,
    },
    {
      value: "medium",
      emoji: "😐",
      labelL1: s.confidence_medium,
      labelEn: en.confidence_medium,
    },
    {
      value: "high",
      emoji: "😊",
      labelL1: s.confidence_high,
      labelEn: en.confidence_high,
    },
  ];
};

const objectiveOptions = (
  l1: ReturnType<typeof resolveL1>,
): ReadonlyArray<EmojiRatingOption<ObjectiveRating>> => {
  const s = t(l1);
  const en = t("english");
  return [
    {
      value: "struggling",
      emoji: "😟",
      labelL1: s.objective_struggling,
      labelEn: en.objective_struggling,
    },
    {
      value: "progressing",
      emoji: "🙂",
      labelL1: s.objective_progressing,
      labelEn: en.objective_progressing,
    },
    {
      value: "confident",
      emoji: "💪",
      labelL1: s.objective_confident,
      labelEn: en.objective_confident,
    },
  ];
};

const nextStepsOptions = (
  l1: ReturnType<typeof resolveL1>,
): ReadonlyArray<EmojiRatingOption<NextStepsPreference>> => {
  const s = t(l1);
  const en = t("english");
  return [
    {
      value: "more_practice",
      emoji: "⏳",
      labelL1: s.next_steps_more_practice,
      labelEn: en.next_steps_more_practice,
    },
    {
      value: "advance_level",
      emoji: "🎯",
      labelL1: s.next_steps_advance_level,
      labelEn: en.next_steps_advance_level,
    },
    {
      value: "specific_focus",
      emoji: "🔍",
      labelL1: s.next_steps_specific_focus,
      labelEn: en.next_steps_specific_focus,
    },
    {
      value: "unsure",
      emoji: "🤔",
      labelL1: s.next_steps_unsure,
      labelEn: en.next_steps_unsure,
    },
  ];
};

// ─────────────────────────────────────────────────────────────────────
// Thank-you screen
// ─────────────────────────────────────────────────────────────────────

function ThankYou({ l1 }: { l1: ReturnType<typeof resolveL1> }) {
  const s = t(l1);
  return (
    <section
      role="status"
      aria-live="polite"
      className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-6 sm:p-10 lg:p-12 text-center"
    >
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-4"
      >
        <CheckCircle2 size={28} className="sm:hidden" />
        <CheckCircle2 size={32} className="hidden sm:block" />
      </span>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] mb-2">
        {s.thank_you_title}
      </h1>
      <p className="text-sm sm:text-base text-[#0B2343]/60 mb-6 leading-relaxed">
        {s.thank_you_message}
      </p>
      <RouterLink
        to="/esol/home"
        className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fff8ee] hover:border-[#ff7c22]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
      >
        Back to home
      </RouterLink>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Skeleton (loading)
// ─────────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <main aria-busy="true" className="space-y-3 max-w-3xl mx-auto">
      {[120, 200, 280, 160].map((h, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#0B2343]/[0.04] animate-pulse"
          style={{ height: h }}
        />
      ))}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────

export default function Stage5SelfAssessment() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useLearnerStage5Review(reviewId);
  const submit = useSubmitStage5SelfAssessment(reviewId);

  const payload = data?.data;
  const l1 = resolveL1(payload?.learner_l1_language ?? null);
  const rtl = isRtl(l1);
  const strings = t(l1);

  // ── Form state ─────────────────────────────────────────────────
  const [confidence, setConfidence] = useState<ConfidenceRating | null>(null);
  const [objectiveRatings, setObjectiveRatings] = useState<
    Record<string, ObjectiveRating>
  >({});
  const [nextSteps, setNextSteps] = useState<NextStepsPreference | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // If the review was already submitted before the user opened the
  // page (e.g. they hit refresh after submitting), jump straight to
  // the thank-you screen rather than letting them re-submit.
  useEffect(() => {
    if (payload?.learner_self_assessment) setSubmitted(true);
  }, [payload?.learner_self_assessment]);

  const objectives: Stage3ObjectiveSnapshot[] = useMemo(
    () => payload?.stage3_objectives ?? [],
    [payload],
  );

  const allObjectivesAnswered = useMemo(
    () => objectives.every((o) => Boolean(objectiveRatings[o.id])),
    [objectives, objectiveRatings],
  );
  const canSubmit =
    confidence !== null &&
    nextSteps !== null &&
    allObjectivesAnswered &&
    !submit.isPending;

  // ── Disabled-reason copy for the aria-describedby on Submit ────
  const disabledReason = (() => {
    if (confidence === null)
      return "Choose a confidence rating to enable submit.";
    if (!allObjectivesAnswered)
      return "Answer every objective to enable submit.";
    if (nextSteps === null)
      return "Choose a next-steps preference to enable submit.";
    return "";
  })();

  const handleSubmit = async () => {
    if (!canSubmit || !confidence || !nextSteps) return;
    await submit.mutateAsync({
      confidence_rating: confidence,
      objective_ratings: objectiveRatings,
      next_steps_preference: nextSteps,
    });
    setSubmitted(true);
  };

  // ── Render branches ───────────────────────────────────────────
  if (isLoading) return <PageSkeleton />;

  if (isError || !payload) {
    return (
      <main className="max-w-3xl mx-auto space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1.5"
        >
          <ArrowLeft size={12} aria-hidden="true" />
          Back
        </button>
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
        >
          <AlertCircle
            size={16}
            className="text-red-600 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm text-red-700">
            {error?.message ?? "Could not load the Stage 5 review."}
          </p>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="max-w-3xl mx-auto">
        <ThankYou l1={l1} />
      </main>
    );
  }

  // ── Active form ───────────────────────────────────────────────
  return (
    <main
      dir={rtl ? "rtl" : "ltr"}
      lang={l1 === "english" ? "en" : undefined}
      className="max-w-3xl mx-auto space-y-4"
      aria-labelledby="stage5-page-heading"
    >
      {/* ── Encouraging banner — celebrating completion ───────── */}
      <section
        role="banner"
        className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 sm:p-6 text-center"
      >
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-emerald-600 mb-3"
        >
          <Sparkles size={18} />
        </span>
        <p className="text-base sm:text-lg font-extrabold text-emerald-800 leading-snug">
          {strings.banner.replace("%s", levelLabel(payload.level_completed))}
        </p>
      </section>

      {/* ── Page heading + intro ──────────────────────────────── */}
      <header className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 lg:p-6">
        <h1
          id="stage5-page-heading"
          className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight"
        >
          {strings.page_title}
        </h1>
        <p className="text-sm sm:text-base text-[#0B2343]/60 mt-2 leading-relaxed">
          {strings.intro}
        </p>
      </header>

      {/* ── Section 1 — Confidence rating ─────────────────────── */}
      <section
        aria-labelledby="confidence-heading"
        className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 lg:p-6"
      >
        <h2
          id="confidence-heading"
          className="text-base sm:text-lg font-extrabold text-[#0B2343] mb-4"
        >
          {strings.confidence_heading}
        </h2>
        <EmojiRatingGroup
          labelId="confidence-heading"
          options={confidenceOptions(l1)}
          value={confidence}
          onChange={setConfidence}
          rtl={rtl}
          disabled={submit.isPending}
        />
      </section>

      {/* ── Section 2 — Per-objective ratings ─────────────────── */}
      <section
        aria-labelledby="objectives-heading"
        className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 lg:p-6"
      >
        <h2
          id="objectives-heading"
          className="text-base sm:text-lg font-extrabold text-[#0B2343] mb-4"
        >
          {strings.objectives_heading}
        </h2>
        {objectives.length === 0 ? (
          <div
            role="status"
            className="rounded-xl border border-dashed border-[#0B2343]/12 p-4 text-center"
          >
            <p className="text-xs text-[#0B2343]/55">
              No Stage 3 objectives were captured for this level — skip ahead to
              the next-steps section.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {objectives.map((obj, idx) => {
              const headingId = `objective-${obj.id}-heading`;
              return (
                <div
                  key={obj.id}
                  className="border-l-4 border-[#ff7c22]/30 pl-4 py-1"
                >
                  <h3
                    id={headingId}
                    className="text-sm sm:text-base font-bold text-[#0B2343] mb-3"
                  >
                    {idx + 1}. {obj.description}
                    {obj.skill_domain && (
                      <span className="text-xs font-semibold text-[#0B2343]/45 ml-2">
                        ({obj.skill_domain})
                      </span>
                    )}
                  </h3>
                  <EmojiRatingGroup
                    labelId={headingId}
                    options={objectiveOptions(l1)}
                    value={objectiveRatings[obj.id] ?? null}
                    onChange={(v) =>
                      setObjectiveRatings((prev) => ({
                        ...prev,
                        [obj.id]: v,
                      }))
                    }
                    rtl={rtl}
                    disabled={submit.isPending}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Section 3 — Next-steps preference ─────────────────── */}
      <section
        aria-labelledby="next-steps-heading"
        className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4 sm:p-5 lg:p-6"
      >
        <h2
          id="next-steps-heading"
          className="text-base sm:text-lg font-extrabold text-[#0B2343] mb-4"
        >
          {strings.next_steps_heading}
        </h2>
        <EmojiRatingGroup
          labelId="next-steps-heading"
          options={nextStepsOptions(l1)}
          value={nextSteps}
          onChange={setNextSteps}
          rtl={rtl}
          disabled={submit.isPending}
        />
      </section>

      {/* ── Submission error surface ──────────────────────────── */}
      {submit.isError && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3"
        >
          <AlertCircle
            size={16}
            className="text-red-600 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-sm text-red-700">
            {submit.error?.message ?? "Could not submit. Try again."}
          </p>
        </div>
      )}

      {/* ── Submit ────────────────────────────────────────────── */}
      <div className="flex flex-col items-end gap-2 pt-2 pb-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label={strings.submit_aria}
          aria-describedby={!canSubmit ? "submit-disabled-reason" : undefined}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] min-w-[220px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submit.isPending && (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          )}
          {submit.isPending ? "Submitting…" : strings.submit_button}
        </button>
        {!canSubmit && disabledReason && (
          <p
            id="submit-disabled-reason"
            className="text-[11px] text-[#0B2343]/55 text-right max-w-md"
          >
            {disabledReason}
          </p>
        )}
      </div>
    </main>
  );
}
