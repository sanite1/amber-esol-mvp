import React from "react";
import { Star, AlertTriangle } from "lucide-react";
import type { AdminLesson } from "../../../data/admin/adminLessonsData";

interface Props {
  lesson: AdminLesson;
  onClick: (lesson: AdminLesson) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  upcoming: {
    label: "Upcoming",
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-400",
  },
  in_progress: {
    label: "Live",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-400",
  },
  completed: {
    label: "Completed",
    bg: "bg-[#0B2343]/[0.05]",
    text: "text-[#0B2343]/70",
    dot: "bg-[#0B2343]/40",
  },
  cancelled_student: {
    label: "Cancelled (Student)",
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "bg-red-400",
  },
  cancelled_tutor: {
    label: "Cancelled (Tutor)",
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "bg-red-400",
  },
  cancelled_admin: {
    label: "Cancelled (Admin)",
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "bg-red-400",
  },
  no_show: {
    label: "No-show",
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
  },
};

const paymentConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "text-emerald-500" },
  refunded: { label: "Refunded", className: "text-red-500" },
  pending: { label: "Pending", className: "text-amber-500" },
  free: { label: "Free", className: "text-[#0B2343]/40" },
};

// function formatDate(dateStr: string): string {
//   const d = new Date(dateStr);
//   return d.toLocaleDateString("en-GB", {
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//   });
// }

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

export default function AdminLessonCard({ lesson, onClick }: Props) {
  const status = statusConfig[lesson.status] || statusConfig.upcoming;
  const payment = paymentConfig[lesson.paymentStatus] || paymentConfig.pending;

  return (
    <button
      onClick={() => onClick(lesson)}
      className={`w-full text-left bg-white rounded-2xl border transition-all hover:shadow-sm hover:border-[#0B2343]/[0.12] cursor-pointer ${
        lesson.flagged
          ? "border-amber-200 bg-amber-50/30"
          : "border-[#0B2343]/[0.06]"
      }`}
    >
      <div className="p-3 sm:p-4">
        {/* Top row */}
        <div className="flex items-start gap-3">
          {/* Date badge */}
          <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0B2343]/[0.04] flex flex-col items-center justify-center">
            <span className="text-[10px] text-[#0B2343]/40 leading-none font-medium">
              {new Date(lesson.date).toLocaleDateString("en-GB", {
                weekday: "short",
              })}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#0B2343] leading-tight">
              {new Date(lesson.date).getDate()}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[#0B2343] truncate">
                  {lesson.topic || lesson.subject}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {lesson.startTime} – {lesson.endTime} · {lesson.duration} min
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {lesson.flagged && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600">
                    <AlertTriangle size={10} />
                    <span className="text-[9px] font-medium hidden sm:inline">
                      Flagged
                    </span>
                  </span>
                )}
                {lesson.type === "trial" && (
                  <span className="px-1.5 py-0.5 rounded-md bg-[#ff7c22]/10 text-[#ff7c22] text-[9px] sm:text-[10px] font-medium">
                    Trial
                  </span>
                )}
                <span
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${status.bg} ${status.text} text-[9px] sm:text-[10px] font-medium`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${status.dot} ${
                      lesson.status === "in_progress" ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="hidden sm:inline">{status.label}</span>
                </span>
              </div>
            </div>

            {/* Participants row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 shrink-0">
                  <Initials name={lesson.studentName} />
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/60 truncate">
                  {lesson.studentName}
                </span>
              </div>
              <span className="text-[10px] text-[#0B2343]/20">→</span>
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 shrink-0">
                  <Initials name={lesson.tutorName} />
                </div>
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/60 truncate">
                  {lesson.tutorName}
                </span>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              <span
                className={`text-[10px] sm:text-[11px] font-medium ${payment.className}`}
              >
                {lesson.amount > 0 ? `£${lesson.amount.toFixed(2)}` : "Free"} ·{" "}
                {payment.label}
              </span>
              {lesson.rating && (
                <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] text-amber-500">
                  <Star size={10} fill="currentColor" />
                  {lesson.rating}
                </span>
              )}
              {lesson.cancelReason && (
                <span className="text-[10px] text-red-400 truncate max-w-[180px] sm:max-w-xs">
                  {lesson.cancelReason}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
