import { BookOpen, CheckCircle2, Users, Zap } from "lucide-react";

interface Props {
  totalLessons: number;
  completedLessons: number;
  cancelledLessons: number;
  activeTutors: number;
}

export default function StatsGrid({
  totalLessons,
  completedLessons,
  cancelledLessons,
  activeTutors,
}: Props) {
  const cards = [
    {
      label: "Total Lessons",
      value: totalLessons,
      icon: BookOpen,
      color: "bg-[#ff7c22]/10 text-[#ff7c22]",
    },
    {
      label: "Completed",
      value: completedLessons,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Cancelled",
      value: cancelledLessons,
      icon: Zap,
      color: "bg-red-50 text-red-400",
    },
    {
      label: "Active Tutors",
      value: activeTutors,
      icon: Users,
      color: "bg-[#0B2343]/[0.06] text-[#0B2343]/60",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 hover:border-[#0B2343]/10 transition-colors"
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${card.color}`}
          >
            <card.icon size={16} />
          </div>
          <p className="text-2xl font-bold text-[#0B2343] tabular-nums">
            {card.value}
          </p>
          <p className="text-xs text-[#0B2343]/40 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
