import {
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
} from "lucide-react";
import type { ReviewStats } from "../../../data/tutor/tutorReviewsData";

interface Props {
  stats: ReviewStats;
}

export default function ReviewsOverview({ stats }: Props) {
  const maxCount = Math.max(...Object.values(stats.ratingBreakdown), 1);

  const trendIcon =
    stats.recentTrend === "up" ? (
      <TrendingUp size={13} className="text-emerald-500" />
    ) : stats.recentTrend === "down" ? (
      <TrendingDown size={13} className="text-red-400" />
    ) : (
      <Minus size={13} className="text-[#0B2343]/25" />
    );

  const trendColor =
    stats.recentTrend === "up"
      ? "text-emerald-600"
      : stats.recentTrend === "down"
        ? "text-red-500"
        : "text-[#0B2343]/40";

  const trendLabel =
    stats.recentTrend === "up"
      ? `+${stats.recentTrendValue}`
      : stats.recentTrend === "down"
        ? `-${stats.recentTrendValue}`
        : "No change";

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Left: big rating */}
        <div className="flex flex-col items-center sm:items-start shrink-0 sm:min-w-[120px]">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-bold text-[#0B2343]">
              {stats.averageRating}
            </span>
            <span className="text-sm text-[#0B2343]/25">/5</span>
          </div>
          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(stats.averageRating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-[#0B2343]/10"
                }
              />
            ))}
          </div>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/35 mt-1">
            {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
          </p>
          {/* Trend */}
          <div className="flex items-center gap-1 mt-2">
            {trendIcon}
            <span className={`text-[11px] font-semibold ${trendColor}`}>
              {trendLabel}
            </span>
          </div>
          {/* Response rate */}
          <div className="flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-[#0B2343]/[0.03]">
            <MessageSquare size={11} className="text-[#0B2343]/25" />
            <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
              {stats.responseRate}% replied
            </span>
          </div>
        </div>

        {/* Right: breakdown bars */}
        <div className="flex-1 space-y-1.5 sm:space-y-2 justify-center flex flex-col">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const count = stats.ratingBreakdown[star];
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 sm:gap-2.5">
                <span className="text-[11px] sm:text-xs font-medium text-[#0B2343]/40 w-4 text-right shrink-0">
                  {star}
                </span>
                <Star
                  size={11}
                  className="text-amber-400 fill-amber-400 shrink-0"
                />
                <div className="flex-1 h-2 sm:h-2.5 rounded-full bg-[#0B2343]/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/30 w-6 text-right shrink-0">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
