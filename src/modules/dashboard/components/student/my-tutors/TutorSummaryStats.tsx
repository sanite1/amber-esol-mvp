import { Users, BookOpen, Star, Heart } from "lucide-react";
import { MyTutorsSummary } from "../../../lib/types/myTutors";

interface Props {
  summary: MyTutorsSummary;
}

export default function TutorSummaryStats({ summary }: Props) {
  const cards = [
    {
      label: "Total Tutors",
      value: summary.totalTutors,
      icon: Users,
      color: "bg-[#ff7c22]/10 text-[#ff7c22]",
    },
    {
      label: "Active Now",
      value: summary.activeTutors,
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      label: "Lessons Taken",
      value: summary.totalLessons,
      icon: Star,
      color: "bg-blue-50 text-blue-500",
    },
    {
      label: "Favourites",
      value: summary.favourites,
      icon: Heart,
      color: "bg-pink-50 text-pink-500",
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
