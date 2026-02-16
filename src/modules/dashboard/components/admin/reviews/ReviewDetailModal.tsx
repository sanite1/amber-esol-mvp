import React, { useState } from "react";
import {
  X,
  Star,
  Calendar,
  User,
  GraduationCap,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  Loader2,
  Zap,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import type { AdminReview } from "../../../data/admin/adminReviewsData";

interface Props {
  review: AdminReview;
  onClose: () => void;
  onHide: (reviewId: string) => void;
  onUnhide: (reviewId: string) => void;
  onRemove: (reviewId: string) => void;
  onRestore: (reviewId: string) => void;
  onDismissReport: (reviewId: string, reportId: string) => void;
  onActionReport: (reviewId: string, reportId: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  published: {
    label: "Published",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  hidden: { label: "Hidden", bg: "bg-blue-50", text: "text-blue-600" },
  removed: { label: "Removed", bg: "bg-red-50", text: "text-red-500" },
};

const reportReasonLabels: Record<string, string> = {
  inappropriate: "Inappropriate Content",
  fake: "Fake / Misleading",
  harassment: "Harassment",
  spam: "Spam",
  other: "Other",
};

const reportStatusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-600" },
  dismissed: {
    label: "Dismissed",
    bg: "bg-[#0B2343]/[0.05]",
    text: "text-[#0B2343]/50",
  },
  action_taken: {
    label: "Action Taken",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
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

export default function ReviewDetailModal({
  review,
  onClose,
  onHide,
  onUnhide,
  onRemove,
  onRestore,
  onDismissReport,
  onActionReport,
}: Props) {
  const [processing, setProcessing] = useState(false);
  const [processingReportId, setProcessingReportId] = useState<string | null>(
    null
  );
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const status = statusConfig[review.status] || statusConfig.published;
  const pendingReports = review.reports.filter((r) => r.status === "pending");

  async function handleHide() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    onHide(review.id);
    setProcessing(false);
  }

  async function handleUnhide() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    onUnhide(review.id);
    setProcessing(false);
  }

  async function handleRemove() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    onRemove(review.id);
    setProcessing(false);
    setShowRemoveConfirm(false);
  }

  async function handleRestore() {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 500));
    onRestore(review.id);
    setProcessing(false);
  }

  async function handleDismissReport(reportId: string) {
    setProcessingReportId(reportId);
    await new Promise((r) => setTimeout(r, 400));
    onDismissReport(review.id, reportId);
    setProcessingReportId(null);
  }

  async function handleActionReport(reportId: string) {
    setProcessingReportId(reportId);
    await new Promise((r) => setTimeout(r, 400));
    onActionReport(review.id, reportId);
    setProcessingReportId(null);
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
              Review Details
            </h2>
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40">
              {review.id}
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
            {review.lessonType === "trial" && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ff7c22]/10 text-[#ff7c22] text-[11px] sm:text-xs font-medium">
                <Zap size={11} />
                Trial
              </span>
            )}
            {pendingReports.length > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-600 text-[11px] sm:text-xs font-medium">
                <AlertTriangle size={11} />
                {pendingReports.length} pending report
                {pendingReports.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                <User size={13} className="text-[#0B2343]/40" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40 font-medium">
                  Student
                </p>
                <p className="text-xs sm:text-sm text-[#0B2343] flex items-center gap-1">
                  {review.studentName}
                  <ExternalLink size={10} className="text-[#0B2343]/30" />
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap size={13} className="text-[#0B2343]/40" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/40 font-medium">
                  Tutor
                </p>
                <p className="text-xs sm:text-sm text-[#0B2343] flex items-center gap-1">
                  {review.tutorName}
                  <ExternalLink size={10} className="text-[#0B2343]/30" />
                </p>
              </div>
            </div>
          </div>

          {/* Lesson info */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-[#0B2343]/50">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-[#0B2343]/30" />
              {formatDate(review.lessonDate)}
            </span>
            <span>{review.lessonTopic}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < review.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-[#0B2343]/10"
                  }
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#0B2343]">
              {review.rating}/5
            </span>
            {review.helpfulCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-[#0B2343]/40 ml-2">
                <ThumbsUp size={11} />
                {review.helpfulCount} found helpful
              </span>
            )}
          </div>

          {/* Review comment */}
          <div className="bg-[#0B2343]/[0.02] rounded-xl p-3 sm:p-4">
            <p className="text-[11px] font-medium text-[#0B2343]/50 mb-1.5">
              Student Review
            </p>
            <p className="text-xs sm:text-sm text-[#0B2343]/80 leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
            <p className="text-[10px] text-[#0B2343]/30 mt-2">
              Posted {formatDateTime(review.createdAt)}
            </p>
          </div>

          {/* Tutor reply */}
          {review.tutorReply && (
            <div className="bg-emerald-50/50 rounded-xl p-3 sm:p-4 border border-emerald-100">
              <p className="text-[11px] font-medium text-emerald-600 mb-1.5 flex items-center gap-1">
                <MessageSquare size={11} />
                Tutor Reply
              </p>
              <p className="text-xs sm:text-sm text-[#0B2343]/80 leading-relaxed whitespace-pre-wrap">
                {review.tutorReply}
              </p>
              {review.tutorRepliedAt && (
                <p className="text-[10px] text-[#0B2343]/30 mt-2">
                  Replied {formatDateTime(review.tutorRepliedAt)}
                </p>
              )}
            </div>
          )}

          {/* ── Reports Section ─────────────────────────── */}
          {review.reports.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-amber-500" />
                Reports ({review.reports.length})
              </h4>

              {review.reports.map((report) => {
                const rStatus =
                  reportStatusConfig[report.status] ||
                  reportStatusConfig.pending;
                const isPending = report.status === "pending";
                const isProcessingThis = processingReportId === report.id;

                return (
                  <div
                    key={report.id}
                    className={`rounded-xl p-3 border ${
                      isPending
                        ? "border-amber-200 bg-amber-50/50"
                        : "border-[#0B2343]/[0.06] bg-[#0B2343]/[0.01]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <p className="text-[11px] sm:text-xs font-medium text-[#0B2343]">
                          {report.reporterName}
                          <span className="ml-1.5 text-[10px] text-[#0B2343]/40 font-normal">
                            ({report.reporterType})
                          </span>
                        </p>
                        <p className="text-[10px] text-[#0B2343]/40">
                          {reportReasonLabels[report.reason]} ·{" "}
                          {formatDateTime(report.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium ${rStatus.bg} ${rStatus.text}`}
                      >
                        {rStatus.label}
                      </span>
                    </div>

                    <p className="text-[11px] sm:text-xs text-[#0B2343]/60 leading-relaxed">
                      {report.description}
                    </p>

                    {isPending && (
                      <div className="flex gap-2 mt-2.5">
                        <button
                          onClick={() => handleDismissReport(report.id)}
                          disabled={isProcessingThis}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#0B2343]/[0.08] text-[#0B2343]/60 text-[10px] sm:text-[11px] font-medium hover:bg-[#0B2343]/[0.04] transition-colors disabled:opacity-50"
                        >
                          {isProcessingThis ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <XCircle size={10} />
                          )}
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleActionReport(report.id)}
                          disabled={isProcessingThis}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] sm:text-[11px] font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                          {isProcessingThis ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <CheckCircle size={10} />
                          )}
                          Take Action
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Review Actions ──────────────────────────── */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60">
              Review Actions
            </h4>

            {!showRemoveConfirm && (
              <div className="flex flex-wrap gap-2">
                {review.status === "published" && (
                  <button
                    onClick={handleHide}
                    disabled={processing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] text-[#0B2343]/60 text-[11px] sm:text-xs font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <EyeOff size={12} />
                    )}
                    Hide Review
                  </button>
                )}

                {review.status === "hidden" && (
                  <button
                    onClick={handleUnhide}
                    disabled={processing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 text-[11px] sm:text-xs font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Eye size={12} />
                    )}
                    Unhide (Publish)
                  </button>
                )}

                {review.status === "removed" && (
                  <button
                    onClick={handleRestore}
                    disabled={processing}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 text-[11px] sm:text-xs font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {processing ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <RotateCcw size={12} />
                    )}
                    Restore Review
                  </button>
                )}

                {review.status !== "removed" && (
                  <button
                    onClick={() => setShowRemoveConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] text-[#0B2343]/60 text-[11px] sm:text-xs font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <Trash2 size={12} />
                    Remove Review
                  </button>
                )}
              </div>
            )}

            {/* Remove confirmation */}
            {showRemoveConfirm && (
              <div className="bg-red-50 rounded-xl p-3 space-y-2.5">
                <p className="text-[11px] font-semibold text-red-500">
                  Remove this review?
                </p>
                <p className="text-[10px] text-red-400">
                  This will remove the review from public view. The review can
                  be restored later.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowRemoveConfirm(false)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemove}
                    disabled={processing}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[11px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {processing && (
                      <Loader2 size={11} className="animate-spin" />
                    )}
                    Confirm Remove
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
