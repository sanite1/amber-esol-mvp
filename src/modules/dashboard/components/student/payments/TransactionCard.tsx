import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  ChevronDown,
  Calendar,
  Clock,
  User,
  AlertTriangle,
} from "lucide-react";
import type { Transaction } from "../../../data/student/paymentsData";

interface Props {
  transaction: Transaction;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  completed: { label: "Paid", color: "text-green-700", bg: "bg-green-50" },
  pending: {
    label: "Processing",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  refunded: { label: "Refunded", color: "text-blue-700", bg: "bg-blue-50" },
  failed: { label: "Failed", color: "text-red-700", bg: "bg-red-50" },
};

export default function TransactionCard({ transaction: txn }: Props) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[txn.status];
  const isRefund = txn.type === "refund";

  const paymentDate = new Date(txn.date);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dateLabel =
    diffDays === 0
      ? "Today"
      : diffDays === 1
        ? "Yesterday"
        : diffDays < 7
          ? `${diffDays} days ago`
          : paymentDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year:
                paymentDate.getFullYear() !== now.getFullYear()
                  ? "numeric"
                  : undefined,
            });

  const upcomingSessions = txn.sessions.filter((s) => {
    const sDate = new Date(s.date);
    const [eH, eM] = s.endTime.split(":").map(Number);
    const sEnd = new Date(sDate);
    sEnd.setHours(eH, eM, 0, 0);
    return sEnd >= now;
  }).length;
  const completedSessions = txn.sessions.length - upcomingSessions;

  return (
    <div
      className={`rounded-xl border transition-colors ${
        expanded
          ? "border-[#0B2343]/[0.08] bg-white shadow-sm"
          : "border-[#0B2343]/[0.04] bg-white hover:border-[#0B2343]/[0.08]"
      }`}
    >
      {/* ── Collapsed row ── */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 sm:p-4"
      >
        {/* Desktop: single row */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-xs font-semibold text-[#0B2343]/40">
            {txn.tutorAvatar ? (
              <img
                src={txn.tutorAvatar}
                alt={txn.tutorName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              txn.tutorName
                .split(" ")
                .map((n) => n[0])
                .join("")
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-[#0B2343]/80 truncate">
                {isRefund ? "Refund" : "Lesson Booking"}, {txn.tutorName}
              </p>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}
              >
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-[#0B2343]/35">
              <span>{dateLabel}</span>
              <span>·</span>
              <span>
                {txn.hoursBooked} hr{txn.hoursBooked !== 1 ? "s" : ""} × £
                {txn.hourlyRate}/hr
              </span>
              {upcomingSessions > 0 && txn.status !== "refunded" && (
                <>
                  <span>·</span>
                  <span className="text-[#ff7c22] font-medium">
                    {upcomingSessions} upcoming
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0 mr-1">
            <p
              className={`text-sm font-bold ${
                isRefund ? "text-green-600" : "text-[#0B2343]"
              }`}
            >
              {isRefund ? "+" : "-"}£{txn.totalAmount}
            </p>
          </div>

          {/* Chevron */}
          <ChevronDown
            size={14}
            className={`text-[#0B2343]/20 shrink-0 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Mobile: stacked layout */}
        <div className="flex sm:hidden flex-col gap-2.5">
          {/* Top: avatar + name + chevron */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center shrink-0 text-[11px] font-semibold text-[#0B2343]/40">
              {txn.tutorAvatar ? (
                <img
                  src={txn.tutorAvatar}
                  alt={txn.tutorName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                txn.tutorName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0B2343]/80 truncate">
                {isRefund ? "Refund" : "Booking"}, {txn.tutorName}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-[#0B2343]/20 shrink-0 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Bottom: status + meta + amount */}
          <div className="flex items-center justify-between ml-[46px]">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}
              >
                {status.label}
              </span>
              <span className="text-[11px] text-[#0B2343]/30">{dateLabel}</span>
              {upcomingSessions > 0 && txn.status !== "refunded" && (
                <span className="text-[10px] text-[#ff7c22] font-medium">
                  {upcomingSessions} upcoming
                </span>
              )}
            </div>
            <p
              className={`text-[13px] font-bold shrink-0 ${
                isRefund ? "text-green-600" : "text-[#0B2343]"
              }`}
            >
              {isRefund ? "+" : "-"}£{txn.totalAmount}
            </p>
          </div>

          {/* Hours breakdown - mobile */}
          <div className="ml-[46px]">
            <span className="text-[11px] text-[#0B2343]/25">
              {txn.hoursBooked} hr{txn.hoursBooked !== 1 ? "s" : ""} × £
              {txn.hourlyRate}/hr
            </span>
          </div>
        </div>
      </button>

      {/* ── Expanded details ── */}
      {expanded && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
          <div className="border-t border-[#0B2343]/[0.04] pt-3 sm:pt-4">
            {/* Refund reason */}
            {txn.refundReason && (
              <div className="flex items-start gap-2 mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-blue-50/50">
                <AlertTriangle
                  size={13}
                  className="text-blue-500 shrink-0 mt-0.5"
                />
                <p className="text-[11px] sm:text-xs text-blue-700">
                  {txn.refundReason}
                </p>
              </div>
            )}

            {/* Session schedule */}
            <div className="mb-3 sm:mb-4">
              <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]/50 mb-2 sm:mb-2.5">
                Sessions ({completedSessions} completed, {upcomingSessions}{" "}
                upcoming)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {txn.sessions.map((session, i) => {
                  const sessionDate = new Date(session.date);
                  const [endH, endM] = session.endTime.split(":").map(Number);
                  const sessionEnd = new Date(sessionDate);
                  sessionEnd.setHours(endH, endM, 0, 0);
                  const isPast = sessionEnd < now;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] sm:text-xs ${
                        isPast
                          ? "bg-[#0B2343]/[0.02] text-[#0B2343]/30"
                          : "bg-[#ff7c22]/[0.03] text-[#0B2343]/60"
                      }`}
                    >
                      <Calendar
                        size={11}
                        className={`shrink-0 ${
                          isPast ? "text-[#0B2343]/15" : "text-[#ff7c22]/50"
                        }`}
                      />
                      <span className="whitespace-nowrap">
                        {sessionDate.toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <Clock
                        size={11}
                        className={`shrink-0 ${
                          isPast ? "text-[#0B2343]/15" : "text-[#ff7c22]/50"
                        }`}
                      />
                      <span className="whitespace-nowrap">
                        {session.startTime} – {session.endTime}
                      </span>
                      {isPast && (
                        <span className="ml-auto text-[10px] text-green-500 font-medium">
                          Done
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-[#0B2343]/[0.04]">
              <Link
                to={`/tutors/${txn.id}`}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#ff7c22] hover:underline"
              >
                <User size={12} />
                View Tutor Profile
              </Link>

              {txn.receiptUrl && (
                <a
                  href={txn.receiptUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2343]/[0.03] text-[11px] sm:text-xs text-[#0B2343]/40 hover:bg-[#0B2343]/[0.06] transition-colors w-fit"
                >
                  <Download size={12} />
                  Receipt
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
