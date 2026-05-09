import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import type { Tutor } from "../../data/tutorsData";

interface Props {
  tutor: Tutor;
}

const INITIAL_COUNT = 3;

export default function TutorReviews({ tutor }: Props) {
  const reviews = tutor.reviewsList;
  const [showAll, setShowAll] = useState(false);
  if (!reviews || reviews.length === 0) return null;

  const visible = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);

  // Rating breakdown
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: Math.round(
      (reviews.filter((r) => r.rating === star).length / reviews.length) * 100,
    ),
  }));

  return (
    <div data-aos="fade-up" data-aos-delay="100">
      <h3 className="text-lg font-extrabold text-[#0B2343] mb-5">
        Student reviews
      </h3>

      {/* Summary */}
      <div className="flex items-start gap-6 mb-6 p-5 bg-[#fafbfc] rounded-2xl border border-[#0B2343]/[0.04]">
        <div className="text-center shrink-0">
          <p className="text-4xl font-extrabold text-[#0B2343]">
            {tutor.rating}
          </p>
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < Math.round(tutor.rating)
                    ? "text-[#ff7c22]"
                    : "text-[#0B2343]/10"
                }
                fill={i < Math.round(tutor.rating) ? "#ff7c22" : "none"}
              />
            ))}
          </div>
          <p className="text-[10px] text-[#0B2343]/35 mt-1">
            {tutor.reviews} reviews
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {breakdown.map((b) => (
            <div key={b.star} className="flex items-center gap-2">
              <span className="text-[11px] text-[#0B2343]/40 w-3 text-right">
                {b.star}
              </span>
              <Star
                size={10}
                className="text-[#ff7c22] shrink-0"
                fill="#ff7c22"
              />
              <div className="flex-1 h-2 rounded-full bg-[#0B2343]/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ff7c22]"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="text-[10px] text-[#0B2343]/30 w-8">
                {b.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-3">
        {visible.map((r) => (
          <div
            key={r.id}
            className="p-4 bg-white rounded-xl border border-[#0B2343]/[0.05]"
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={r.avatar}
                alt={r.author}
                loading="lazy"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#0B2343] truncate">
                    {r.author}
                  </p>
                  <span className="px-2 py-0.5 rounded-md bg-[#0B2343]/[0.04] text-[10px] font-semibold text-[#0B2343]/40">
                    {r.level}
                  </span>
                </div>
                <p className="text-[10px] text-[#0B2343]/30">{r.date}</p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={10}
                    className="text-[#ff7c22]"
                    fill="#ff7c22"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#0B2343]/50 leading-relaxed">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      {reviews.length > INITIAL_COUNT && (
        <button
          onClick={() => setShowAll((p) => !p)}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#ff7c22] hover:underline"
        >
          {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
          <ChevronDown
            size={14}
            className={`transition-transform ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
