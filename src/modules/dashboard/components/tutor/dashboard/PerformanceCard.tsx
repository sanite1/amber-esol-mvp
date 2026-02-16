import { BarChart3, Star, Users, CheckCircle2, Clock } from "lucide-react";
import type { TutorPerformance } from "../../../data/tutor/tutorDashboardData";

interface Props {
  performance: TutorPerformance;
}

export default function PerformanceCard({ performance }: Props) {
  const metrics = [
    {
      label: "Rating",
      value: performance.rating.toFixed(1),
      sub: `${performance.totalReviews} reviews`,
      icon: Star,
      color: "text-[#ff7c22]",
    },
    {
      label: "Active Students",
      value: performance.activeStudents.toString(),
      sub: `${performance.totalStudents} total`,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Completion",
      value: `${performance.completionRate}%`,
      sub: `${performance.totalLessonsCompleted.toLocaleString()} lessons`,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      label: "Response Rate",
      value: `${performance.responseRate}%`,
      sub: `${performance.totalHoursTaught.toLocaleString()}h taught`,
      icon: Clock,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
          <BarChart3 size={13} className="text-purple-500" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]">Performance</h3>
      </div>

      <div className="space-y-2.5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Icon size={12} className={`${metric.color} shrink-0`} />
                <span className="text-xs text-[#0B2343]/40">
                  {metric.label}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#0B2343]/70">
                  {metric.value}
                </span>
                <span className="text-[9px] text-[#0B2343]/20 ml-1.5">
                  {metric.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
