import { useState } from "react";
import { X, Loader2, AlertCircle, MessageSquare } from "lucide-react";
import { useSubmitLearnerFeedback } from "../../lib/api/esolSessionFeedback";

interface Props {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  topic?: string | null;
}

type EmojiRating = "struggling" | "okay" | "confident";

const OPTIONS: {
  value: EmojiRating;
  emoji: string;
  label: string;
  bg: string;
  border: string;
}[] = [
  { value: "struggling", emoji: "😣", label: "Struggling", bg: "bg-red-50", border: "border-red-200" },
  { value: "okay", emoji: "🙂", label: "Okay", bg: "bg-amber-50", border: "border-amber-200" },
  { value: "confident", emoji: "😊", label: "Confident", bg: "bg-emerald-50", border: "border-emerald-200" },
];

export default function SubmitFeedbackModal({
  open,
  onClose,
  sessionId,
  topic,
}: Props) {
  const { mutateAsync: submit, isPending } = useSubmitLearnerFeedback();
  const [rating, setRating] = useState<EmojiRating | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleClose = () => {
    setRating(null);
    setComment("");
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!rating) {
      setError("Please choose how you felt about the session");
      return;
    }
    try {
      await submit({
        sessionId,
        data: {
          emojiRating: rating,
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
                <p className="text-xs text-[#0B2343]/40 mt-0.5">{topic}</p>
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

          <div className="grid grid-cols-3 gap-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRating(opt.value)}
                className={`p-5 rounded-2xl border-2 transition-colors text-center ${
                  rating === opt.value
                    ? `${opt.border} ${opt.bg} scale-105`
                    : "border-[#0B2343]/[0.06] bg-white hover:border-[#0B2343]/20"
                }`}
              >
                <div className="text-4xl mb-2">{opt.emoji}</div>
                <p className="text-xs font-bold text-[#0B2343]">{opt.label}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
              Anything you want to tell Amber? (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={200}
              placeholder="In your own language is fine."
              className="w-full px-4 py-3 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
            />
            <p className="text-[11px] text-[#0B2343]/35 mt-1.5 text-right">
              {comment.length}/200
            </p>
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
              disabled={isPending || !rating}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending…
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
