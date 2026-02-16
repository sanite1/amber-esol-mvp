import { useState } from "react";
import type { MonthlyRevenue } from "../../../data/admin/adminDashboardData";

interface Props {
  data: MonthlyRevenue[];
  commissionRate: number;
}

type ChartView = "revenue" | "commission" | "lessons";

export default function AdminRevenueChart({ data, commissionRate }: Props) {
  const [view, setView] = useState<ChartView>("revenue");

  const getValue = (item: MonthlyRevenue) => {
    switch (view) {
      case "revenue":
        return item.revenue;
      case "commission":
        return item.commission;
      case "lessons":
        return item.lessons;
    }
  };

  const formatValue = (v: number) => {
    if (view === "lessons") return v.toLocaleString();
    return `£${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`;
  };

  const maxVal = Math.max(...data.map(getValue), 1);

  const barColor =
    view === "revenue"
      ? "bg-[#0B2343]/[0.1]"
      : view === "commission"
        ? "bg-violet-100"
        : "bg-[#ff7c22]/15";
  const barColorActive =
    view === "revenue"
      ? "bg-[#0B2343]"
      : view === "commission"
        ? "bg-violet-500"
        : "bg-[#ff7c22]";

  const views: { value: ChartView; label: string }[] = [
    { value: "revenue", label: "Revenue" },
    { value: "commission", label: "Commission" },
    { value: "lessons", label: "Lessons" },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343]">
          Monthly Overview
        </h3>
        <div className="flex gap-1">
          {views.map((v) => (
            <button
              key={v.value}
              onClick={() => setView(v.value)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors ${
                view === v.value
                  ? "bg-[#0B2343] text-white"
                  : "text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04]"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-1.5 sm:gap-3 h-32 sm:h-44">
        {data.map((item, i) => {
          const val = getValue(item);
          const pct = (val / maxVal) * 100;
          const isLast = i === data.length - 1;
          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center gap-1.5"
            >
              <span className="text-[8px] sm:text-[10px] font-semibold text-[#0B2343]/40">
                {formatValue(val)}
              </span>
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-md sm:rounded-t-lg transition-all duration-500 ${isLast ? barColorActive : barColor} hover:opacity-80`}
                  style={{ height: `${Math.max(pct, 4)}%` }}
                  title={`${item.label}: ${formatValue(val)}`}
                />
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-medium ${isLast ? "text-[#0B2343]" : "text-[#0B2343]/30"}`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-[#0B2343]/[0.04]">
        <p className="text-[10px] text-[#0B2343]/25">
          Commission rate:{" "}
          <span className="font-semibold text-[#0B2343]/40">
            {commissionRate}%
          </span>
        </p>
      </div>
    </div>
  );
}
