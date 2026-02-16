import React from "react";
import {
  DollarSign,
  TrendingUp,
  RotateCcw,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { AdminPaymentsStats } from "../../../data/admin/adminPaymentsData";

interface Props {
  stats: AdminPaymentsStats;
}

export default function PaymentsStatsRow({ stats }: Props) {
  const cards = [
    {
      label: "Revenue (Month)",
      value: `£${stats.revenueThisMonth.toLocaleString()}`,
      sub: `${stats.revenueTrend > 0 ? "+" : ""}${stats.revenueTrend}% vs last month`,
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      trend: stats.revenueTrend,
    },
    {
      label: "Commission (Month)",
      value: `£${stats.commissionThisMonth.toLocaleString()}`,
      sub: `£${stats.totalCommission.toLocaleString()} total`,
      icon: TrendingUp,
      iconBg: "bg-[#ff7c22]/10",
      iconColor: "text-[#ff7c22]",
    },
    {
      label: "Refunds (Month)",
      value: `£${stats.refundsThisMonth.toLocaleString()}`,
      sub: `£${stats.totalRefunds.toLocaleString()} total`,
      icon: RotateCcw,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      label: "Pending Payouts",
      value: stats.pendingPayouts.toString(),
      sub: `£${stats.pendingPayoutsAmount.toLocaleString()} total`,
      icon: Clock,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Processing",
      value: stats.processingPayouts.toString(),
      sub: "payouts in transit",
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "Flagged",
      value: stats.flaggedItems.toString(),
      sub: `${stats.failedTransactions} failed`,
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}
              >
                <Icon size={14} className={card.iconColor} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 leading-tight">
                {card.label}
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-[#0B2343] leading-none mb-0.5">
              {card.value}
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
              {card.trend !== undefined && (
                <span
                  className={
                    card.trend >= 0 ? "text-emerald-500" : "text-red-500"
                  }
                >
                  {card.trend > 0 ? "↑" : "↓"}{" "}
                </span>
              )}
              {card.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
