import { Clock, CheckCircle2, Loader2 } from "lucide-react";
import type { EarningEntry } from "../../../data/tutor/tutorEarningsData";

interface Props {
  entry: EarningEntry;
  onViewDetails: (entry: EarningEntry) => void;
}

const statusConfig: Record<
  EarningEntry["status"],
  { label: string; icon: typeof Clock; color: string; bg: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
};

export default function EarningEntryCard({ entry, onViewDetails }: Props) {
  const sc = statusConfig[entry.status];
  const StatusIcon = sc.icon;

  const initials = entry.studentName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const createdAt = new Date(entry.createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const createdDay = new Date(createdAt);
  createdDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (createdDay.getTime() - today.getTime()) / 86400000
  );

  const dateLabel =
    diffDays === 0
      ? "Today"
      : diffDays === -1
        ? "Yesterday"
        : diffDays === 1
          ? "Tomorrow"
          : diffDays > 1 && diffDays < 7
            ? `In ${diffDays} days`
            : diffDays < -1 && diffDays > -7
              ? `${Math.abs(diffDays)}d ago`
              : createdAt.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                });

  return (
    <button
      onClick={() => onViewDetails(entry)}
      className="w-full text-left bg-white rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/[0.12] transition-colors"
    >
      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[11px] font-bold text-[#0B2343]/30 shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs sm:text-[13px] font-semibold text-[#0B2343] truncate">
              {entry.studentName}
            </p>
            <span className="text-[9px] text-[#0B2343]/25 shrink-0">
              {entry.studentCountryCode}
            </span>
            {entry.lessonType === "trial" && (
              <span className="text-[9px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1.5 py-0.5 rounded shrink-0">
                Trial
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#0B2343]/30 mt-0.5 truncate">
            {entry.lessonTopic || "Lesson"} · {entry.duration}min · {dateLabel}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full ${sc.bg} shrink-0`}
        >
          <StatusIcon
            size={11}
            className={`${sc.color} ${entry.status === "processing" ? "animate-spin" : ""}`}
          />
          <span className={`text-[10px] font-semibold ${sc.color}`}>
            {sc.label}
          </span>
        </div>
        <p
          className={`text-sm font-bold shrink-0 min-w-[60px] text-right ${
            entry.amount === 0 ? "text-[#0B2343]/20" : "text-[#0B2343]"
          }`}
        >
          {entry.amount === 0 ? "Free" : `£${entry.amount.toFixed(2)}`}
        </p>
      </div>

      {/* Mobile */}
      <div className="sm:hidden px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] font-bold text-[#0B2343]/30 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[12px] font-semibold text-[#0B2343] truncate">
                {entry.studentName}
              </p>
              {entry.lessonType === "trial" && (
                <span className="text-[8px] font-semibold text-[#ff7c22] bg-[#ff7c22]/10 px-1 py-0.5 rounded shrink-0">
                  Trial
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#0B2343]/30 mt-0.5">
              {entry.duration}min · {dateLabel}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <p
              className={`text-[13px] font-bold ${
                entry.amount === 0 ? "text-[#0B2343]/20" : "text-[#0B2343]"
              }`}
            >
              {entry.amount === 0 ? "Free" : `£${entry.amount.toFixed(2)}`}
            </p>
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${sc.bg}`}
            >
              <StatusIcon
                size={9}
                className={`${sc.color} ${entry.status === "processing" ? "animate-spin" : ""}`}
              />
              <span className={`text-[8px] font-semibold ${sc.color}`}>
                {sc.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
