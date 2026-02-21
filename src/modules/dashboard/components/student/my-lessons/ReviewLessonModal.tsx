import { useState } from "react";
import { X, Star, Loader2, CheckCircle2 } from "lucide-react";
import { Lesson } from "../../../data/student/myLessonsData";
import { useCreateReview } from "../../../lib/api/review";

interface Props {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (id: string, rating: number, comment: string) => void;
}

export default function ReviewLessonModal({
  lesson,
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const createReview = useCreateReview();

  if (!isOpen || !lesson) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (comment.length < 10) {
      setError("Please write at least 10 characters");
      return;
    }
    setError("");

    createReview.mutate(
      {
        bookingId: lesson.id,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          onSubmit?.(lesson.id, rating, comment);
        },
      }
    );
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setError("");
    setShowSuccess(false);
    onClose();
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  /* ── Success state ── */
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />
        <div className="relative z-[10000] w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden">
          <div className="px-5 py-10 sm:py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B2343] mb-1.5">
              Review Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-[#0B2343]/40 leading-relaxed max-w-[280px] mx-auto">
              Thank you for your feedback. Your review helps other students find
              great tutors.
            </p>
            <div className="flex items-center justify-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < rating
                      ? "text-[#ff7c22] fill-[#ff7c22]"
                      : "text-[#0B2343]/10"
                  }
                />
              ))}
            </div>
            <button
              onClick={handleClose}
              className="mt-6 px-8 py-2.5 rounded-xl bg-[#ff7c22] text-white text-sm font-medium hover:bg-[#e56a10] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Review form ── */
  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer / Modal */}
      <div className="relative z-[10000] w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343] flex items-center gap-2">
            <Star size={16} className="text-[#ff7c22]" />
            Review your lesson
          </h3>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          <p className="text-xs sm:text-[13px] text-[#0B2343]/50 leading-relaxed">
            How was your lesson with{" "}
            <span className="font-semibold text-[#0B2343]">
              {lesson.tutorName}
            </span>
            ?
          </p>

          {/* Star rating */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const starVal = i + 1;
                const active = starVal <= (hoveredRating || rating);
                return (
                  <button
                    key={i}
                    onMouseEnter={() => setHoveredRating(starVal)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(starVal)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={
                        active
                          ? "text-[#ff7c22] fill-[#ff7c22]"
                          : "text-[#0B2343]/10"
                      }
                    />
                  </button>
                );
              })}
              {(hoveredRating || rating) > 0 && (
                <span className="text-xs font-semibold text-[#ff7c22] ml-2">
                  {ratingLabels[hoveredRating || rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Your feedback
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this lesson..."
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors resize-none"
            />
            <p className="text-[9px] text-[#0B2343]/20 mt-0.5 text-right">
              {comment.length}/1000
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[11px] text-red-500 font-medium">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createReview.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#ff7c22] text-white text-xs sm:text-[13px] font-medium hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
          >
            {createReview.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
