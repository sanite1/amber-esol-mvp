import type { MonthlyEarning } from "../../../data/tutor/tutorEarningsData";

interface Props {
  data: MonthlyEarning[];
}

export default function EarningsChart({ data }: Props) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] mb-4">
        Monthly Earnings
      </h3>

      {/* Bars */}
      <div className="flex items-end gap-1.5 sm:gap-3 h-32 sm:h-44">
        {data.map((item, i) => {
          const pct = (item.amount / maxAmount) * 100;
          const isLast = i === data.length - 1;
          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              {/* Amount label */}
              <span className="text-[9px] sm:text-[10px] font-semibold text-[#0B2343]/40">
                £{item.amount}
              </span>
              {/* Bar */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-md sm:rounded-t-lg transition-all duration-500 ${
                    isLast ? "bg-[#ff7c22]" : "bg-[#0B2343]/[0.08]"
                  } hover:opacity-80`}
                  style={{ height: `${Math.max(pct, 4)}%` }}
                  title={`${item.label}: £${item.amount} (${item.lessons} lessons)`}
                />
              </div>
              {/* Label */}
              <span
                className={`text-[9px] sm:text-[10px] font-medium ${
                  isLast ? "text-[#ff7c22]" : "text-[#0B2343]/30"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[#0B2343]/[0.04]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#0B2343]/[0.08]" />
          <span className="text-[10px] text-[#0B2343]/30">Previous</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#ff7c22]" />
          <span className="text-[10px] text-[#0B2343]/30">Current</span>
        </div>
      </div>
    </div>
  );
}
