import {
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import type { PayoutRecord } from "../../../data/tutor/tutorEarningsData";

interface Props {
  payouts: PayoutRecord[];
  onViewPayout: (payout: PayoutRecord) => void;
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

export default function PayoutsSection({ payouts, onViewPayout }: Props) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? payouts : payouts.slice(0, 3);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] mb-3">
        Payout History
      </h3>

      {payouts.length === 0 ? (
        <p className="text-xs text-[#0B2343]/25 text-center py-4">
          No payouts yet.
        </p>
      ) : (
        <div className="space-y-2">
          {displayed.map((po) => {
            const sc = statusConfig[po.status];
            const Icon = sc.icon;
            return (
              <button
                key={po.id}
                onClick={() => onViewPayout(po)}
                className="w-full text-left flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-[#0B2343]/[0.04] hover:border-[#0B2343]/[0.1] transition-colors"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${sc.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon
                    size={14}
                    className={`${sc.color} ${po.status === "processing" ? "animate-spin" : ""}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-[13px] font-semibold text-[#0B2343]">
                      £{po.amount.toLocaleString()}
                    </p>
                    <span
                      className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${sc.bg} ${sc.color}`}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#0B2343]/30 mt-0.5 truncate">
                    {po.method} · {po.reference} ·{" "}
                    {formatDate(po.requestedDate)}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className="text-[#0B2343]/15 shrink-0 -rotate-90"
                />
              </button>
            );
          })}
        </div>
      )}

      {payouts.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 mx-auto mt-3 text-[11px] sm:text-xs font-medium text-[#ff7c22] hover:underline"
        >
          {showAll ? "Show less" : `View all ${payouts.length} payouts`}
          <ChevronDown
            size={12}
            className={`transition-transform ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
