import React, { useState } from "react";
import {
  X,
  Clock,
  Calendar,
  Banknote,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  Flag,
} from "lucide-react";
import type { AdminPayout } from "../../../data/admin/adminPaymentsData";

interface Props {
  payout: AdminPayout;
  onClose: () => void;
  onApprove: (payoutId: string) => void;
  onReject: (payoutId: string, reason: string) => void;
  onMarkCompleted: (payoutId: string) => void;
  onFlag: (payoutId: string, reason: string) => void;
  onUnflag: (payoutId: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "bg-blue-50", text: "text-blue-600" },
  processing: {
    label: "Processing",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  failed: { label: "Failed", bg: "bg-red-50", text: "text-red-600" },
  flagged: { label: "Flagged", bg: "bg-amber-50", text: "text-amber-600" },
};

const methodLabels: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  paypal: "PayPal",
  wise: "Wise",
};

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export default function PayoutDetailModal({
  payout,
  onClose,
  onApprove,
  onReject,
  onMarkCompleted,
  onFlag,
  onUnflag,
}: Props) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason, setFlagReason] = useState(payout.flagReason || "");
  const [processing, setProcessing] = useState(false);

  const status = statusConfig[payout.status] || statusConfig.pending;

  async function handleApprove() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    onApprove(payout.id);
    setProcessing(false);
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    onReject(payout.id, rejectReason.trim());
    setProcessing(false);
    setShowRejectForm(false);
  }

  async function handleMarkCompleted() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    onMarkCompleted(payout.id);
    setProcessing(false);
  }

  async function handleFlag() {
    if (!flagReason.trim()) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    onFlag(payout.id, flagReason.trim());
    setProcessing(false);
    setShowFlagForm(false);
  }

  async function handleUnflag() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    onUnflag(payout.id);
    setProcessing(false);
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
              Payout Details
            </h2>
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
              {payout.id}
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
              {methodLabels[payout.method]}
            </span>
          </div>

          {/* Amount */}
          <div className="text-center py-3">
            <p className="text-[10px] text-[#0B2343]/40 mb-1">Payout Amount</p>
            <p className="text-2xl sm:text-3xl font-bold text-[#0B2343]">
              £{payout.amount.toFixed(2)}
            </p>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={User} label="Tutor" value={payout.tutorName} />
            <InfoRow
              icon={Banknote}
              label="Lessons Covered"
              value={`${payout.lessonsCount} lessons`}
            />
            <InfoRow
              icon={Calendar}
              label="Period"
              value={`${formatDate(payout.periodStart)} – ${formatDate(
                payout.periodEnd
              )}`}
            />
            <InfoRow
              icon={Clock}
              label="Requested"
              value={formatDateTime(payout.requestedAt)}
            />
            {payout.processedAt && (
              <InfoRow
                icon={CheckCircle}
                label="Processed"
                value={formatDateTime(payout.processedAt)}
              />
            )}
          </div>

          {/* Notes */}
          {payout.notes && (
            <div className="bg-[#0B2343]/[0.02] rounded-xl p-3">
              <p className="text-[11px] font-medium text-[#0B2343]/50 mb-0.5">
                Notes
              </p>
              <p className="text-xs text-[#0B2343]/70">{payout.notes}</p>
            </div>
          )}

          {/* Flag reason */}
          {payout.flagReason && (
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-[11px] font-medium text-amber-500 mb-0.5">
                Flag Reason
              </p>
              <p className="text-xs text-amber-700">{payout.flagReason}</p>
            </div>
          )}

          {/* ── Actions ─────────────────────────────────── */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60">
              Admin Actions
            </h4>

            {!showRejectForm && !showFlagForm && (
              <div className="flex flex-wrap gap-2">
                {/* Pending → Approve / Reject */}
                {payout.status === "pending" && (
                  <>
                    <button
                      onClick={handleApprove}
                      disabled={processing}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-white text-[11px] sm:text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                      {processing ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle size={12} />
                      )}
                      Approve & Process
                    </button>
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-[11px] sm:text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                      <XCircle size={12} />
                      Reject
                    </button>
                  </>
                )}

                {/* Processing → Mark Completed */}
                {payout.status === "processing" && (
                  <button
                    onClick={handleMarkCompleted}
                    disabled={processing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-white text-[11px] sm:text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                    Mark as Completed
                  </button>
                )}

                {/* Flag / Unflag */}
                {payout.status === "flagged" ? (
                  <button
                    onClick={handleUnflag}
                    disabled={processing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-600 text-[11px] sm:text-xs font-medium hover:bg-amber-100 transition-colors disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Flag size={12} />
                    )}
                    Remove Flag
                  </button>
                ) : (
                  payout.status !== "completed" && (
                    <button
                      onClick={() => setShowFlagForm(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] text-[#0B2343]/60 text-[11px] sm:text-xs font-medium hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-colors"
                    >
                      <Flag size={12} />
                      Flag Payout
                    </button>
                  )
                )}
              </div>
            )}

            {/* Reject form */}
            {showRejectForm && (
              <div className="bg-red-50 rounded-xl p-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-red-500">
                  Reject this payout
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Reason for rejection…"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-red-200 bg-white text-xs text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-red-300 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectReason("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || processing}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[11px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {processing && (
                      <Loader2 size={11} className="animate-spin" />
                    )}
                    Confirm Reject
                  </button>
                </div>
              </div>
            )}

            {/* Flag form */}
            {showFlagForm && (
              <div className="bg-amber-50 rounded-xl p-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-amber-600">
                  Flag this payout
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
                      setFlagReason(payout.flagReason || "");
                    }}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFlag}
                    disabled={!flagReason.trim() || processing}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[11px] font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {processing && (
                      <Loader2 size={11} className="animate-spin" />
                    )}
                    Flag
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
