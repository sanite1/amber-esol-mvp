/**
 * Stage 5 Reviews tab — Function 17 + F7 follow-up.
 *
 * Per-learner Stage 5 history view. Backend list endpoint pending —
 * confirm flow works via direct URL.
 */

import { Link as RouterLink } from "react-router-dom";
import { useStage5ReviewsForLearner } from "../../../../api/stage5Api";

interface Props {
  learnerId: string;
}

export default function Stage5ReviewsTab({ learnerId }: Props) {
  const { data, isLoading } = useStage5ReviewsForLearner(learnerId, {
    enabled: false,
  });
  const reviews = data?.data?.reviews ?? [];

  return (
    <div className="space-y-3">
      <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
        Stage 5 reviews
      </h2>

      <div
        role="status"
        className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 leading-relaxed"
      >
        <strong className="font-bold">
          Per-learner list endpoint pending.
        </strong>{" "}
        The confirm flow itself is live — a Stage 5 review with a known id is
        reachable at{" "}
        <code className="text-xs font-mono bg-white px-1 rounded">
          /org-admin/stage5/:reviewId
        </code>
        . This tab will show the learner's review history once the backend adds
        a list endpoint.
      </div>

      {isLoading && (
        <div className="space-y-2">
          <div className="h-14 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="h-14 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <p className="text-sm text-[#0B2343]/55">
          No Stage 5 reviews yet for this learner.
        </p>
      )}

      {!isLoading && reviews.length > 0 && (
        <div className="space-y-2">
          {reviews.map((r) => {
            const ready =
              r.learner_self_assessment_submitted && r.ai_summary_ready;
            return (
              <div
                key={r._id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border p-3 ${
                  ready
                    ? "border-sky-200 bg-sky-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p
                  className={`text-sm ${ready ? "text-sky-900" : "text-amber-900"}`}
                >
                  <strong className="font-bold">{r.level_completed}</strong>
                  {!r.learner_self_assessment_submitted && (
                    <> · waiting on learner reflection</>
                  )}
                  {r.learner_self_assessment_submitted &&
                    !r.ai_summary_ready && <> · waiting on AI summary</>}
                  {ready && <> · ready for confirmation</>}
                </p>
                <RouterLink
                  to={`/org-admin/stage5/${r._id}`}
                  className={`text-xs font-bold whitespace-nowrap hover:opacity-80 ${
                    ready ? "text-sky-700" : "text-amber-800"
                  }`}
                >
                  Open →
                </RouterLink>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
