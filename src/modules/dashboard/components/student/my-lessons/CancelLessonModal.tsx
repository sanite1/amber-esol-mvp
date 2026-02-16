import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Lesson } from "../../../data/student/myLessonsData";

interface Props {
  lesson: Lesson | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => void;
}

export default function CancelLessonModal({
  lesson,
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");
  const [isPending, setIsPending] = useState(false);

  if (!isOpen || !lesson) return null;

  const handleConfirm = async () => {
    setIsPending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    onConfirm(lesson.id, reason);
    setIsPending(false);
    setReason("");
  };

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

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>

        <h3 className="text-lg font-bold text-[#0B2343] mb-1">
          Cancel this lesson?
        </h3>
        <p className="text-sm text-[#0B2343]/40 mb-5">
          Your lesson with{" "}
          <span className="font-semibold">{lesson.tutorName}</span> on{" "}
          {new Date(lesson.date).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          at {lesson.startTime} will be cancelled.
          {lesson.type === "regular" && (
            <span className="block mt-1 text-emerald-600 font-medium">
              Your lesson credit will be refunded.
            </span>
          )}
        </p>

        {/* Reason */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-[#0B2343]/60 mb-1.5">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you cancelling?"
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 resize-none transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#0B2343]/[0.08] text-sm font-semibold text-[#0B2343]/50 hover:border-[#0B2343]/15 transition-colors"
          >
            Keep Lesson
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Cancelling…
              </>
            ) : (
              "Cancel Lesson"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
