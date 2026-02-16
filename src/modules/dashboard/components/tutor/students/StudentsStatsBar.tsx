import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";
import type { TutorStudentsStats } from "../../../data/tutor/tutorStudentsData";

interface Props {
  stats: TutorStudentsStats;
}

const items = [
  {
    key: "activeStudents" as const,
    label: "Active",
    icon: UserCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    key: "trialStudents" as const,
    label: "Trial",
    icon: UserPlus,
    color: "text-[#ff7c22]",
    bg: "bg-[#ff7c22]/10",
  },
  {
    key: "inactiveStudents" as const,
    label: "Inactive",
    icon: Users,
    color: "text-[#0B2343]/40",
    bg: "bg-[#0B2343]/5",
  },
  {
    key: "retentionRate" as const,
    label: "Retention",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
];

export default function StudentsStatsBar({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];
        const display = item.key === "retentionRate" ? `${value}%` : value;
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
