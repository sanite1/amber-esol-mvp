import React, { useState } from "react";
import {
  X,
  Clock,
  Calendar,
  Star,
  AlertTriangle,
  Flag,
  DollarSign,
  User,
  GraduationCap,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { AdminLesson } from "../../../lib/types/adminLesson";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
interface Props {
  lesson: AdminLesson;
  onClose: () => void;
  onFlag: (lessonId: string, reason: string) => void;
  onUnflag: (lessonId: string) => void;
  onCancel: (lessonId: string, reason: string) => void;
  onRefund: (lessonId: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  upcoming: { label: "Upcoming", bg: "bg-blue-50", text: "text-blue-600" },
  in_progress: {
    label: "Live Now",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  completed: {
    label: "Completed",
    bg: "bg-[#0B2343]/[0.05]",
    text: "text-[#0B2343]/70",
  },
  cancelled_student: {
    label: "Cancelled (Student)",
    bg: "bg-red-50",
    text: "text-red-500",
  },
  cancelled_tutor: {
    label: "Cancelled (Tutor)",
    bg: "bg-red-50",
    text: "text-red-500",
  },
  cancelled_admin: {
    label: "Cancelled (Admin)",
    bg: "bg-red-50",
    text: "text-red-500",
  },
  no_show: { label: "No-show", bg: "bg-amber-50", text: "text-amber-600" },
};

function formatDate(dateStr: string, tz: string = "Europe/London"): string {
  return dayjs
    .tz(`${dateStr} 00:00`, "YYYY-MM-DD HH:mm", tz)
    .format("dddd, D MMMM YYYY");
}

function InfoRow({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
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

export default function LessonDetailModal({
  lesson,
  onClose,
  onFlag,
  onUnflag,
  onCancel,
  onRefund,
}: Props) {
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason, setFlagReason] = useState(lesson.flagReason || "");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [flagging, setFlagging] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  const status = statusConfig[lesson.status] || statusConfig.upcoming;
  const canCancel =
    lesson.status === "upcoming" || lesson.status === "in_progress";
  const canRefund =
    lesson.paymentStatus === "paid" && lesson.amount > 0 && !canCancel;

  async function handleFlag() {
    if (!flagReason.trim()) return;
    setFlagging(true);
    await new Promise((r) => setTimeout(r, 600));
    onFlag(lesson.id, flagReason.trim());
    setFlagging(false);
    setShowFlagForm(false);
  }

  async function handleUnflag() {
    setFlagging(true);
    await new Promise((r) => setTimeout(r, 600));
    onUnflag(lesson.id);
    setFlagging(false);
  }

  async function handleCancel() {
    if (!cancelReason.trim()) return;
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 600));
    onCancel(lesson.id, cancelReason.trim());
    setCancelling(false);
    setShowCancelForm(false);
  }

  async function handleRefund() {
    setRefunding(true);
    await new Promise((r) => setTimeout(r, 600));
    onRefund(lesson.id);
    setRefunding(false);
    setShowRefundConfirm(false);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-[10000] bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header — pinned */}
        <div className="shrink-0 bg-white border-b border-[#0B2343]/[0.06] px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-[#0B2343] truncate">
              Lesson Details
            </h2>
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
              {lesson.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0B2343]/[0.04] flex items-center justify-center hover:bg-[#0B2343]/[0.08] transition-colors shrink-0"
          >
            <X size={16} className="text-[#0B2343]/60" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-5">
          {/* Status + Flagged */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg ${status.bg} ${status.text} text-[11px] sm:text-xs font-medium`}
            >
              {status.label}
            </span>
            {lesson.type === "trial" && (
              <span className="px-2.5 py-1 rounded-lg bg-[#ff7c22]/10 text-[#ff7c22] text-[11px] sm:text-xs font-medium">
                Trial Lesson
              </span>
            )}
            {lesson.flagged && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-600 text-[11px] sm:text-xs font-medium">
                <AlertTriangle size={11} />
                Flagged
              </span>
            )}
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#0B2343] mb-0.5">
              {lesson.topic || lesson.subject}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#0B2343]/40">
              {lesson.subject}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow
              icon={Calendar}
              label="Date"
              value={formatDate(lesson.date)}
            />
            <InfoRow
              icon={Clock}
              label="Time"
              value={`${lesson.startTime}  ${lesson.endTime} (${lesson.duration} min)`}
            />
            <InfoRow
              icon={User}
              label="Student"
              value={
                <span className="flex items-center gap-1">
                  {lesson.studentName}
                  <ExternalLink size={10} className="text-[#0B2343]/30" />
                </span>
              }
            />
            <InfoRow
              icon={GraduationCap}
              label="Tutor"
              value={
                <span className="flex items-center gap-1">
                  {lesson.tutorName}
                  <ExternalLink size={10} className="text-[#0B2343]/30" />
                </span>
              }
            />
          </div>

          <div className="bg-[#0B2343]/[0.02] rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2.5">
              Financial Details
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] text-[#0B2343]/40">Charged</p>
                <p className="text-sm font-semibold text-[#0B2343]">
                  {lesson.amount > 0 ? `${lesson.amount.toFixed(2)}` : "Free"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#0B2343]/40">Tutor Earns</p>
                <p className="text-sm font-semibold text-emerald-600">
                  {lesson.tutorEarnings.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#0B2343]/40">Commission</p>
                <p className="text-sm font-semibold text-[#ff7c22]">
                  {lesson.commission.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#0B2343]/40">Payment</p>
                <p
                  className={`text-sm font-semibold ${lesson.paymentStatus === "paid" ? "text-emerald-600" : lesson.paymentStatus === "refunded" ? "text-red-500" : lesson.paymentStatus === "pending" ? "text-amber-500" : "text-[#0B2343]/40"}`}
                >
                  {lesson.paymentStatus.charAt(0).toUpperCase() +
                    lesson.paymentStatus.slice(1)}
                </p>
              </div>
            </div>
          </div>

          {lesson.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < lesson.rating!
                        ? "text-amber-400 fill-amber-400"
                        : "text-[#0B2343]/10"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-[#0B2343]/60">
                {lesson.rating}/5 from student
              </span>
            </div>
          )}

          {lesson.cancelReason && (
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-[11px] font-medium text-red-400 mb-0.5">
                Cancellation Reason
              </p>
              <p className="text-xs text-red-600">{lesson.cancelReason}</p>
            </div>
          )}
          {lesson.flagged && lesson.flagReason && (
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-[11px] font-medium text-amber-500 mb-0.5">
                Flag Reason
              </p>
              <p className="text-xs text-amber-700">{lesson.flagReason}</p>
            </div>
          )}
          {lesson.notes && (
            <div className="bg-[#0B2343]/[0.02] rounded-xl p-3">
              <p className="text-[11px] font-medium text-[#0B2343]/50 mb-0.5">
                Notes
              </p>
              <p className="text-xs text-[#0B2343]/70">{lesson.notes}</p>
            </div>
          )}

          <div className="space-y-2.5">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60">
              Admin Actions
            </h4>
            {!showFlagForm && !showCancelForm && !showRefundConfirm && (
              <div className="flex flex-wrap gap-2">
                {lesson.flagged ? (
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
                    Flag Lesson
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => setShowCancelForm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] text-[#0B2343]/60 text-[11px] sm:text-xs font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <XCircle size={12} />
                    Cancel Lesson
                  </button>
                )}
                {canRefund && (
                  <button
                    onClick={() => setShowRefundConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] text-[#0B2343]/60 text-[11px] sm:text-xs font-medium hover:bg-[#ff7c22]/10 hover:text-[#ff7c22] hover:border-[#ff7c22]/20 transition-colors"
                  >
                    <DollarSign size={12} />
                    Issue Refund
                  </button>
                )}
              </div>
            )}
            {showFlagForm && (
              <div className="bg-amber-50 rounded-xl p-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-amber-600">
                  Flag this lesson
                </p>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Describe the reason for flagging"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-amber-300 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowFlagForm(false);
                      setFlagReason(lesson.flagReason || "");
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
            {showCancelForm && (
              <div className="bg-red-50 rounded-xl p-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-red-500">
                  Cancel this lesson
                </p>
                <p className="text-[10px] text-red-400">
                  This will cancel the lesson and automatically issue a refund
                  to the student if already paid.
                </p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for admin cancellation"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-red-200 bg-white text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/30 focus:outline-none focus:border-red-300 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowCancelForm(false);
                      setCancelReason("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={!cancelReason.trim() || cancelling}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[11px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {cancelling && (
                      <Loader2 size={11} className="animate-spin" />
                    )}
                    Confirm Cancel
                  </button>
                </div>
              </div>
            )}
            {showRefundConfirm && (
              <div className="bg-[#ff7c22]/[0.05] rounded-xl p-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-[#ff7c22]">
                  Issue refund
                </p>
                <p className="text-[10px] text-[#0B2343]/50">
                  Refund{" "}
                  <span className="font-semibold">
                    {lesson.amount.toFixed(2)}
                  </span>{" "}
                  to {lesson.studentName}? This cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowRefundConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRefund}
                    disabled={refunding}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ff7c22] text-white text-[11px] font-medium hover:bg-[#ff7c22]/90 transition-colors disabled:opacity-50"
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
