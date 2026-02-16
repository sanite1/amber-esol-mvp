import {
  Users,
  GraduationCap,
  BookOpen,
  PoundSterling,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { PlatformStats } from "../../../data/admin/adminDashboardData";

interface Props {
  stats: PlatformStats;
}

export default function AdminStatsRow({ stats }: Props) {
  const items = [
    {
      label: "Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
      link: "/admin/students",
    },
    {
      label: "Tutors",
      value: stats.totalTutors.toString(),
      sub: `${stats.activeTutors} active`,
      icon: GraduationCap,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      link: "/admin/tutors",
    },
    {
      label: "Lessons Today",
      value: stats.lessonsToday.toString(),
      sub: `${stats.activeLessonsNow} live now`,
      icon: BookOpen,
      color: "text-[#ff7c22]",
      bg: "bg-[#ff7c22]/10",
      link: "/admin/lessons",
    },
    {
      label: "Revenue (Month)",
      value: `£${(stats.revenueThisMonth / 1000).toFixed(1)}k`,
      sub: `${stats.revenueTrend === "up" ? "+" : stats.revenueTrend === "down" ? "-" : ""}${stats.revenueTrendPct}%`,
      subColor:
        stats.revenueTrend === "up"
          ? "text-emerald-500"
          : stats.revenueTrend === "down"
            ? "text-red-500"
            : "text-[#0B2343]/30",
      icon: PoundSterling,
      color: "text-violet-500",
      bg: "bg-violet-50",
      link: "/admin/payments",
    },
    {
      label: "Pending Payouts",
      value: stats.pendingPayouts.toString(),
      sub: `£${stats.pendingPayoutsAmount.toLocaleString()}`,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
      link: "/admin/payments",
    },
    {
      label: "Flagged",
      value: (stats.reportedReviews + stats.pendingTutorApprovals).toString(),
      sub: `${stats.pendingTutorApprovals} approvals`,
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-50",
      link: "/admin/reviews",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            to={item.link}
            className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 hover:border-[#0B2343]/[0.12] transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.color}`} />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-[#0B2343] group-hover:text-[#ff7c22] transition-colors">
              {item.value}
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35 truncate">
              {item.label}
              {item.sub && (
                <span
                  className={`ml-1 font-semibold ${(item as any).subColor || "text-[#0B2343]/40"}`}
                >
                  · {item.sub}
                </span>
              )}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
