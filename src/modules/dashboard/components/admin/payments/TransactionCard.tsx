// ── src/modules/dashboard/components/admin/payments/TransactionCard.tsx ──

import React from "react";
import { CreditCard, RotateCcw, Zap, AlertTriangle } from "lucide-react";
import type { AdminTransaction } from "../../../data/admin/adminPaymentsData";

interface Props {
  transaction: AdminTransaction;
  onClick: (txn: AdminTransaction) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  pending: { label: "Pending", bg: "bg-blue-50", text: "text-blue-600" },
  refunded: { label: "Refunded", bg: "bg-red-50", text: "text-red-500" },
  failed: { label: "Failed", bg: "bg-red-50", text: "text-red-600" },
};

const typeConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  lesson_payment: {
    label: "Payment",
    icon: CreditCard,
    color: "text-emerald-500",
  },
  refund: { label: "Refund", icon: RotateCcw, color: "text-red-500" },
  trial: { label: "Trial", icon: Zap, color: "text-[#ff7c22]" },
};

const methodLabels: Record<string, string> = {
  card: "Card",
  paypal: "PayPal",
  bank_transfer: "Bank",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function TransactionCard({ transaction: txn, onClick }: Props) {
  const status = statusConfig[txn.status] || statusConfig.completed;
  const type = typeConfig[txn.type] || typeConfig.lesson_payment;
  const TypeIcon = type.icon;

  return (
    <button
      onClick={() => onClick(txn)}
      className={`w-full text-left bg-white rounded-2xl border transition-all hover:shadow-sm hover:border-[#0B2343]/[0.12] cursor-pointer ${
        txn.flagged
          ? "border-amber-200 bg-amber-50/30"
          : "border-[#0B2343]/[0.06]"
      }`}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div
            className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
              txn.type === "refund"
                ? "bg-red-50"
                : txn.type === "trial"
                  ? "bg-[#ff7c22]/10"
                  : "bg-emerald-50"
            }`}
          >
            <TypeIcon size={16} className={type.color} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                {/* ─── CHANGED: optional chaining fallback ─── */}
                <p className="text-xs sm:text-sm font-semibold text-[#0B2343] truncate">
                  {txn.lessonTopic ?? "Lesson"}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                  {txn.id} · {timeAgo(txn.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {txn.flagged && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600">
                    <AlertTriangle size={10} />
                    <span className="text-[9px] font-medium hidden sm:inline">
                      Flagged
                    </span>
                  </span>
                )}
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium ${status.bg} ${status.text}`}
                >
                  {status.label}
                </span>
              </div>
            </div>

            {/* Participants */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-[10px] sm:text-[11px] text-[#0B2343]/60">
                <span className="text-[#0B2343]/40">Student:</span>{" "}
                {txn.studentName}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#0B2343]/60">
                <span className="text-[#0B2343]/40">Tutor:</span>{" "}
                {txn.tutorName}
              </span>
            </div>

            {/* Bottom row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              <span className="text-xs sm:text-sm font-semibold text-[#0B2343]">
                {txn.amount > 0 ? `£${txn.amount.toFixed(2)}` : "Free"}
              </span>
              {txn.commission > 0 && (
                <span className="text-[10px] sm:text-[11px] text-[#ff7c22] font-medium">
                  £{txn.commission.toFixed(2)} commission
                </span>
              )}
              <span className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
                {methodLabels[txn.paymentMethod]} · {formatDate(txn.lessonDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
