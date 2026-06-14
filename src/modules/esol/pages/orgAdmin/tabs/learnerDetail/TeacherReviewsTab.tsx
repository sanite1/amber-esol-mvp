/**
 * Teacher Reviews tab — chronological list of TeacherReview records.
 */

import type { LearnerDetail } from "../../../../lib/types/orgAdmin";

const REVIEW_TYPE_LABEL: Record<string, string> = {
  async_review: "Async review",
  contact_session: "Contact session",
  pathway_adjustment: "Pathway adjustment",
  rarpa_signoff: "RARPA sign-off",
};

const REVIEW_TYPE_TONE: Record<string, string> = {
  async_review: "bg-sky-50 text-sky-800 border-sky-200",
  contact_session: "bg-[#ff7c22]/12 text-[#ff7c22] border-[#ff7c22]/20",
  pathway_adjustment: "bg-amber-50 text-amber-800 border-amber-200",
  rarpa_signoff: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

interface Props {
  detail: LearnerDetail;
}

export default function TeacherReviewsTab({ detail }: Props) {
  const reviews = detail.teacher_reviews;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-[#0B2343]">
          Teacher reviews
        </h2>
        <p className="text-[11px] text-[#0B2343]/55 tabular-nums">
          {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div
          role="status"
          className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900"
        >
          No teacher reviews have been filed for this learner yet.
        </div>
      ) : (
        <ol
          aria-label="Teacher reviews, oldest first"
          className="space-y-2 list-none p-0 m-0"
        >
          {reviews.map((r) => (
            <li
              key={r._id}
              className="rounded-2xl bg-white border border-[#0B2343]/[0.06] p-4"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                    REVIEW_TYPE_TONE[r.review_type] ??
                    "bg-white text-[#0B2343]/70 border-[#0B2343]/[0.12]"
                  }`}
                >
                  {REVIEW_TYPE_LABEL[r.review_type] ?? r.review_type}
                </span>
                <span className="text-[11px] text-[#0B2343]/55 tabular-nums">
                  {r.duration_mins} min
                </span>
                <span className="text-[11px] text-[#0B2343]/55 tabular-nums">
                  · {new Date(r.created_at).toLocaleString("en-GB")}
                </span>
                {r.ai_recommendation_acted_on && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200">
                    Acted on AI rec
                  </span>
                )}
              </div>
              {r.notes && (
                <p className="text-sm text-[#0B2343]/85 leading-relaxed">
                  {r.notes}
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
