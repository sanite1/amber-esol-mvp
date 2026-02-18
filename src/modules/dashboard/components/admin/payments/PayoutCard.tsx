// ── src/modules/dashboard/components/admin/payments/PayoutCard.tsx ──

import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader,
} from "lucide-react";
import type { AdminPayout } from "../../../data/admin/adminPaymentsData";

interface Props {
  payout: AdminPayout;
  onClick: (payout: AdminPayout) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: Loader,
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    bg: "bg-red-50",
    text: "text-red-600",
    icon: XCircle,
  },
  flagged: {
    label: "Flagged",
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: AlertTriangle,
  },
};

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  paypal: "PayPal",
  wise: "Wise",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div className="w-full h-full rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-[#0B2343]/50">
      {initials}
    </div>
  );
}

export default function PayoutCard({ payout, onClick }: Props) {
  const status = statusConfig[payout.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <button
      onClick={() => onClick(payout)}
      className={`w-full text-left bg-white rounded-2xl border transition-all hover:shadow-sm hover:border-[#0B2343]/[0.12] cursor-pointer ${
        payout.status === "flagged"
          ? "border-amber-200 bg-amber-50/30"
          : payout.status === "pending"
            ? "border-blue-100"
            : "border-[#0B2343]/[0.06]"
      }`}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11">
            <Initials name={payout.tutorName} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[#0B2343] truncate">
                  {payout.tutorName}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {payout.id} · {timeAgo(payout.requestedAt)}
                </p>
              </div>
              <span
                className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-md ${status.bg} ${status.text} text-[9px] sm:text-[10px] font-medium`}
              >
                <StatusIcon size={10} />
                {status.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-sm sm:text-base font-bold text-[#0B2343]">
                £{payout.amount.toFixed(2)}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                {methodLabels[payout.method]}
              </span>
              {/* ─── CHANGED: guard optional fields ─── */}
              {payout.lessonsCount != null && (
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {payout.lessonsCount} lessons
                </span>
              )}
              {payout.periodStart && payout.periodEnd && (
                <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {formatDate(payout.periodStart)} –{" "}
                  {formatDate(payout.periodEnd)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
