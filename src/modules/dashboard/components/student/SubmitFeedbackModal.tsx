import { useState } from "react";
import { X, Star, Loader2, AlertCircle, MessageSquare } from "lucide-react";
import { useSubmitLearnerFeedback } from "../../lib/api/esolSessionFeedback";

interface Props {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  topic?: string | null;
}

export default function SubmitFeedbackModal({
  open,
  onClose,
  sessionId,
  topic,
}: Props) {
  const { mutateAsync: submit, isPending } = useSubmitLearnerFeedback();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleClose = () => {
    setRating(0);
    setComment("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Please choose a rating from 1 to 5");
      return;
    }
    try {
      await submit({
        sessionId,
        data: {
          rating,
          comment: comment.trim() || undefined,
        },
      });
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not submit feedback");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0B2343]/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <MessageSquare size={18} className="text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#0B2343]">
                How was your session?
              </h2>
              {topic && (
                <p className="text-xs text-[#0B2343]/40 mt-0.5">
                  Topic: {topic}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={18} className="text-[#0B2343]/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-3">
              Rating
            </label>
            <div className="flex items-center gap-1.5 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={
                      n <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-[#0B2343]/15"
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-[#0B2343]/50 text-center mt-2">
                {ratingLabel(rating)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Tell us more (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="What went well? What could be better?"
              className="w-full px-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#0B2343]/[0.06]">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 border border-[#0B2343]/[0.08] text-sm font-bold text-[#0B2343]/60 rounded-xl hover:bg-[#0B2343]/[0.02] transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isPending || rating < 1}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending…
                </>
              ) : (
                "Submit feedback"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ratingLabel(n: number): string {
  switch (n) {
    case 1:
      return "Poor";
    case 2:
      return "Could be better";
    case 3:
      return "Okay";
    case 4:
      return "Good";
    case 5:
      return "Excellent";
    default:
      return "";
  }
}
