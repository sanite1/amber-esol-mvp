// src/components/student/settings/DeleteAccountSection.tsx
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

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/15 outline-none focus:border-red-300 focus:bg-white transition-colors";
  const labelClass = "text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block";

  return (
    <>
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

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0B2343]/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle size={15} className="text-red-500" />
                </div>
                <h2 className="text-sm font-semibold text-[#0B2343]">
                  Delete Account
                </h2>
              </div>
              {!deleting && (
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
                >
                  <X size={15} className="text-[#0B2343]/25" />
                </button>
              )}
            </div>

            <div className="px-5 pb-5 space-y-4">
              {/* Warning */}
              <div className="p-3 rounded-xl bg-red-50/50">
                <p className="text-xs text-red-600 leading-relaxed">
                  This will permanently delete your account including all lesson
                  history, messages, payment records, and profile data. Any
                  upcoming booked lessons will be cancelled. You will not be
                  able to recover your account.
                </p>
              </div>

              {/* Reason */}
              <div>
                <label className={labelClass}>
                  Why are you leaving? <span className="text-red-400">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={inputClass}
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
                <label className={labelClass}>
                  Anything else you'd like us to know?{" "}
                  <span className="text-[#0B2343]/20">(optional)</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Your feedback helps us improve…"
                  className={`${inputClass} resize-none`}
                />
                <p className="text-[9px] text-[#0B2343]/20 mt-0.5 text-right">
                  {feedback.length}/500
                </p>
              </div>

              {/* Confirm text */}
              <div>
                <label className={labelClass}>
                  Type <span className="font-bold text-red-500">DELETE</span> to
                  confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2.5 rounded-xl border border-red-200 bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/15 outline-none focus:border-red-300 focus:bg-white transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleClose}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl border border-[#0B2343]/[0.08] text-sm text-[#0B2343]/50 font-medium hover:bg-[#0B2343]/[0.03] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!canDelete || deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    "Delete Forever"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
