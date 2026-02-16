import { Link } from "react-router-dom";
import { PoundSterling, CalendarClock, Clock, ArrowRight } from "lucide-react";
import type { SpendingSummary } from "../../../data/student/studentDashboardData";

interface Props {
  summary: SpendingSummary;
}

export default function SpendingSummaryCard({ summary }: Props) {
  const currentMonth = new Date().toLocaleDateString("en-GB", {
    month: "short",
  });

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
            <PoundSterling size={13} className="text-[#ff7c22]" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">Spending</h3>
        </div>
        <Link
          to="/payments"
          className="flex items-center gap-1 text-[10px] text-[#ff7c22] font-medium hover:underline"
        >
          View all
          <ArrowRight size={10} />
        </Link>
      </div>

      {/* This month - prominent */}
      <div className="p-3 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.04] mb-3">
        <p className="text-[10px] text-[#0B2343]/30 mb-0.5">
          Spent in {currentMonth}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-[#0B2343]">
            £{summary.thisMonthSpent}
          </span>
          <span className="text-[10px] text-[#0B2343]/20">
            of £{summary.totalSpent} total
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0B2343]/[0.015]">
          <CalendarClock size={12} className="text-blue-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#0B2343]/60">
              £{summary.upcomingLessonsValue}
            </p>
            <p className="text-[9px] text-[#0B2343]/25">Upcoming</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0B2343]/[0.015]">
          <Clock size={12} className="text-green-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#0B2343]/60">
              {summary.totalHoursBooked}h
            </p>
            <p className="text-[9px] text-[#0B2343]/25">Hours booked</p>
          </div>
        </div>
      </div>
    </div>
  );
}
