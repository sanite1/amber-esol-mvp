import { Link } from "react-router-dom";
import { UserCheck, Flag, CreditCard, BookOpen, Settings } from "lucide-react";

interface Props {
  pendingApprovals: number;
  reportedReviews: number;
  pendingPayouts: number;
}

export default function QuickActionsCard({
  pendingApprovals,
  reportedReviews,
  pendingPayouts,
}: Props) {
  const actions = [
    {
      label: "Review Tutor Applications",
      count: pendingApprovals,
      icon: UserCheck,
      link: "/admin/tutors?status=pending",
      color: "text-amber-500",
      bg: "bg-amber-50",
      show: pendingApprovals > 0,
    },
    {
      label: "Handle Reported Reviews",
      count: reportedReviews,
      icon: Flag,
      link: "/admin/reviews?filter=reported",
      color: "text-red-500",
      bg: "bg-red-50",
      show: reportedReviews > 0,
    },
    {
      label: "Process Pending Payouts",
      count: pendingPayouts,
      icon: CreditCard,
      link: "/admin/payments?tab=payouts&status=pending",
      color: "text-blue-500",
      bg: "bg-blue-50",
      show: pendingPayouts > 0,
    },
    {
      label: "View All Lessons",
      icon: BookOpen,
      link: "/admin/lessons",
      color: "text-[#ff7c22]",
      bg: "bg-[#ff7c22]/10",
      show: true,
    },
    {
      label: "Platform Settings",
      icon: Settings,
      link: "/admin/settings",
      color: "text-[#0B2343]/40",
      bg: "bg-[#0B2343]/[0.04]",
      show: true,
    },
  ];

  const visible = actions.filter((a) => a.show);

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] mb-3">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {visible.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.link}
              className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-lg border border-[#0B2343]/[0.04] hover:border-[#0B2343]/[0.1] transition-colors group"
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}
              >
                <Icon size={15} className={action.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/60 group-hover:text-[#0B2343] transition-colors truncate">
                  {action.label}
                </p>
                {action.count !== undefined && action.count > 0 && (
                  <p
                    className={`text-[10px] font-semibold mt-0.5 ${action.color}`}
                  >
                    {action.count} pending
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
