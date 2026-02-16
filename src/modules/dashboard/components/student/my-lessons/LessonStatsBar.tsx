import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
} from "lucide-react";
import { LessonStats } from "../../../data/student/myLessonsData";

interface Props {
  stats: LessonStats;
}

export default function LessonStatsBar({ stats }: Props) {
  const cards = [
    {
      label: "Total",
      value: stats.totalLessons,
      icon: BookOpen,
      color: "bg-[#ff7c22]/10 text-[#ff7c22]",
    },
    {
      label: "Upcoming",
      value: stats.upcomingLessons,
      icon: CalendarCheck,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Completed",
      value: stats.completedLessons,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Cancelled",
      value: stats.cancelledLessons,
      icon: XCircle,
      color: "bg-red-50 text-red-400",
    },
    {
      label: "Hours",
      value: stats.totalHours,
      icon: Clock,
      color: "bg-purple-50 text-purple-500",
    },
    {
      label: "Total Spent",
      value: `£${stats.totalSpent}`,
      icon: Wallet,
      color: "bg-[#0B2343]/[0.05] text-[#0B2343]/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 hover:border-[#0B2343]/10 transition-colors"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${card.color}`}
          >
            <card.icon size={15} />
          </div>
          <p className="text-xl font-bold text-[#0B2343] tabular-nums leading-tight">
            {card.value}
          </p>
          <p className="text-[10px] text-[#0B2343]/35 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
