import {
  PoundSterling,
  TrendingUp,
  TrendingDown,
  Minus,
  Wallet,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { EarningsStats } from "../../../data/tutor/tutorEarningsData";

interface Props {
  stats: EarningsStats;
  onRequestPayout: () => void;
}

export default function EarningsStatsCards({ stats, onRequestPayout }: Props) {
  const trendIcon =
    stats.monthlyTrend === "up" ? (
      <TrendingUp size={12} className="text-emerald-500" />
    ) : stats.monthlyTrend === "down" ? (
      <TrendingDown size={12} className="text-red-400" />
    ) : (
      <Minus size={12} className="text-[#0B2343]/25" />
    );

  const trendColor =
    stats.monthlyTrend === "up"
      ? "text-emerald-600"
      : stats.monthlyTrend === "down"
        ? "text-red-500"
        : "text-[#0B2343]/40";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {/* This month */}
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
            <PoundSterling size={14} className="text-[#ff7c22]" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#0B2343]/35">
            This Month
          </span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-[#0B2343]">
          £{stats.thisMonthEarned.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {trendIcon}
          <span className={`text-[10px] font-semibold ${trendColor}`}>
            {stats.monthlyTrendPct}% vs last month
          </span>
        </div>
      </div>

      {/* Available balance */}
      <div className="bg-white rounded-xl border border-emerald-100 p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Wallet size={14} className="text-emerald-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#0B2343]/35">
            Available
          </span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-emerald-600">
          £{stats.availableBalance.toLocaleString()}
        </p>
        {stats.availableBalance > 0 && (
          <button
            onClick={onRequestPayout}
            className="mt-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-600 hover:underline"
          >
            Request Payout →
          </button>
        )}
      </div>

      {/* Pending */}
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Clock size={14} className="text-amber-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#0B2343]/35">
            Pending
          </span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-[#0B2343]">
          £{stats.pendingBalance.toLocaleString()}
        </p>
        <p className="text-[10px] text-[#0B2343]/25 mt-1">
          Awaiting lesson completion
        </p>
      </div>

      {/* Total earned */}
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <CheckCircle2 size={14} className="text-blue-500" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#0B2343]/35">
            Total Earned
          </span>
        </div>
        <p className="text-lg sm:text-xl font-bold text-[#0B2343]">
          £{stats.totalEarned.toLocaleString()}
        </p>
        <p className="text-[10px] text-[#0B2343]/25 mt-1">
          {stats.totalLessons} lessons · £{stats.avgPerHour.toFixed(2)}/hr avg
        </p>
      </div>
    </div>
  );
}
