import { useState } from "react";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Flag,
  ChevronDown,
  Send,
  X,
  Loader2,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import type { TutorReview } from "../../../data/tutor/tutorReviewsData";

interface Props {
  review: TutorReview;
  onReply: (reviewId: string, text: string) => void;
  onEditReply: (reviewId: string, replyId: string, text: string) => void;
  onDeleteReply: (reviewId: string, replyId: string) => void;
  onReport: (reviewId: string) => void;
}

export default function ReviewCard({
  review,
  onReply,
  onEditReply,
  onDeleteReply,
  onReport,
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState("");

  const [editingReply, setEditingReply] = useState(false);
  const [editReplyText, setEditReplyText] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showFull, setShowFull] = useState(false);
  const textLimit = 180;
  const needsTruncate = review.text.length > textLimit;

  const initials = review.studentName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const daysSince = Math.floor(
    (Date.now() - new Date(review.date).getTime()) / 86400000
  );
  const dateLabel =
    daysSince === 0
      ? "Today"
      : daysSince === 1
        ? "Yesterday"
        : daysSince < 7
          ? `${daysSince}d ago`
          : daysSince < 30
            ? `${Math.floor(daysSince / 7)}w ago`
            : new Date(review.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

  /* ── Reply handlers ── */
  const handleSendReply = async () => {
    if (!replyText.trim()) {
      setReplyError("Reply cannot be empty");
      return;
    }
    setReplyError("");
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    onReply(review.id, replyText.trim());
    setSending(false);
    setReplyText("");
    setShowReplyForm(false);
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    setReplyText("");
    setReplyError("");
  };

  /* ── Edit reply handlers ── */
  const startEditReply = () => {
    if (review.reply) {
      setEditReplyText(review.reply.text);
      setEditError("");
      setEditingReply(true);
    }
  };

  const handleSaveEditReply = async () => {
    if (!editReplyText.trim()) {
      setEditError("Reply cannot be empty");
      return;
    }
    if (!review.reply) return;
    setEditError("");
    setEditSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onEditReply(review.id, review.reply.id, editReplyText.trim());
    setEditSaving(false);
    setEditingReply(false);
  };

  const handleCancelEditReply = () => {
    setEditingReply(false);
    setEditReplyText("");
    setEditError("");
  };

  /* ── Delete reply handlers ── */
  const handleDeleteReply = async () => {
    if (!review.reply) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 500));
    onDeleteReply(review.id, review.reply.id);
    setDeleting(false);
    setConfirmDelete(false);
  };

  /* ── Report handler ── */
  const handleReport = () => {
    onReport(review.id);
  };

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] hover:border-[#0B2343]/[0.1] transition-colors">
      <div className="p-3 sm:p-4">
        {/* Header row */}
        <div className="flex items-start gap-2.5 sm:gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B2343]/[0.06] flex items-center justify-center text-[11px] sm:text-xs font-bold text-[#0B2343]/30 shrink-0 overflow-hidden">
            {review.studentAvatar ? (
              <img
                src={review.studentAvatar}
                alt={review.studentName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="text-xs sm:text-[13px] font-semibold text-[#0B2343] truncate">
                  {review.studentName}
                </p>
                <span className="text-[9px] sm:text-[10px] text-[#0B2343]/25 shrink-0">
                  {review.studentCountryCode}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className={
                        i < review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-[#0B2343]/10"
                      }
                    />
                  ))}
                </div>
                {/* Lesson type badge */}
                <span
                  className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${
                    review.lessonType === "trial"
                      ? "bg-[#ff7c22]/10 text-[#ff7c22]"
                      : "bg-[#0B2343]/[0.04] text-[#0B2343]/35"
                  }`}
                >
                  {review.lessonType}
                </span>
                {review.lessonTopic && (
                  <span className="text-[9px] sm:text-[10px] text-[#0B2343]/25">
                    · {review.lessonTopic}
                  </span>
                )}
              </div>
            </div>

            {/* Review text */}
            <p className="text-[11px] sm:text-xs text-[#0B2343]/50 leading-relaxed mt-2">
              {showFull || !needsTruncate
                ? review.text
                : `${review.text.slice(0, textLimit)}…`}
            </p>
            {needsTruncate && (
              <button
                onClick={() => setShowFull(!showFull)}
                className="text-[10px] sm:text-[11px] text-[#ff7c22] font-medium hover:underline mt-0.5 flex items-center gap-0.5"
              >
                {showFull ? "Show less" : "Read more"}
                <ChevronDown
                  size={10}
                  className={`transition-transform ${showFull ? "rotate-180" : ""}`}
                />
              </button>
            )}

            {/* Footer: date + actions */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-2.5">
              <span className="text-[10px] sm:text-[11px] text-[#0B2343]/25">
                {dateLabel}
              </span>

              {review.helpful > 0 && (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/25">
                  <ThumbsUp size={10} />
                  {review.helpful} found helpful
                </span>
              )}

              {/* Reply button (only if no reply yet) */}
              {!review.reply && !showReplyForm && (
                <button
                  onClick={() => setShowReplyForm(true)}
                  className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#0B2343]/30 hover:text-[#ff7c22] transition-colors"
                >
                  <MessageSquare size={10} />
                  Reply
                </button>
              )}

              {/* Report */}
              {!review.reported ? (
                <button
                  onClick={handleReport}
                  className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/20 hover:text-red-400 transition-colors ml-auto"
                >
                  <Flag size={10} />
                  <span className="hidden sm:inline">Report</span>
                </button>
              ) : (
                <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-red-300 ml-auto">
                  <Flag size={10} />
                  Reported
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Reply form (new) ── */}
        {showReplyForm && !review.reply && (
          <div className="mt-3 ml-11 sm:ml-[52px]">
            <div className="bg-[#0B2343]/[0.02] rounded-lg border border-[#0B2343]/[0.06] p-2.5 sm:p-3">
              <textarea
                value={replyText}
                onChange={(e) => {
                  setReplyText(e.target.value);
                  if (replyError) setReplyError("");
                }}
                rows={3}
                placeholder="Write your reply…"
                className={`w-full px-3 py-2 rounded-lg border text-[11px] sm:text-xs text-[#0B2343] outline-none resize-none transition-colors ${
                  replyError
                    ? "border-red-300 bg-red-50/30 focus:border-red-400"
                    : "border-[#0B2343]/[0.08] bg-white focus:border-[#ff7c22]/30"
                }`}
              />
              {replyError && (
                <p className="flex items-center gap-1 mt-1 text-[9px] text-red-500">
                  <AlertCircle size={9} />
                  {replyError}
                </p>
              )}
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={handleCancelReply}
                  disabled={sending}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] transition-colors"
                >
                  <X size={11} />
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={sending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2343] text-white text-[10px] sm:text-[11px] font-medium hover:bg-[#0B2343]/90 disabled:opacity-40 transition-colors"
                >
                  {sending ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Send size={11} />
                  )}
                  {sending ? "Sending…" : "Reply"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Existing reply ── */}
        {review.reply && (
          <div className="mt-3 ml-11 sm:ml-[52px]">
            <div className="bg-emerald-50/40 rounded-lg border border-emerald-100/60 p-2.5 sm:p-3">
              {!editingReply ? (
                <>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700">
                        Your reply
                      </span>
                      <span className="text-[9px] text-[#0B2343]/20">
                        ·{" "}
                        {(() => {
                          const d = Math.floor(
                            (Date.now() -
                              new Date(review.reply!.date).getTime()) /
                              86400000
                          );
                          return d === 0
                            ? "Today"
                            : d === 1
                              ? "Yesterday"
                              : d < 7
                                ? `${d}d ago`
                                : new Date(
                                    review.reply!.date
                                  ).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                  });
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={startEditReply}
                        className="p-1 rounded hover:bg-emerald-100/60 transition-colors"
                        title="Edit reply"
                      >
                        <Pencil
                          size={11}
                          className="text-[#0B2343]/25 hover:text-[#0B2343]/50"
                        />
                      </button>
                      {!confirmDelete ? (
                        <button
                          onClick={() => setConfirmDelete(true)}
                          className="p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete reply"
                        >
                          <Trash2
                            size={11}
                            className="text-[#0B2343]/20 hover:text-red-400"
                          />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleDeleteReply}
                            disabled={deleting}
                            className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 disabled:opacity-40 transition-colors"
                          >
                            {deleting ? (
                              <Loader2 size={9} className="animate-spin" />
                            ) : (
                              <Trash2 size={9} />
                            )}
                            {deleting ? "Deleting…" : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="px-1.5 py-0.5 rounded text-[9px] text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#0B2343]/50 leading-relaxed">
                    {review.reply.text}
                  </p>
                </>
              ) : (
                /* Edit reply mode */
                <>
                  <textarea
                    value={editReplyText}
                    onChange={(e) => {
                      setEditReplyText(e.target.value);
                      if (editError) setEditError("");
                    }}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border text-[11px] sm:text-xs text-[#0B2343] outline-none resize-none transition-colors ${
                      editError
                        ? "border-red-300 bg-red-50/30 focus:border-red-400"
                        : "border-emerald-200 bg-white focus:border-emerald-300"
                    }`}
                  />
                  {editError && (
                    <p className="flex items-center gap-1 mt-1 text-[9px] text-red-500">
                      <AlertCircle size={9} />
                      {editError}
                    </p>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button
                      onClick={handleCancelEditReply}
                      disabled={editSaving}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] transition-colors"
                    >
                      <X size={11} />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEditReply}
                      disabled={editSaving}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] sm:text-[11px] font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
                    >
                      {editSaving ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Check size={11} />
                      )}
                      {editSaving ? "Saving…" : "Save"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
