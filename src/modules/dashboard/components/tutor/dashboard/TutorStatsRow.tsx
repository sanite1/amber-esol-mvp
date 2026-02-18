// src/components/tutor/dashboard/TutorStatsRow.tsx
import { BookOpen, Star, CheckCircle2, Users } from "lucide-react";

interface Props {
  todayLessons: number;
  weekLessons: number;
  newStudents: number;
  unreadMessages: number;
  // Live from API
  totalLessons?: number;
  averageRating?: number;
  completionRate?: number;
  totalStudents?: number;
}

export default function TutorStatsRow({
  totalLessons,
  averageRating,
  completionRate,
  totalStudents,
}: Props) {
  // const quickStats = [
  //   {
  //     label: "Today",
  //     value: todayLessons.toString(),
  //     icon: Calendar,
  //     color: "text-[#ff7c22]",
  //     bg: "bg-[#ff7c22]/10",
  //   },
  //   {
  //     label: "This Week",
  //     value: weekLessons.toString(),
  //     icon: BookOpen,
  //     color: "text-blue-500",
  //     bg: "bg-blue-50",
  //   },
  //   {
  //     label: "New Students",
  //     value: newStudents.toString(),
  //     icon: UserPlus,
  //     color: "text-emerald-500",
  //     bg: "bg-emerald-50",
  //   },
  //   {
  //     label: "Unread",
  //     value: unreadMessages.toString(),
  //     icon: MessageSquare,
  //     color: "text-purple-500",
  //     bg: "bg-purple-50",
  //   },
  // ];

  const overviewStats = [
    totalLessons !== undefined && {
      label: "Total Lessons",
      value: totalLessons.toLocaleString(),
      icon: BookOpen,
      color: "text-[#ff7c22]",
      bg: "bg-[#ff7c22]/10",
    },
    totalStudents !== undefined && {
      label: "Total Students",
      value: totalStudents.toString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    averageRating !== undefined && {
      label: "Rating",
      value: averageRating.toFixed(1),
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    completionRate !== undefined && {
      label: "Completion",
      value: `${completionRate}%`,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    icon: typeof BookOpen;
    color: string;
    bg: string;
  }[];

  return (
    <div className="space-y-3">
      {/* Quick daily stats */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3.5"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className={`w-6 h-6 rounded-lg ${stat.bg} flex items-center justify-center`}
                >
                  <Icon size={12} className={stat.color} />
                </div>
                <span className="text-[10px] text-[#0B2343]/30 font-medium">
                  {stat.label}
                </span>
              </div>
              <p className="text-lg font-bold text-[#0B2343]">{stat.value}</p>
            </div>
          );
        })}
      </div> */}

      {/* Overview stats from API */}
      {overviewStats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3.5"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-6 h-6 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <Icon size={12} className={stat.color} />
                  </div>
                  <span className="text-[10px] text-[#0B2343]/30 font-medium">
                    {stat.label}
                  </span>
                </div>
                <p className="text-lg font-bold text-[#0B2343]">{stat.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
