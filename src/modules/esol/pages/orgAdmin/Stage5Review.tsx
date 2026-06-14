/**
 * Stage 5 org-admin review + confirmation page — brief Function 17.
 *
 * Route: /org-admin/stage5/:reviewId
 *
 * Layout
 * ======
 *
 *   Header — learner name, ULN, level completed, status chip.
 *
 *   Two-column "side by side" body (stacks on mobile):
 *     - Left:  Learner's self-assessment (confidence chip, per-objective
 *              ratings, next-steps preference)
 *     - Right: AI tutor summary (narrative paragraph, key achievements
 *              bullets, readiness-for-next-level chip)
 *
 *   Action block:
 *     - Next-steps free-text input (required).
 *     - Optional "advance to level" override dropdown.
 *     - Confirm button.
 *
 *   When the review is already confirmed, the action block is replaced
 *   with a read-only summary noting confirmed_at + confirmed_by +
 *   next_steps. The review is locked into the evidence pack.
 *
 * Accessibility (WCAG 2.1 AA)
 * ===========================
 *
 *   - The side-by-side columns reflow to a stacked layout on
 *     narrow viewports.
 *   - All chips carry text + colour (never colour alone).
 *   - Form labels are real `<label>`s.
 *   - Confirm button is disabled while the next-steps field is empty;
 *     the disabled reason is announced via aria-describedby.
 */

import { useMemo, useState } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  UserCircle2,
  Lock,
  Loader2,
} from "lucide-react";

import {
  useOrgAdminStage5Review,
  useConfirmStage5Review,
} from "../../api/stage5Api";
import { levelLabel } from "../../lib/stage5/translations";
import type {
  ConfidenceRating,
  ObjectiveRating,
  NextStepsPreference,
  EsolLevel,
} from "../../lib/stage5/types";

// ─── Display strings (org-admin side is English only) ───

const CONFIDENCE_LABEL: Record<ConfidenceRating, string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};
const CONFIDENCE_CHIP: Record<ConfidenceRating, string> = {
  low: "bg-amber-50 text-amber-800 border-amber-200",
  medium: "bg-sky-50 text-sky-800 border-sky-200",
  high: "bg-emerald-50 text-emerald-800 border-emerald-200",
};
const CONFIDENCE_EMOJI: Record<ConfidenceRating, string> = {
  low: "😟",
  medium: "😐",
  high: "😊",
};

const OBJECTIVE_LABEL: Record<ObjectiveRating, string> = {
  struggling: "Struggling",
  progressing: "Progressing",
  confident: "Confident",
};
const OBJECTIVE_CHIP: Record<ObjectiveRating, string> = {
  struggling: "bg-amber-50 text-amber-800 border-amber-200",
  progressing: "bg-sky-50 text-sky-800 border-sky-200",
  confident: "bg-emerald-50 text-emerald-800 border-emerald-200",
};
const OBJECTIVE_EMOJI: Record<ObjectiveRating, string> = {
  struggling: "😟",
  progressing: "🙂",
  confident: "💪",
};

const NEXT_STEPS_LABEL: Record<NextStepsPreference, string> = {
  more_practice: "More practice at this level",
  advance_level: "Move up to the next level",
  specific_focus: "Focus on a specific skill",
  unsure: "Not sure yet",
};

