import { Link } from "react-router-dom";
import {
  PoundSterling,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Wallet,
} from "lucide-react";
import type { TutorEarnings } from "../../../data/tutor/tutorDashboardData";

interface Props {
  earnings: TutorEarnings;
}

export default function EarningsCard({ earnings }: Props) {
  const trend = earnings.thisMonthEarnings - earnings.lastMonthEarnings;
  const trendPercent =
    earnings.lastMonthEarnings > 0
      ? Math.round((trend / earnings.lastMonthEarnings) * 100)
      : 0;
  const isUp = trend >= 0;

  const currentMonth = new Date().toLocaleDateString("en-GB", {
    month: "short",
  });

  const payoutDate = new Date(earnings.nextPayoutDate).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short" }
  );

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
            <PoundSterling size={13} className="text-green-500" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">Earnings</h3>
        </div>
        <Link
          to="/tutor/earnings"
          className="flex items-center gap-1 text-[10px] text-[#ff7c22] font-medium hover:underline"
        >
          Details
          <ArrowRight size={10} />
        </Link>
      </div>

      {/* This month */}
      <div className="p-3 rounded-xl bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.04] mb-3">
        <p className="text-[10px] text-[#0B2343]/30 mb-0.5">
          {currentMonth} Earnings
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#0B2343]">
            £{earnings.thisMonthEarnings}
          </span>
          <span
            className={`flex items-center gap-0.5 text-[10px] font-semibold ${
              isUp ? "text-green-500" : "text-red-400"
            }`}
          >
            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isUp ? "+" : ""}
            {trendPercent}%
          </span>
        </div>
        <p className="text-[9px] text-[#0B2343]/20 mt-0.5">
          {earnings.completedLessonsThisMonth} lessons completed
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0B2343]/[0.015]">
          <Wallet size={12} className="text-[#ff7c22] shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#0B2343]/60">
              £{earnings.pendingPayout}
            </p>
            <p className="text-[9px] text-[#0B2343]/25">Payout {payoutDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0B2343]/[0.015]">
          <PoundSterling size={12} className="text-[#0B2343]/25 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#0B2343]/60">
              £{earnings.totalEarnings.toLocaleString()}
            </p>
            <p className="text-[9px] text-[#0B2343]/25">All time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
