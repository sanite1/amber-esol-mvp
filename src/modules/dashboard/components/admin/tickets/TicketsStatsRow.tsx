import React from "react";
import {
  Ticket,
  Inbox,
  Clock,
  Hourglass,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import type { AdminTicketsStats } from "../../../data/admin/adminTicketsData";

interface Props {
  stats: AdminTicketsStats;
}

export default function TicketsStatsRow({ stats }: Props) {
  const cards = [
    {
      label: "Open",
      value: stats.openTickets.toString(),
      sub: `${stats.urgentTickets} urgent`,
      icon: Inbox,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "In Progress",
      value: stats.inProgressTickets.toString(),
      sub: "assigned to admin",
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: "Awaiting User",
      value: stats.awaitingUserTickets.toString(),
      sub: "waiting for reply",
      icon: Hourglass,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      label: "Resolved",
      value: stats.resolvedTickets.toString(),
      sub: `${stats.closedTickets} closed`,
      icon: CheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "This Week",
      value: stats.ticketsThisWeek.toString(),
      sub: `${stats.studentTickets} student · ${stats.tutorTickets} tutor`,
      icon: Ticket,
      iconBg: "bg-[#0B2343]/[0.06]",
      iconColor: "text-[#0B2343]",
    },
    {
      label: "Avg Response",
      value: `${stats.avgResponseTimeHours}h`,
      sub: `${stats.avgResolutionTimeHours}h avg resolution`,
      icon: AlertTriangle,
      iconBg: "bg-[#ff7c22]/10",
      iconColor: "text-[#ff7c22]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-3 sm:p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}
              >
                <Icon size={14} className={card.iconColor} />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 leading-tight">
                {card.label}
              </span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-[#0B2343] leading-none mb-0.5">
              {card.value}
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
              {card.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
