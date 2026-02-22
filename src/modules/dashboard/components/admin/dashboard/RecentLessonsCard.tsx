import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import type { RecentLesson } from "../../../lib/types/adminDashboard";

import dayjs from "dayjs";
import { lessonDateTime } from "../../../lib/utils/dateHelpers";

const formatTime = (dateStr: string, startTime?: string) => {
  // The `l.date` coming from the API is a YYYY-MM-DD string
  const lessonMoment = startTime
    ? lessonDateTime(dateStr, startTime, "Europe/London")
    : dayjs(dateStr);
  const now = dayjs();
  const diffMs = now.diff(lessonMoment);
  if (diffMs < 0) {
    const fHrs = Math.floor(-diffMs / 3600000);
    if (fHrs < 1) return "Starting soon";
    return `In ${fHrs}h`;
  }
  const diffHrs = Math.floor(diffMs / 3600000);
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
};

interface Props {
  lessons: RecentLesson[];
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  in_progress: {
    label: "Live",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  upcoming: { label: "Upcoming", color: "text-blue-500", bg: "bg-blue-50" },
  completed: {
    label: "Done",
    color: "text-[#0B2343]/35",
    bg: "bg-[#0B2343]/[0.04]",
  },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-50" },
  no_show: { label: "No-show", color: "text-amber-600", bg: "bg-amber-50" },
};

export default function RecentLessonsCard({ lessons }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] flex items-center gap-2">
          <BookOpen size={14} className="text-[#0B2343]/30" />
          Recent Lessons
        </h3>
        <Link
          to="/admin/lessons"
          className="text-[10px] sm:text-[11px] font-medium text-[#ff7c22] hover:underline"
        >
          View all
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-[#0B2343]/[0.03] flex items-center justify-center mx-auto mb-2.5">
            <BookOpen size={18} className="text-[#0B2343]/15" />
          </div>
          <p className="text-xs text-[#0B2343]/25">No lessons yet</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {lessons.slice(0, 4).map((l) => {
            const sc = statusConfig[l.status] || statusConfig.completed;
            return (
              <Link
                key={l.id}
                to={`/admin/lessons/${l.id}`}
                className="flex items-center gap-2.5 py-2 px-2 sm:px-2.5 rounded-lg hover:bg-[#0B2343]/[0.02] transition-colors group"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${sc.bg} flex items-center justify-center shrink-0`}
                >
                  {l.status === "in_progress" ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ) : (
                    <BookOpen size={12} className={sc.color} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/70 truncate">
                      {l.studentName}
                    </p>
                    <span className="text-[9px] text-[#0B2343]/20">→</span>
                    <p className="text-[11px] sm:text-xs text-[#0B2343]/40 truncate">
                      {l.tutorName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.color}`}
                    >
                      {sc.label}
                    </span>
                    {l.type === "trial" && (
                      <span className="text-[8px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded-full">
                        Trial
                      </span>
                    )}
                    <span className="text-[9px] text-[#0B2343]/20">
                      {l.duration}min · {formatTime(l.date)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`text-[11px] sm:text-xs font-bold ${l.amount === 0 ? "text-[#0B2343]/15" : "text-[#0B2343]/60"}`}
                  >
                    {l.amount === 0 ? "Free" : `£${l.amount.toFixed(2)}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
