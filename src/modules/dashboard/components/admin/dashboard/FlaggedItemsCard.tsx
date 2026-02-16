import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Flag,
  UserCheck,
  CreditCard,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import type { FlaggedItem } from "../../../data/admin/adminDashboardData";

interface Props {
  items: FlaggedItem[];
}

const typeConfig: Record<
  FlaggedItem["type"],
  { icon: typeof Flag; color: string; bg: string; link: string }
> = {
  reported_review: {
    icon: Flag,
    color: "text-red-500",
    bg: "bg-red-50",
    link: "/admin/reviews",
  },
  pending_approval: {
    icon: UserCheck,
    color: "text-amber-500",
    bg: "bg-amber-50",
    link: "/admin/tutors",
  },
  failed_payout: {
    icon: CreditCard,
    color: "text-red-500",
    bg: "bg-red-50",
    link: "/admin/payments",
  },
  dispute: {
    icon: MessageSquare,
    color: "text-orange-500",
    bg: "bg-orange-50",
    link: "/admin/lessons",
  },
};

const severityColors: Record<string, string> = {
  low: "bg-[#0B2343]/[0.04] text-[#0B2343]/30",
  medium: "bg-amber-50 text-amber-600",
  high: "bg-red-50 text-red-500",
};

export default function FlaggedItemsCard({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] mb-4 flex items-center gap-2">
          <AlertTriangle size={14} className="text-[#0B2343]/30" />
          Flagged Items
        </h3>
        <div className="py-6 text-center">
          <AlertTriangle size={20} className="text-emerald-300 mx-auto mb-2" />
          <p className="text-xs text-[#0B2343]/25">
            No flagged items. All clear!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-red-100/60 p-3 sm:p-4 md:p-5">
      <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] mb-3 flex items-center gap-2">
        <AlertTriangle size={14} className="text-red-400" />
        Flagged Items
        <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
          {items.length}
        </span>
      </h3>

      <div className="space-y-2">
        {items.map((item) => {
          const tc = typeConfig[item.type];
          const Icon = tc.icon;
          const diffHrs = Math.floor(
            (Date.now() - new Date(item.date).getTime()) / 3600000
          );
          const timeLabel =
            diffHrs < 1
              ? "Just now"
              : diffHrs < 24
                ? `${diffHrs}h ago`
                : `${Math.floor(diffHrs / 24)}d ago`;

          return (
            <Link
              key={item.id}
              to={tc.link}
              className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-[#0B2343]/[0.04] hover:border-[#0B2343]/[0.1] transition-colors group"
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${tc.bg} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon size={14} className={tc.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[11px] sm:text-xs font-semibold text-[#0B2343] truncate">
                    {item.title}
                  </p>
                  <span
                    className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${severityColors[item.severity]}`}
                  >
                    {item.severity}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/30 mt-0.5 line-clamp-1">
                  {item.description}
                </p>
                <p className="text-[9px] text-[#0B2343]/20 mt-1">{timeLabel}</p>
              </div>
              <ChevronRight
                size={14}
                className="text-[#0B2343]/15 shrink-0 mt-1 group-hover:text-[#ff7c22] transition-colors"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
