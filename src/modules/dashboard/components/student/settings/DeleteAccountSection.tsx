import { useState } from "react";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";

const reasonOptions = [
  { value: "", label: "Select a reason…" },
  { value: "not-useful", label: "I don't find the platform useful" },
  { value: "too-expensive", label: "It's too expensive" },
  { value: "found-alternative", label: "I found a better alternative" },
  { value: "poor-experience", label: "Poor experience with tutors" },
  { value: "technical-issues", label: "Too many technical issues" },
  { value: "privacy-concerns", label: "Privacy concerns" },
  { value: "temporary-break", label: "Taking a break from learning" },
  { value: "other", label: "Other" },
];

interface Props {
  onDelete: (reason: string, feedback: string) => Promise<boolean>;
  isPending?: boolean;
}

export default function DeleteAccountSection({
  onDelete,
  isPending = false,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");

  const canDelete = confirmText === "DELETE" && reason !== "";
  const deleting = isPending;

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      const success = await onDelete(reason, feedback);
      if (!success) {
        // Parent returned false — keep modal open so user can retry
      }
    } catch {
      console.warn("Delete account failed");
    }
  };

  const handleClose = () => {
    if (deleting) return;
    setShowConfirm(false);
    setConfirmText("");
    setReason("");
    setFeedback("");
  };

  return (
    <>
      {/* Danger zone card (unchanged) */}
      <div className="bg-white rounded-2xl border border-red-100 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <Trash2 size={13} className="text-red-400" />
          </div>
          <h3 className="text-sm font-semibold text-red-500/70">Danger Zone</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-[#0B2343]/55">Delete your account</p>
            <p className="text-[10px] text-[#0B2343]/25 mt-0.5">
              Permanently remove your account, lesson history, and all
              associated data. This cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 rounded-xl border border-red-200 text-xs font-medium text-red-400 hover:bg-red-50 transition-colors shrink-0"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Drawer / Modal — flex col so header+footer pin */}
          <div className="relative z-[10000] w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col">
            {/* Header — pinned */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-red-100 bg-white rounded-t-2xl">
              <h3 className="text-sm sm:text-[15px] font-semibold text-red-600 flex items-center gap-2">
                <AlertTriangle size={16} />
                Delete Account
              </h3>
              {!deleting && (
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
                >
                  <X size={16} className="text-[#0B2343]/30" />
                </button>
              )}
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5 space-y-4">
              {/* Warning */}
              <div className="p-3 sm:p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs sm:text-[13px] text-red-700 leading-relaxed font-medium mb-2">
                  This action is permanent and cannot be undone.
                </p>
                <p className="text-[11px] sm:text-xs text-red-600/60 leading-relaxed">
                  Deleting your account will permanently remove all your data
                  including your profile, lesson history, messages, payment
                  records, and all associated data. Any upcoming booked lessons
                  will be cancelled. You will not be able to recover your
                  account.
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
                  className="w-full px-3 py-2.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors appearance-none cursor-pointer"
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
                  Anything else you'd like us to know?{" "}
                  <span className="text-[#0B2343]/20 font-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Your feedback helps us improve…"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors resize-none"
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
                  className="w-full px-3 py-2.5 rounded-lg border border-red-200 bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-red-400 focus:bg-white transition-colors font-mono tracking-wider"
                />
              </div>
            </div>

            {/* Footer — pinned */}
            <div className="shrink-0 px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2">
              <button
                onClick={handleClose}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete || deleting}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 text-white text-xs sm:text-[13px] font-medium hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
