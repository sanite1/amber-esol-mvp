import { Clock, CalendarCheck, CalendarX2, CalendarClock } from "lucide-react";
import type { AvailabilitySummary as SummaryType } from "../../../data/tutor/tutorAvailabilityData";

interface Props {
  summary: SummaryType;
}

export default function AvailabilitySummary({ summary }: Props) {
  const items = [
    {
      label: "Weekly Hours",
      value: `${summary.totalWeeklyHours}h`,
      icon: Clock,
      color: "text-[#ff7c22]",
      bg: "bg-[#ff7c22]/10",
    },
    {
      label: "Booked",
      value: `${summary.bookedThisWeek}h`,
      icon: CalendarCheck,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Open",
      value: `${summary.openThisWeek}h`,
      icon: CalendarClock,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Overrides",
      value: summary.overridesThisMonth,
      icon: CalendarX2,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              <span className="text-[9px] text-[#0B2343]/30 font-medium">
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
