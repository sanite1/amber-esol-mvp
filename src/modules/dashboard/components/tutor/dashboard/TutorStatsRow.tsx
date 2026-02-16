import { BookOpen, CalendarDays, UserPlus, MessageSquare } from "lucide-react";

interface Props {
  todayLessons: number;
  weekLessons: number;
  newStudents: number;
  unreadMessages: number;
}

export default function TutorStatsRow({
  todayLessons,
  weekLessons,
  newStudents,
  unreadMessages,
}: Props) {
  const stats = [
    {
      label: "Today",
      value: todayLessons,
      icon: BookOpen,
      color: "text-[#ff7c22]",
      bg: "bg-[#ff7c22]/10",
    },
    {
      label: "This Week",
      value: weekLessons,
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "New Students",
      value: newStudents,
      icon: UserPlus,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Unread",
      value: unreadMessages,
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <Icon size={13} className={stat.color} />
              </div>
              <span className="text-[11px] text-[#0B2343]/35 font-medium">
                {stat.label}
              </span>
            </div>
            <p className="text-xl font-bold text-[#0B2343]">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
