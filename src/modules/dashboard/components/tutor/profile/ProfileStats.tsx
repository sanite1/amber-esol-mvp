import { BookOpen, Users, Star, Clock } from "lucide-react";
import type { TutorProfileStats } from "../../../data/tutor/tutorProfileData";

interface Props {
  stats: TutorProfileStats;
}

const items = [
  {
    key: "totalLessons" as const,
    label: "Lessons",
    icon: BookOpen,
    color: "text-[#ff7c22]",
    bg: "bg-[#ff7c22]/10",
  },
  {
    key: "totalStudents" as const,
    label: "Students",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    key: "averageRating" as const,
    label: "Rating",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    key: "totalHours" as const,
    label: "Hours Taught",
    icon: Clock,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

export default function ProfileStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        const raw = stats[item.key];
        const display =
          item.key === "averageRating"
            ? `${raw} ★`
            : item.key === "totalHours"
              ? `${raw.toLocaleString()}h`
              : raw.toLocaleString();

        return (
          <div
            key={item.key}
            className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3"
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-bold text-[#0B2343]">
                {display}
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40 truncate">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
