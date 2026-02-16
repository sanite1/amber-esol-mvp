import React from "react";
import {
  BookOpen,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import type { AdminLessonsStats } from "../../../data/admin/adminLessonsData";

interface Props {
  stats: AdminLessonsStats;
}

export default function LessonsStatsRow({ stats }: Props) {
  const cards = [
    {
      label: "Total Lessons",
      value: stats.totalLessons.toLocaleString(),
      sub: `${stats.trialLessons} trials`,
      icon: BookOpen,
      iconBg: "bg-[#0B2343]/[0.06]",
      iconColor: "text-[#0B2343]",
    },
    {
      label: "Completed",
      value: stats.completedLessons.toLocaleString(),
      sub: `${stats.completionRate}% rate`,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Upcoming",
      value: stats.upcomingLessons.toLocaleString(),
      sub: `${stats.inProgressLessons} live now`,
      icon: Clock,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Cancelled",
      value: stats.cancelledLessons.toLocaleString(),
      sub: `${stats.noShowLessons} no-shows`,
      icon: XCircle,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      label: "Flagged",
      value: stats.flaggedLessons.toString(),
      sub: "need review",
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "Commission",
      value: `£${stats.totalCommission.toLocaleString()}`,
      sub: `of £${stats.totalRevenue.toLocaleString()} revenue`,
      icon: DollarSign,
      iconBg: "bg-[#ff7c22]/10",
      iconColor: "text-[#ff7c22]",
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
              {card.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
