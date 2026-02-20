import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { Lesson } from "../../../data/student/myLessonsData";

interface Props {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, rating: number, comment: string) => void;
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
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !lesson) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (comment.length < 10) {
      setError("Please write at least 10 characters");
      return;
    }
    setError("");
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(lesson.id, rating, comment);
    setIsPending(false);
    setRating(0);
    setComment("");
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer / Modal */}
      <div className="relative z-[10000] w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header — sticky */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343] flex items-center gap-2">
            <Star size={16} className="text-[#ff7c22]" />
            Review your lesson
          </h3>
          <button
            onClick={onClose}
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
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#ff7c22] text-white text-xs sm:text-[13px] font-medium hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
          >
            {isPending ? (
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
