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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0B2343]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
        >
          <X size={16} className="text-[#0B2343]/30" />
        </button>

        <h3 className="text-lg font-bold text-[#0B2343] mb-1">
          Review your lesson
        </h3>
        <p className="text-sm text-[#0B2343]/40 mb-5">
          How was your lesson with{" "}
          <span className="font-semibold">{lesson.tutorName}</span>?
        </p>

        {/* Star rating */}
        <div className="mb-5">
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
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
            Your feedback
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this lesson..."
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 resize-none transition-colors"
          />
          <p className="text-[10px] text-[#0B2343]/25 mt-1 text-right">
            {comment.length} / 1000
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#0B2343]/[0.08] text-sm font-semibold text-[#0B2343]/50 hover:border-[#0B2343]/15 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting…
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
