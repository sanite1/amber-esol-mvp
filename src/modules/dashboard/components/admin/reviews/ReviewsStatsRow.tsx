import React from "react";
import {
  MessageSquare,
  Star,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import type { AdminReviewsStats } from "../../../data/admin/adminReviewsData";

interface Props {
  stats: AdminReviewsStats;
}

export default function ReviewsStatsRow({ stats }: Props) {
  const cards = [
    {
      label: "Total Reviews",
      value: stats.totalReviews.toLocaleString(),
      sub: `${stats.reviewsThisMonth} this month`,
      icon: MessageSquare,
      iconBg: "bg-[#0B2343]/[0.06]",
      iconColor: "text-[#0B2343]",
    },
    {
      label: "Avg Rating",
      value: stats.averageRating.toFixed(1),
      sub: `${stats.publishedReviews} published`,
      icon: Star,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "Hidden",
      value: stats.hiddenReviews.toString(),
      sub: "reviews hidden",
      icon: EyeOff,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Removed",
      value: stats.removedReviews.toString(),
      sub: "reviews removed",
      icon: Trash2,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      label: "Pending Reports",
      value: stats.pendingReports.toString(),
      sub: `${stats.reportsThisMonth} this month`,
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "Actions Taken",
      value: stats.actionsTaken.toString(),
      sub: `${stats.dismissedReports} dismissed`,
      icon: Eye,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
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
