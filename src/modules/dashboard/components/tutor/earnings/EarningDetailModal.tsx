import { X, Clock, BookOpen, Calendar, PoundSterling } from "lucide-react";
import { Link } from "react-router-dom";
import type { EarningEntry } from "../../../data/tutor/tutorEarningsData";

interface Props {
  entry: EarningEntry;
  onClose: () => void;
}

const statusConfig: Record<
  EarningEntry["status"],
  { label: string; color: string; bg: string }
> = {
  pending: { label: "Pending", color: "text-amber-500", bg: "bg-amber-50" },
  processing: { label: "Processing", color: "text-blue-500", bg: "bg-blue-50" },
  paid: { label: "Paid", color: "text-emerald-600", bg: "bg-emerald-50" },
};

export default function EarningDetailModal({ entry, onClose }: Props) {
  const sc = statusConfig[entry.status];
  const lessonDate = new Date(entry.lessonDate);

  const initials = entry.studentName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343]">
            Earning Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Amount + status */}
          <div className="text-center">
            <p
              className={`text-2xl sm:text-3xl font-bold ${
                entry.amount === 0 ? "text-[#0B2343]/20" : "text-[#0B2343]"
              }`}
            >
              {entry.amount === 0 ? "Free" : `£${entry.amount.toFixed(2)}`}
            </p>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mt-2 ${sc.bg}`}
            >
              <span className={`text-[11px] font-semibold ${sc.color}`}>
                {sc.label}
              </span>
            </div>
          </div>

          {/* Student */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.04]">
            <div className="w-10 h-10 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-xs font-bold text-[#0B2343]/30 shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#0B2343] truncate">
                {entry.studentName}
              </p>
              {/* ─── CHANGED: optional chaining for country fields ─── */}
              <p className="text-[11px] text-[#0B2343]/30">
                {[entry.studentCountry, entry.studentCountryCode]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </p>
            </div>
            <Link
              to={`/tutor/students/${entry.studentId}`}
              onClick={onClose}
              className="text-[10px] sm:text-[11px] font-medium text-[#ff7c22] hover:underline shrink-0"
            >
              View
            </Link>
          </div>

          {/* Lesson details — unchanged from here down */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <Calendar size={12} className="text-[#0B2343]/25" />
                Lesson Date
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                {lessonDate.toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <Clock size={12} className="text-[#0B2343]/25" />
                Time
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                {lessonDate.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <BookOpen size={12} className="text-[#0B2343]/25" />
                Type
              </span>
              <span
                className={`text-[11px] sm:text-xs font-semibold capitalize ${
                  entry.lessonType === "trial"
                    ? "text-[#ff7c22]"
                    : "text-[#0B2343]"
                }`}
              >
                {entry.lessonType} · {entry.duration}min
              </span>
            </div>
            {entry.lessonTopic && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
                <span className="text-[11px] sm:text-xs text-[#0B2343]/40">
                  Topic
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                  {entry.lessonTopic}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <PoundSterling size={12} className="text-[#0B2343]/25" />
                Rate
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                £{entry.rate}/hr
              </span>
            </div>
            {entry.paidDate && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-50/50">
                <span className="text-[11px] sm:text-xs text-emerald-600/60">
                  Paid On
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-600">
                  {new Date(entry.paidDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {entry.payoutId && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
                <span className="text-[11px] sm:text-xs text-[#0B2343]/40">
                  Payout Ref
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                  {entry.payoutId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
