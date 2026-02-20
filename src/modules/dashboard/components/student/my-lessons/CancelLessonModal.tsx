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
    await new Promise((r) => setTimeout(r, 800));
    onConfirm(lesson.id, reason);
    setIsPending(false);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop — covers everything including navbar */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer / Modal */}
      <div className="relative z-[10000] w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header — sticky */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343] flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            Cancel this lesson?
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
          {/* Lesson info */}
          <p className="text-xs sm:text-[13px] text-[#0B2343]/50 leading-relaxed">
            Your lesson with{" "}
            <span className="font-semibold text-[#0B2343]">
              {lesson.tutorName}
            </span>{" "}
            on{" "}
            {new Date(lesson.date).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            at {lesson.startTime} will be cancelled.
          </p>

          {lesson.type === "regular" && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100/60">
              <span className="text-[11px] sm:text-xs text-emerald-600 leading-relaxed font-medium">
                Your lesson credit will be refunded.
              </span>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Reason (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you cancelling?"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2">
          <button
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Keep Lesson
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500 text-white text-xs sm:text-[13px] font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
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
