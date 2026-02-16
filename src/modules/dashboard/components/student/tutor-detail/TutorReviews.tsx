import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import type { TutorReview } from "../../../data/student/tutorDetailData";

interface Props {
  reviews: TutorReview[];
  rating: number;
  totalReviews: number;
}

export default function TutorReviews({ reviews, rating, totalReviews }: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, 3);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-[#0B2343]">
            Student Reviews
          </h2>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#ff7c22]/10">
            <Star size={12} className="text-[#ff7c22]" fill="currentColor" />
            <span className="text-xs font-bold text-[#ff7c22]">{rating}</span>
          </div>
          <span className="text-xs text-[#0B2343]/30">
            ({totalReviews} reviews)
          </span>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {visible.map((review) => (
          <div
            key={review.id}
            className="pb-4 border-b border-[#0B2343]/[0.04] last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              {/* Student avatar */}
              <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-[10px] font-semibold text-[#0B2343]/30">
                {review.studentAvatar ? (
                  <img
                    src={review.studentAvatar}
                    alt={review.studentName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  review.studentName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#0B2343]/70">
                      {review.studentName}
                    </span>
                    <span className="text-[10px] text-[#0B2343]/25 bg-[#0B2343]/[0.03] px-1.5 py-0.5 rounded">
                      {review.lessonType}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#0B2343]/25">
                    {formatDate(review.date)}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mt-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className={
                        i < review.rating
                          ? "text-[#ff7c22]"
                          : "text-[#0B2343]/10"
                      }
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>

                <p className="text-sm text-[#0B2343]/50 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more */}
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-1 w-full mt-4 py-2.5 rounded-xl bg-[#0B2343]/[0.03] text-xs text-[#0B2343]/35 hover:bg-[#0B2343]/[0.06] hover:text-[#0B2343]/50 transition-colors"
        >
          {showAll
            ? "Show fewer reviews"
            : `View all ${reviews.length} reviews`}
          <ChevronDown
            size={13}
            className={`transition-transform ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
