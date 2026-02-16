import { TrendingUp, Calendar } from "lucide-react";

interface Props {
  monthlySpend: number;
  totalSpent: number;
}

export default function SpendingSummary({ monthlySpend, totalSpent }: Props) {
  const currentMonth = new Date().toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center">
            <Calendar size={13} className="text-[#0B2343]/30" />
          </div>
          <span className="text-xs text-[#0B2343]/40">This Month</span>
        </div>
        <p className="text-xl font-bold text-[#0B2343]">£{monthlySpend}</p>
        <p className="text-[10px] text-[#0B2343]/30 mt-1">{currentMonth}</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center">
            <TrendingUp size={13} className="text-[#0B2343]/30" />
          </div>
          <span className="text-xs text-[#0B2343]/40">All Time</span>
        </div>
        <p className="text-xl font-bold text-[#0B2343]">£{totalSpent}</p>
        <p className="text-[10px] text-[#0B2343]/30 mt-1">Since you joined</p>
      </div>
    </div>
  );
}
