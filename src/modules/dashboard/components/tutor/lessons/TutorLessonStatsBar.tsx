import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  PoundSterling,
} from "lucide-react";
import type { TutorLessonStats } from "../../../data/tutor/tutorLessonsData";

interface Props {
  stats: TutorLessonStats;
}

export default function TutorLessonStatsBar({ stats }: Props) {
  const currentMonth = new Date().toLocaleDateString("en-GB", {
    month: "short",
  });

  const items = [
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: CalendarCheck,
      color: "text-[#ff7c22]",
      bg: "bg-[#ff7c22]/10",
    },
    {
      label: "Completed",
      value: stats.completed.toLocaleString(),
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-50",
    },
    {
      label: "No Shows",
      value: stats.noShows,
      icon: BookOpen,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: `${currentMonth} Hours`,
      value: `${stats.hoursThisMonth}h`,
      icon: Clock,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: `${currentMonth} Earned`,
      value: `£${stats.earningsThisMonth}`,
      icon: PoundSterling,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div
                className={`w-5 h-5 rounded ${item.bg} flex items-center justify-center`}
              >
                <Icon size={10} className={item.color} />
              </div>
              <span className="text-[9px] text-[#0B2343]/30 font-medium truncate">
                {item.label}
              </span>
            </div>
            <p className="text-base font-bold text-[#0B2343]">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}
