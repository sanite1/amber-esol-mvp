/**
 * Stage 5 in-app notification card — brief Function 17.
 *
 * Renders on the learner's home page whenever they have an open
 * Stage 5 review they haven't yet submitted.
 *
 * Accessibility
 *   - role="region" with aria-label.
 *   - The CTA button names the level (not "click here").
 *   - Colour is supplementary; submit-pending state has icon + heading.
 */

import { Link as RouterLink } from "react-router-dom";
import { Sparkles, Hourglass } from "lucide-react";

import { usePendingStage5 } from "../api/stage5Api";
import { levelLabel } from "../lib/stage5/translations";

export default function Stage5NotificationCard() {
  const { data, isLoading, isError } = usePendingStage5();

  if (isLoading || isError) return null;
  const reviews = data?.data?.reviews ?? [];
  if (reviews.length === 0) return null;

  return (
    <section aria-label="Stage 5 reviews" className="space-y-3">
      {reviews.map((r) => {
        if (!r.learner_self_assessment_submitted) {
          return (
            <div
              key={r._id}
              className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 border-l-4 border-l-emerald-600 p-4 sm:p-5"
            >
              <Sparkles
                size={20}
                aria-hidden="true"
                className="shrink-0 mt-1 text-emerald-700"
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-1 min-w-0">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-extrabold text-emerald-900">
                    You completed {levelLabel(r.level_completed)}!
                  </h2>
                  <p className="text-sm text-emerald-900/80 mt-0.5 leading-relaxed">
                    Please take 5 minutes to reflect on your progress before
                    starting the next level.
                  </p>
                </div>
                <RouterLink
                  to={`/esol/stage5/${r._id}`}
                  aria-label={`Start your Stage 5 reflection for ${levelLabel(r.level_completed)}`}
                  className="shrink-0 inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 transition-colors whitespace-nowrap"
                >
                  Start review
                </RouterLink>
              </div>
            </div>
          );
        }

        return (
          <div
            key={r._id}
            className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 border-l-4 border-l-sky-600 p-4 sm:p-5"
          >
            <Hourglass
              size={20}
              aria-hidden="true"
              className="shrink-0 mt-1 text-sky-700"
            />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-sky-900">
                Thanks for your Stage 5 reflection on{" "}
                {levelLabel(r.level_completed)}.
              </h2>
              <p className="text-sm text-sky-900/80 mt-0.5 leading-relaxed">
                We'll let you know when your tutor confirms your progress.
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
