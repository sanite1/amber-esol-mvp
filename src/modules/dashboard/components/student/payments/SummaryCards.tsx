import {
  PoundSterling,
  Clock,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import type { PaymentsSummary } from "../../../data/student/paymentsData";

interface Props {
  summary: PaymentsSummary;
}

export default function SummaryCards({ summary }: Props) {
  const currentMonth = new Date().toLocaleDateString("en-GB", {
    month: "short",
  });

  const cards = [
    {
      label: `Spent in ${currentMonth}`,
      value: `£${summary.thisMonthSpent}`,
      sub: "This month",
      icon: PoundSterling,
      iconBg: "bg-[#ff7c22]/10",
      iconColor: "text-[#ff7c22]",
    },
    {
      label: "Total Spent",
      value: `£${summary.totalSpent}`,
      sub: "All time",
      icon: PoundSterling,
      iconBg: "bg-[#0B2343]/[0.05]",
      iconColor: "text-[#0B2343]/40",
    },
    {
      label: "Hours Booked",
      value: `${summary.totalHoursBooked}h`,
      sub: `${summary.totalLessonsCompleted} lessons completed`,
      icon: Clock,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      label: "Upcoming Value",
      value: `£${summary.upcomingLessonsValue}`,
      sub: "Scheduled lessons",
      icon: CalendarClock,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center`}
              >
                <Icon size={14} className={card.iconColor} />
              </div>
              <span className="text-xs text-[#0B2343]/40 font-medium">
                {card.label}
              </span>
            </div>
            <p className="text-xl font-bold text-[#0B2343]">{card.value}</p>
            <p className="text-[11px] text-[#0B2343]/30 mt-1">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
