/**
 * Stage 5 Pending tab — Function 17 + F7 follow-up.
 *
 * Pre-wired; backend list endpoint not yet shipped — gates with
 * `enabled: false`. Confirm flow works via direct URL.
 */

import { Link as RouterLink } from "react-router-dom";
import { useOrgAdminPendingStage5 } from "../../../api/stage5Api";

export default function Stage5PendingTab() {
  const { data, isLoading } = useOrgAdminPendingStage5({ enabled: false });
  const reviews = data?.data?.reviews ?? [];

  return (
    <div>
      <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343] mb-3">
        Stage 5 reviews pending
      </h2>

      <div
        role="status"
        className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 leading-relaxed mb-3"
      >
        <strong className="font-bold">
          Discovery surface pending backend endpoint.
        </strong>{" "}
        The confirm flow itself is live — when you have a review id, navigate to{" "}
        <code className="text-xs font-mono bg-white px-1 rounded">
          /org-admin/stage5/:reviewId
        </code>{" "}
        directly and the confirm page will work. A "list pending reviews for my
        org" endpoint is the only thing keeping this tab from rendering a real
        table.
      </div>

      {isLoading && (
        <div className="space-y-2">
          <div className="h-14 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="h-14 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
          <div className="h-14 rounded-xl bg-[#0B2343]/[0.06] animate-pulse" />
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <p className="text-sm text-[#0B2343]/55">
          No pending Stage 5 reviews — every level completion in your cohort has
          either been confirmed or hasn't reached the review stage yet.
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
                  <strong className="font-bold">{r.learner_name}</strong> —
                  completed {r.level_completed}
                  {!r.learner_self_assessment_submitted && (
                    <> · waiting on learner reflection</>
                  )}
                  {r.learner_self_assessment_submitted &&
                    !r.ai_summary_ready && <> · waiting on AI summary</>}
                  {ready && <> · ready for your confirmation</>}
                </p>
                <RouterLink
                  to={`/org-admin/stage5/${r._id}`}
                  className={`text-xs font-bold whitespace-nowrap hover:opacity-80 ${
                    ready ? "text-sky-700" : "text-amber-800"
                  }`}
                >
                  Review →
                </RouterLink>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
