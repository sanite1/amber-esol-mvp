import React, { useState } from "react";
import {
  X,
  CreditCard,
  RotateCcw,
  Calendar,
  Clock,
  User,
  GraduationCap,
  AlertTriangle,
  Flag,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { AdminTransaction } from "../../../data/admin/adminPaymentsData";

interface Props {
  transaction: AdminTransaction;
  onClose: () => void;
  onRefund: (txnId: string, reason: string) => void;
  onFlag: (txnId: string, reason: string) => void;
  onUnflag: (txnId: string) => void;
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

const typeLabels: Record<string, string> = {
  lesson_payment: "Lesson Payment",
  refund: "Refund",
  trial: "Trial Booking",
};

const methodLabels: Record<string, string> = {
  card: "Credit/Debit Card",
  paypal: "PayPal",
  bank_transfer: "Bank Transfer",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} at ${d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={13} className="text-[#0B2343]/40" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40 font-medium">
          {label}
        </p>
        <div className="text-xs sm:text-sm text-[#0B2343]">{value}</div>
      </div>
    </div>
  );
}

export default function TransactionDetailModal({
  transaction: txn,
  onClose,
  onRefund,
  onFlag,
  onUnflag,
}: Props) {
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refunding, setRefunding] = useState(false);
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason, setFlagReason] = useState(txn.flagReason || "");
  const [flagging, setFlagging] = useState(false);

  const status = statusConfig[txn.status] || statusConfig.completed;
  const canRefund =
    txn.status === "completed" && txn.amount > 0 && txn.type !== "refund";

  async function handleRefund() {
    if (!refundReason.trim()) return;
    setRefunding(true);
    await new Promise((r) => setTimeout(r, 600));
    onRefund(txn.id, refundReason.trim());
    setRefunding(false);
    setShowRefundForm(false);
  }

  async function handleFlag() {
    if (!flagReason.trim()) return;
    setFlagging(true);
    await new Promise((r) => setTimeout(r, 600));
    onFlag(txn.id, flagReason.trim());
    setFlagging(false);
    setShowFlagForm(false);
  }

  async function handleUnflag() {
    setFlagging(true);
    await new Promise((r) => setTimeout(r, 600));
    onUnflag(txn.id);
    setFlagging(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#0B2343]/[0.06] px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-[#0B2343] truncate">
              Transaction Details
            </h2>
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
              {txn.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0B2343]/[0.04] flex items-center justify-center hover:bg-[#0B2343]/[0.08] transition-colors shrink-0"
          >
            <X size={16} className="text-[#0B2343]/60" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg ${status.bg} ${status.text} text-[11px] sm:text-xs font-medium`}
            >
              {status.label}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#0B2343]/[0.04] text-[#0B2343]/60 text-[11px] sm:text-xs font-medium">
              {typeLabels[txn.type]}
            </span>
            {txn.flagged && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-600 text-[11px] sm:text-xs font-medium">
                <AlertTriangle size={11} />
                Flagged
              </span>
            )}
          </div>

          {/* Topic */}
          <h3 className="text-sm sm:text-base font-semibold text-[#0B2343]">
            {txn.lessonTopic}
          </h3>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow
              icon={User}
              label="Student"
              value={
                <span className="flex items-center gap-1">
                  {txn.studentName}
                  <ExternalLink size={10} className="text-[#0B2343]/30" />
                </span>
              }
            />
            <InfoRow
              icon={GraduationCap}
              label="Tutor"
              value={
                <span className="flex items-center gap-1">
                  {txn.tutorName}
                  <ExternalLink size={10} className="text-[#0B2343]/30" />
                </span>
              }
            />
            <InfoRow
              icon={Calendar}
              label="Lesson Date"
              value={formatDate(txn.lessonDate)}
            />
            <InfoRow
              icon={CreditCard}
              label="Payment Method"
              value={methodLabels[txn.paymentMethod]}
            />
            <InfoRow
              icon={Clock}
              label="Transaction Date"
              value={formatDateTime(txn.createdAt)}
            />
            {txn.refundedAt && (
              <InfoRow
                icon={RotateCcw}
                label="Refunded At"
                value={formatDateTime(txn.refundedAt)}
              />
            )}
          </div>

          {/* Financial */}
          <div className="bg-[#0B2343]/[0.02] rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2.5">
              Financial Breakdown
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] text-[#0B2343]/40">Amount</p>
                <p className="text-sm font-semibold text-[#0B2343]">
                  {txn.amount > 0 ? `£${txn.amount.toFixed(2)}` : "Free"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#0B2343]/40">Tutor Earns</p>
                <p className="text-sm font-semibold text-emerald-600">
                  £{txn.tutorEarnings.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#0B2343]/40">Commission</p>
                <p className="text-sm font-semibold text-[#ff7c22]">
                  £{txn.commission.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Refund reason */}
          {txn.refundReason && (
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-[11px] font-medium text-red-400 mb-0.5">
                Refund Reason
              </p>
              <p className="text-xs text-red-600">{txn.refundReason}</p>
            </div>
          )}

          {/* Flag reason */}
          {txn.flagged && txn.flagReason && (
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-[11px] font-medium text-amber-500 mb-0.5">
                Flag Reason
              </p>
              <p className="text-xs text-amber-700">{txn.flagReason}</p>
            </div>
          )}

          {/* ── Actions ─────────────────────────────────── */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60">
              Admin Actions
            </h4>

            {!showRefundForm && !showFlagForm && (
              <div className="flex flex-wrap gap-2">
                {txn.flagged ? (
                  <button
                    onClick={handleUnflag}
                    disabled={flagging}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-600 text-[11px] sm:text-xs font-medium hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    {flagging ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Flag size={12} />
                    )}
                    Remove Flag
                  </button>
                ) : (
                  <button
                    onClick={() => setShowFlagForm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] text-[#0B2343]/60 text-[11px] sm:text-xs font-medium hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors"
                  >
                    <Flag size={12} />
                    Flag Transaction
                  </button>
                )}
                {canRefund && (
                  <button
                    onClick={() => setShowRefundForm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] text-[#0B2343]/60 text-[11px] sm:text-xs font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <RotateCcw size={12} />
                    Issue Refund
                  </button>
                )}
              </div>
            )}

            {/* Flag form */}
            {showFlagForm && (
              <div className="bg-amber-50 rounded-xl p-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-amber-600">
                  Flag this transaction
                </p>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Reason for flagging…"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-amber-300 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowFlagForm(false);
                      setFlagReason(txn.flagReason || "");
                    }}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFlag}
                    disabled={!flagReason.trim() || flagging}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[11px] font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {flagging && <Loader2 size={11} className="animate-spin" />}
                    Flag
                  </button>
                </div>
              </div>
            )}

            {/* Refund form */}
            {showRefundForm && (
              <div className="bg-red-50 rounded-xl p-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-red-500">
                  Issue refund of{" "}
                  <span className="font-bold">£{txn.amount.toFixed(2)}</span> to{" "}
                  {txn.studentName}
                </p>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason for refund…"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-red-200 bg-white text-xs text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-red-300 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowRefundForm(false);
                      setRefundReason("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefund}
                    disabled={!refundReason.trim() || refunding}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[11px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {refunding && (
                      <Loader2 size={11} className="animate-spin" />
                    )}
                    Confirm Refund
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
