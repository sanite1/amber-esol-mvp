// src/components/tutor/dashboard/PerformanceCard.tsx
import {
  TrendingUp,
  Star,
  CheckCircle2,
  BookOpen,
  MessageSquare,
} from "lucide-react";

interface PerformanceData {
  rating: number;
  responseRate: number;
  completionRate: number;
  repeatStudentRate: number;
}

interface Props {
  performance: PerformanceData;
  // Live overrides from API
  averageRating?: number;
  completionRate?: number;
  totalLessons?: number;
  numberOfReviews?: number;
}

export default function PerformanceCard({
  performance,
  averageRating,
  completionRate: liveCompletionRate,
  totalLessons,
  numberOfReviews,
}: Props) {
  // Use live data when available, fall back to static
  const displayRating = averageRating ?? performance.rating;
  const displayCompletion = liveCompletionRate ?? performance.completionRate;

  const metrics = [
    {
      label: "Average Rating",
      value: displayRating.toFixed(1),
      suffix:
        numberOfReviews !== undefined ? `(${numberOfReviews} reviews)` : "/5.0",
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
      barColor: "bg-amber-400",
      percent: (displayRating / 5) * 100,
    },
    {
      label: "Response Rate",
      value: `${performance.responseRate}%`,
      suffix: "",
      icon: MessageSquare,
      color: "text-blue-500",
      bg: "bg-blue-50",
      barColor: "bg-blue-400",
      percent: performance.responseRate,
    },
    {
      label: "Completion Rate",
      value: `${displayCompletion}%`,
      suffix: totalLessons !== undefined ? `of ${totalLessons} lessons` : "",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      barColor: "bg-emerald-400",
      percent: displayCompletion,
    },
    {
      label: "Repeat Students",
      value: `${performance.repeatStudentRate}%`,
      suffix: "",
      icon: BookOpen,
      color: "text-purple-500",
      bg: "bg-purple-50",
      barColor: "bg-purple-400",
      percent: performance.repeatStudentRate,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
          <TrendingUp size={13} className="text-[#ff7c22]" />
        </div>
        <h3 className="text-sm font-semibold text-[#0B2343]">Performance</h3>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-md ${metric.bg} flex items-center justify-center`}
                  >
                    <Icon size={10} className={metric.color} />
                  </div>
                  <span className="text-xs text-[#0B2343]/50">
                    {metric.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[#0B2343]">
                    {metric.value}
                  </span>
                  {metric.suffix && (
                    <span className="text-[10px] text-[#0B2343]/25">
                      {metric.suffix}
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-[#0B2343]/[0.04] rounded-full overflow-hidden">
                <div
                  className={`h-full ${metric.barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(metric.percent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
