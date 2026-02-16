import { BookOpen, Users, Award, CheckCircle2 } from "lucide-react";
import type { TutorDetail } from "../../../data/student/tutorDetailData";

interface Props {
  tutor: TutorDetail;
}

export default function TutorStats({ tutor }: Props) {
  const stats = [
    {
      label: "Lessons",
      value: tutor.totalLessons.toLocaleString(),
      icon: BookOpen,
      color: "text-[#ff7c22]",
      bg: "bg-[#ff7c22]/10",
    },
    {
      label: "Students",
      value: tutor.totalStudents.toString(),
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Experience",
      value: `${tutor.yearsExperience} yrs`,
      icon: Award,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Completion",
      value: `${tutor.completionRate}%`,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <Icon size={14} className={stat.color} />
              </div>
              <span className="text-[11px] text-[#0B2343]/35 font-medium">
                {stat.label}
              </span>
            </div>
            <p className="text-lg font-bold text-[#0B2343]">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
