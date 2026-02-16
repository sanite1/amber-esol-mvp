import { Link } from "react-router-dom";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";
import type { RecentTransaction } from "../../../data/admin/adminDashboardData";

interface Props {
  transactions: RecentTransaction[];
}

const typeConfig: Record<
  string,
  { icon: typeof ArrowUpRight; color: string; bg: string; label: string }
> = {
  payment: {
    icon: ArrowUpRight,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    label: "Payment",
  },
  refund: {
    icon: ArrowDownLeft,
    color: "text-red-400",
    bg: "bg-red-50",
    label: "Refund",
  },
  payout: {
    icon: RefreshCw,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "Payout",
  },
};

const statusColors: Record<string, string> = {
  completed: "text-emerald-600 bg-emerald-50",
  pending: "text-amber-500 bg-amber-50",
  processing: "text-blue-500 bg-blue-50",
  failed: "text-red-500 bg-red-50",
};

export default function RecentTransactionsCard({ transactions }: Props) {
  const formatTime = (ts: string) => {
    const diffHrs = Math.floor((Date.now() - new Date(ts).getTime()) / 3600000);
    if (diffHrs < 1) return "Just now";
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] flex items-center gap-2">
          <CreditCard size={14} className="text-[#0B2343]/30" />
          Recent Transactions
        </h3>
        <Link
          to="/admin/payments"
          className="text-[10px] sm:text-[11px] font-medium text-[#ff7c22] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-1.5">
        {transactions.slice(0, 5).map((tx) => {
          const tc = typeConfig[tx.type] || typeConfig.payment;
          const Icon = tc.icon;
          return (
            <Link
              key={tx.id}
              to={`/admin/payments`}
              className="flex items-center gap-2.5 py-2 px-2 sm:px-2.5 rounded-lg hover:bg-[#0B2343]/[0.02] transition-colors group"
            >
              <div
                className={`w-8 h-8 rounded-lg ${tc.bg} flex items-center justify-center shrink-0`}
              >
                <Icon size={13} className={tc.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/70 truncate">
                  {tx.type === "payout"
                    ? `Payout → ${tx.tutorName}`
                    : tx.type === "refund"
                      ? `Refund → ${tx.studentName}`
                      : `${tx.studentName} → ${tx.tutorName}`}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${statusColors[tx.status]}`}
                  >
                    {tx.status}
                  </span>
                  <span className="text-[9px] text-[#0B2343]/20">
                    {formatTime(tx.date)}
                  </span>
                </div>
              </div>
              <p
                className={`text-[11px] sm:text-xs font-bold shrink-0 ${
                  tx.type === "refund" ? "text-red-400" : "text-[#0B2343]/60"
                }`}
              >
                {tx.type === "refund" ? "-" : ""}£{tx.amount.toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
