import React from "react";
import {
  Star,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { AdminReview } from "../../../lib/types/adminReview";

interface Props {
  review: AdminReview;
  onClick: (review: AdminReview) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  published: {
    label: "Published",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  hidden: { label: "Hidden", bg: "bg-blue-50", text: "text-blue-600" },
  removed: { label: "Removed", bg: "bg-red-50", text: "text-red-500" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="w-full h-full rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-[#0B2343]/50">
      {initials}
    </div>
  );
}

export default function AdminReviewCard({ review, onClick }: Props) {
  const status = statusConfig[review.status] || statusConfig.published;
  const pendingReports = review.reports.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <button
      onClick={() => onClick(review)}
      className={`w-full text-left bg-white rounded-2xl border transition-all hover:shadow-sm hover:border-[#0B2343]/[0.12] cursor-pointer ${
        pendingReports > 0
          ? "border-amber-200 bg-amber-50/20"
          : review.status === "hidden"
            ? "border-blue-100 bg-blue-50/20"
            : review.status === "removed"
              ? "border-red-100 bg-red-50/10"
              : "border-[#0B2343]/[0.06]"
      }`}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Student avatar */}
          <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10">
            <Initials name={review.studentName} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-semibold text-[#0B2343]">
                    {review.studentName}
                  </span>
                  <span className="text-[10px] text-[#0B2343]/30">→</span>
                  <span className="text-[10px] sm:text-[11px] text-[#0B2343]/60">
                    {review.tutorName}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {review.lessonTopic} · {timeAgo(review.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {pendingReports > 0 && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600">
                    <AlertTriangle size={10} />
                    <span className="text-[9px] font-semibold">
                      {pendingReports}
                    </span>
                  </span>
                )}
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium ${status.bg} ${status.text}`}
                >
                  {status.label}
                </span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={
                    i < review.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-[#0B2343]/10"
                  }
                />
              ))}
              <span className="ml-1 text-[10px] sm:text-[11px] text-[#0B2343]/40">
                {review.rating}/5
              </span>
            </div>

            {/* Comment preview */}
            <p className="text-[11px] sm:text-xs text-[#0B2343]/70 line-clamp-2 leading-relaxed">
              {review.comment}
            </p>

            {/* Bottom row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              {review.tutorReply && (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  <MessageSquare size={10} />
                  Replied
                </span>
              )}
              {review.lessonType === "trial" && (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#ff7c22]">
                  <Zap size={10} />
                  Trial
                </span>
              )}
              {review.helpfulCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  <ThumbsUp size={10} />
                  {review.helpfulCount}
                </span>
              )}
              {review.reports.length > 0 && (
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {review.reports.length} report
                  {review.reports.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
