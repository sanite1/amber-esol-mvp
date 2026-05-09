import { useEffect, useState } from "react";
import { Star, Loader2, Save, MessageSquare } from "lucide-react";
import {
  useGetSessionFeedback,
  useSubmitTeacherFeedback,
} from "../../lib/api/esolSessionFeedback";

interface Props {
  sessionId: string;
}

export default function TeacherFeedbackPanel({ sessionId }: Props) {
  const { data, isLoading } = useGetSessionFeedback(sessionId);
  const { mutateAsync: submit, isPending } = useSubmitTeacherFeedback();

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [progressNotes, setProgressNotes] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const feedback = data?.data;

  useEffect(() => {
    if (feedback) {
      setRating(feedback.teacherRating ?? 0);
      setComment(feedback.teacherComment ?? "");
      setProgressNotes(feedback.progressNotes ?? "");
      setHasChanges(false);
    }
  }, [feedback]);

  const handleChange = (fn: () => void) => {
    fn();
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({
      sessionId,
      data: {
        rating: rating > 0 ? rating : undefined,
        comment: comment.trim() || undefined,
        progressNotes: progressNotes.trim() || undefined,
      },
    });
    setHasChanges(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#0B2343]/[0.06] flex items-center gap-2">
        <MessageSquare size={14} className="text-[#0B2343]/60" />
        <h2 className="text-sm font-extrabold text-[#0B2343]">Your feedback</h2>
        {feedback?.learnerRating && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs text-[#0B2343]/55">
            Learner rated this session
            <span className="inline-flex items-center gap-0.5">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <strong className="text-[#0B2343]">
                {feedback.learnerRating}
              </strong>
            </span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 size={18} className="text-[#ff7c22] animate-spin" />
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-[#0B2343]/60 mb-2">
                Your rating (optional)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleChange(() => setRating(n))}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={22}
                      className={
                        n <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-[#0B2343]/15"
                      }
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => handleChange(() => setRating(0))}
                    className="ml-2 text-[11px] font-semibold text-[#0B2343]/40 hover:text-[#0B2343]/60 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                Comment (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => handleChange(() => setComment(e.target.value))}
                rows={2}
                maxLength={2000}
                placeholder="Brief reflections on the session…"
                className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
                Progress notes
              </label>
              <textarea
                value={progressNotes}
                onChange={(e) =>
                  handleChange(() => setProgressNotes(e.target.value))
                }
                rows={4}
                maxLength={4000}
                placeholder="Specific observations about the learner's progress, areas to work on next session, recommendations for the org admin…"
                className="w-full px-4 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none resize-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors"
              />
              <p className="text-[11px] text-[#0B2343]/35 mt-1.5">
                Visible to the org admin and platform admins. Helps inform level
                changes and learning recommendations.
              </p>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#0B2343]/[0.06]">
              <button
                type="submit"
                disabled={isPending || !hasChanges}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff7c22] text-white text-sm font-bold rounded-xl hover:bg-[#e56a10] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Save size={14} /> Save feedback
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