const READINESS_CHIP: Record<"low" | "medium" | "high", string> = {
  low: "bg-amber-50 text-amber-800 border-amber-200",
  medium: "bg-sky-50 text-sky-800 border-sky-200",
  high: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

const ALL_LEVELS: ReadonlyArray<EsolLevel> = ["e1", "e2", "e3", "l1", "l2"];

export default function Stage5Review() {
  const { reviewId } = useParams<{ reviewId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useOrgAdminStage5Review(reviewId);
  const confirm = useConfirmStage5Review(reviewId);

  const review = data?.data;

  const [nextSteps, setNextSteps] = useState("");
  const [advanceToLevel, setAdvanceToLevel] = useState<EsolLevel | "">("");

  const learnerSelf = review?.learner_self_assessment;
  const aiSummary = review?.ai_tutor_summary;
  const objectives = review?.stage3_objectives ?? [];

  const learnerDisplayName = useMemo(() => {
    const first = review?.learner_firstname?.trim() ?? "";
    const last = review?.learner_lastname?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || "Learner";
  }, [review]);

  const alreadyConfirmed = Boolean(review?.org_admin_confirmed_at);
  const learnerSubmitted = learnerSelf !== null && learnerSelf !== undefined;
  const aiReady = aiSummary !== null && aiSummary !== undefined;
  const canConfirm =
    !alreadyConfirmed &&
    learnerSubmitted &&
    aiReady &&
    nextSteps.trim().length > 0 &&
    !confirm.isPending;

  const disabledReason = (() => {
    if (alreadyConfirmed) return "";
    if (!learnerSubmitted)
      return "Waiting on learner to submit their self-assessment.";
    if (!aiReady) return "Waiting on AI tutor summary to generate.";
    if (nextSteps.trim().length === 0)
      return "Write the agreed next steps to enable confirm.";
    return "";
  })();

  const handleConfirm = async () => {
    if (!canConfirm) return;
    await confirm.mutateAsync({
      next_steps: nextSteps.trim(),
      ...(advanceToLevel ? { advance_to_level: advanceToLevel } : {}),
    });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <main className="space-y-4">
        <div className="h-9 w-32 rounded-md bg-[#0B2343]/[0.06] animate-pulse" />
        <div className="h-32 rounded-2xl bg-[#0B2343]/[0.06] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-96 rounded-2xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="h-96 rounded-2xl bg-[#0B2343]/[0.06] animate-pulse" />
        </div>
      </main>
    );
  }

  // ── Error ──
  if (isError || !review) {
    return (
      <main className="space-y-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1.5"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back
        </button>
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error?.message ?? "Could not load the Stage 5 review."}
        </div>
      </main>
    );
  }

  return (
    <main
      aria-labelledby="stage5-review-heading"
      className="space-y-4 sm:space-y-5"
    >
      {/* ── Back link ── */}
      <RouterLink
        to={`/org-admin/learners/${review.learner_id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2343]/70 hover:text-[#ff7c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 rounded-md px-2 py-1.5"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to learner
      </RouterLink>

      {/* ── Header card ── */}
      <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6">
          <div className="min-w-0">
            <h1
              id="stage5-review-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0B2343] leading-tight"
            >
              Stage 5 review — {levelLabel(review.level_completed)}
            </h1>
            <p className="text-sm text-[#0B2343]/65 mt-2">
              {learnerDisplayName}
              {review.learner_uln ? ` · ULN ${review.learner_uln}` : ""}
            </p>
          </div>
          {alreadyConfirmed ? (
            <span
              aria-label="This review has been confirmed and is locked into the evidence pack"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-200 whitespace-nowrap"
            >
              <Lock size={13} aria-hidden="true" />
              Confirmed — locked into evidence pack
            </span>
          ) : (
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${
                learnerSubmitted && aiReady
                  ? "bg-sky-50 text-sky-800 border-sky-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {!learnerSubmitted
                ? "Awaiting learner"
                : !aiReady
                  ? "Awaiting AI summary"
                  : "Ready for your confirmation"}
            </span>
          )}
        </div>
      </section>

      {/* ── Side-by-side body ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Left: learner self-assessment */}
        <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span
              aria-hidden="true"
              className="w-9 h-9 rounded-xl bg-[#0B2343]/[0.06] text-[#0B2343]/70 flex items-center justify-center"
            >
              <UserCircle2 size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
              Learner's self-assessment
            </h2>
          </div>

          {!learnerSubmitted ? (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
              The learner has not yet submitted their self-assessment.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Confidence */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1.5">
                  Overall confidence
                </p>
                <span
                  aria-label={`Learner reported ${CONFIDENCE_LABEL[learnerSelf!.confidence_rating]}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border ${CONFIDENCE_CHIP[learnerSelf!.confidence_rating]}`}
                >
                  <span aria-hidden="true">
                    {CONFIDENCE_EMOJI[learnerSelf!.confidence_rating]}
                  </span>
                  {CONFIDENCE_LABEL[learnerSelf!.confidence_rating]}
                </span>
              </div>

              <div className="h-px bg-[#0B2343]/[0.06]" />

              {/* Per-objective ratings */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-2">
                  Per-objective ratings
                </p>
                {objectives.length === 0 ? (
                  <p className="text-sm text-[#0B2343]/55">
                    No Stage 3 objectives were captured for this level.
                  </p>
                ) : (
                  <ul className="space-y-2 m-0 p-0 list-none">
                    {objectives.map((o) => {
                      const rating =
                        learnerSelf!.objective_ratings[o.id] ?? null;
                      return (
                        <li
                          key={o.id}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                        >
                          <p className="text-sm text-[#0B2343]/85 flex-1 leading-snug">
                            {o.description}
                          </p>
                          {rating ? (
                            <span
                              aria-label={`Learner rated this objective: ${OBJECTIVE_LABEL[rating]}`}
                              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${OBJECTIVE_CHIP[rating]}`}
                            >
                              <span aria-hidden="true">
                                {OBJECTIVE_EMOJI[rating]}
                              </span>
                              {OBJECTIVE_LABEL[rating]}
                            </span>
                          ) : (
                            <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border border-[#0B2343]/[0.12] text-[#0B2343]/55 bg-white whitespace-nowrap">
                              No rating
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="h-px bg-[#0B2343]/[0.06]" />

              {/* Next steps preference */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1">
                  Learner's next-steps preference
                </p>
                <p className="text-sm font-bold text-[#0B2343]">
                  {NEXT_STEPS_LABEL[learnerSelf!.next_steps_preference]}
                </p>
              </div>

              <p className="text-[11px] text-[#0B2343]/55">
                Submitted{" "}
                {new Date(learnerSelf!.submitted_at).toLocaleString("en-GB")}
              </p>
            </div>
          )}
        </section>

        {/* Right: AI tutor summary */}
        <section
          className={`rounded-2xl border p-5 sm:p-6 ${
            aiReady
              ? "bg-white border-[#ff7c22]/30"
              : "bg-white border-[#0B2343]/[0.06]"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              aria-hidden="true"
              className="w-9 h-9 rounded-xl bg-[#ff7c22]/12 text-[#ff7c22] flex items-center justify-center"
            >
              <Sparkles size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
              AI tutor summary
            </h2>
          </div>

          {!aiReady ? (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
              The AI tutor summary has not been generated yet. This usually
              takes 10–30 seconds after the learner submits their reflection.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1.5">
                  Readiness for next level
                </p>
                <span
                  aria-label={`AI assessed readiness for next level: ${aiSummary!.readiness_for_next_level}`}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${READINESS_CHIP[aiSummary!.readiness_for_next_level]}`}
                >
                  {aiSummary!.readiness_for_next_level.charAt(0).toUpperCase()}
                  {aiSummary!.readiness_for_next_level.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1.5">
                  Summary
                </p>
                <p
                  className="text-sm text-[#0B2343]/85 whitespace-pre-wrap"
                  style={{ lineHeight: 1.6 }}
                >
                  {aiSummary!.summary}
                </p>
              </div>

              {aiSummary!.key_achievements.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45 mb-1.5">
                    Key achievements
                  </p>
                  <ul className="list-disc pl-5 space-y-1 m-0">
                    {aiSummary!.key_achievements.map((a, i) => (
                      <li key={i} className="text-sm text-[#0B2343]/85">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[11px] text-[#0B2343]/55">
                Generated{" "}
                {new Date(aiSummary!.generated_at).toLocaleString("en-GB")}
                {" · "}Tokens in/out: {aiSummary!.input_tokens}/
                {aiSummary!.output_tokens}
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ── Action block: confirm or locked summary ── */}
      {alreadyConfirmed ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2
              size={20}
              aria-hidden="true"
              className="text-emerald-600"
            />
            <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
              Confirmed — locked into evidence pack
            </h2>
          </div>
          <p className="text-sm text-[#0B2343]/65 mb-3">
            Confirmed{" "}
            {review.org_admin_confirmed_at
              ? new Date(review.org_admin_confirmed_at).toLocaleString("en-GB")
              : "—"}
            .
          </p>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/45">
              Agreed next steps
            </p>
            <p className="text-sm text-[#0B2343] mt-1 whitespace-pre-wrap">
              {review.next_steps ?? "(no notes recorded)"}
            </p>
          </div>
          {review.org_admin_advance_to_level && (
            <p className="text-sm text-[#0B2343]/85 mt-3">
              <strong className="font-bold text-[#0B2343]">
                Recorded override:
              </strong>{" "}
              {levelLabel(review.org_admin_advance_to_level)}
            </p>
          )}
        </section>
      ) : (
        <section className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343] mb-4">
            Confirm Stage 5 review
          </h2>

          {/* Next steps textarea */}
          <label className="block mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Agreed next steps *
            </span>
            <textarea
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="Describe the plan agreed with the learner — e.g. consolidate at this level for two weeks, then attempt Entry Level 3 placement."
              maxLength={2000}
              rows={4}
              disabled={confirm.isPending}
              aria-label="Agreed next steps for this learner"
              aria-describedby="next-steps-counter"
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22] disabled:opacity-60 resize-y"
            />
            <p
              id="next-steps-counter"
              className="text-[11px] text-[#0B2343]/45 mt-1 text-right tabular-nums"
              aria-live="polite"
            >
              {nextSteps.length} / 2000
            </p>
          </label>

          {/* Advance-to-level override */}
          <label className="block mb-2 max-w-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55">
              Optional override (advance to level)
            </span>
            <select
              value={advanceToLevel}
              onChange={(e) =>
                setAdvanceToLevel(e.target.value as EsolLevel | "")
              }
              disabled={confirm.isPending}
              className="mt-1 block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22] disabled:opacity-60"
            >
              <option value="">(no override)</option>
              {ALL_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {levelLabel(l)}
                </option>
              ))}
            </select>
          </label>
          <p className="text-[11px] text-[#0B2343]/55 mb-4 leading-relaxed">
            The level change has already happened. This field records your final
            decision for the audit log — it doesn't create a new level change.
          </p>

          {confirm.isError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 mb-4"
            >
              {confirm.error?.message ?? "Could not confirm. Try again."}
            </div>
          )}

          {/* Confirm button + disabled reason */}
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              aria-describedby={
                !canConfirm ? "confirm-disabled-reason" : undefined
              }
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
            >
              {confirm.isPending ? (
                <Loader2
                  size={14}
                  aria-hidden="true"
                  className="animate-spin"
                />
              ) : (
                <CheckCircle2 size={14} aria-hidden="true" />
              )}
              {confirm.isPending ? "Confirming…" : "Confirm and lock"}
            </button>
            {!canConfirm && disabledReason && (
              <p
                id="confirm-disabled-reason"
                className="text-[11px] text-[#0B2343]/55 text-right"
              >
                {disabledReason}
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
