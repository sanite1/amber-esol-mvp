import {
  X,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  Calendar,
  CreditCard,
  Hash,
  FileText,
} from "lucide-react";
import type { PayoutRecord } from "../../../data/tutor/tutorEarningsData";

interface Props {
  payout: PayoutRecord;
  onClose: () => void;
}

const statusConfig: Record<
  PayoutRecord["status"],
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  completed: {
    label: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    color: "text-blue-500",
    bg: "bg-blue-50",
    icon: Loader2,
  },
  failed: {
    label: "Failed",
    color: "text-red-500",
    bg: "bg-red-50",
    icon: AlertTriangle,
  },
  scheduled: {
    label: "Scheduled",
    color: "text-[#0B2343]/40",
    bg: "bg-[#0B2343]/[0.04]",
    icon: Calendar,
  },
};

export default function PayoutDetailModal({ payout, onClose }: Props) {
  const sc = statusConfig[payout.status];
  const Icon = sc.icon;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* ── Backdrop ── */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ── Modal shell ── */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[70vh] flex flex-col">
        {/* ── Fixed header ── */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] shrink-0">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343]">
            Payout Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Amount + status */}
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[#0B2343]">
              £{payout.amount.toLocaleString()}
            </p>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mt-2 ${sc.bg}`}
            >
              <Icon
                size={12}
                className={`${sc.color} ${payout.status === "processing" ? "animate-spin" : ""}`}
              />
              <span className={`text-[11px] font-semibold ${sc.color}`}>
                {sc.label}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <Hash size={12} className="text-[#0B2343]/25" />
                Reference
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                {payout.reference}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <CreditCard size={12} className="text-[#0B2343]/25" />
                Method
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                {payout.method}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <Calendar size={12} className="text-[#0B2343]/25" />
                Requested
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                {formatDate(payout.requestedDate)}
              </span>
            </div>
            {payout.completedDate && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-50/50">
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-600/60">
                  <CheckCircle2 size={12} />
                  Completed
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-600">
                  {formatDate(payout.completedDate)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0B2343]/[0.015]">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
                <FileText size={12} className="text-[#0B2343]/25" />
                Lessons Included
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-[#0B2343]">
                {payout.entries.length}{" "}
                {payout.entries.length === 1 ? "lesson" : "lessons"}
              </span>
            </div>
          </div>

          {/* Status-specific notices */}
          {payout.status === "processing" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 border border-blue-100/60">
              <Loader2
                size={14}
                className="text-blue-400 mt-0.5 shrink-0 animate-spin"
              />
              <p className="text-[11px] text-blue-600 leading-relaxed">
                This payout is being processed. It usually takes 2–3 business
                days to arrive in your account.
              </p>
            </div>
          )}
          {payout.status === "scheduled" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0B2343]/[0.02] border border-[#0B2343]/[0.06]">
              <Calendar
                size={14}
                className="text-[#0B2343]/25 mt-0.5 shrink-0"
              />
              <p className="text-[11px] text-[#0B2343]/40 leading-relaxed">
                This payout is scheduled for {formatDate(payout.requestedDate)}.
                It will be processed automatically.
              </p>
            </div>
          )}
          {payout.status === "failed" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50/50 border border-red-100/60">
              <AlertTriangle
                size={14}
                className="text-red-400 mt-0.5 shrink-0"
              />
              <p className="text-[11px] text-red-600 leading-relaxed">
                This payout failed. Please check your payout settings and try
                again, or contact support.
              </p>
            </div>
          )}
        </div>

        {/* ── Fixed footer ── */}
        <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
