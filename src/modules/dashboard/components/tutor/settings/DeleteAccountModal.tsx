import { useState } from "react";
import { X, AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface Props {
  onClose: () => void;
  onDelete: (reason: string, feedback: string) => Promise<boolean>;
  isPending: boolean;
}

const reasonOptions = [
  { value: "", label: "Select a reason…" },
  { value: "not-useful", label: "The platform isn't useful for me" },
  { value: "not-enough-students", label: "Not getting enough students" },
  { value: "too-expensive", label: "Fees are too high" },
  { value: "found-alternative", label: "Found a better platform" },
  { value: "privacy", label: "Privacy concerns" },
  { value: "temporary", label: "Taking a break from teaching" },
  { value: "other", label: "Other" },
];

export default function DeleteAccountModal({
  onClose,
  onDelete,
  isPending,
}: Props) {
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const canDelete = confirmText === "DELETE" && reason !== "";

  const handleDelete = async () => {
    if (!canDelete) return;
    const success = await onDelete(reason, feedback);
    if (!success) {
      console.warn("Account deletion failed — modal stays open for retry.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-red-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-red-600 flex items-center gap-2">
            <AlertTriangle size={16} />
            Delete Account
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Warning */}
          <div className="p-3 sm:p-4 rounded-xl bg-red-50 border border-red-100">
            <p className="text-xs sm:text-[13px] text-red-700 leading-relaxed font-medium mb-2">
              This action is permanent and cannot be undone.
            </p>
            <p className="text-[11px] sm:text-xs text-red-600/60 leading-relaxed">
              Deleting your account will permanently remove all your data
              including your profile, lessons, earnings history, messages, and
              reviews. Any pending payouts will be processed before deletion.
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Why are you leaving? <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors appearance-none cursor-pointer"
            >
              {reasonOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Feedback */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Anything else you'd like to share?{" "}
              <span className="text-[#0B2343]/20 font-normal">(optional)</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Your feedback helps us improve…"
              className="w-full px-3 py-2.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors resize-none"
            />
            <p className="text-[9px] text-[#0B2343]/20 mt-0.5 text-right">
              {feedback.length}/500
            </p>
          </div>

          {/* Confirmation input */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Type <span className="font-bold text-red-500">DELETE</span> to
              confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3 py-2.5 rounded-lg border border-red-200 bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-red-400 focus:bg-white transition-colors font-mono tracking-wider"
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
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!canDelete || isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 text-white text-xs sm:text-[13px] font-medium hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {isPending ? "Deleting…" : "Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
}
