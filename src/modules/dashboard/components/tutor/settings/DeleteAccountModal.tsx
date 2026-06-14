import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import Modal from "../../../../../components/Modal";

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
    <Modal
      open
      onClose={onClose}
      title="Delete Account"
      titleId="tutor-delete-account-title"
      size="sm"
      disableEscapeKey={isPending}
      disableBackdropClick={isPending}
    >
      <Modal.Body>
        <div className="space-y-4">
          {/* Warning */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <p className="font-medium leading-relaxed mb-2">
              This action is permanent and cannot be undone.
            </p>
            <p className="text-xs text-red-800/70 leading-relaxed">
              Deleting your account will permanently remove all your data
              including your profile, lessons, earnings history, messages, and
              reviews. Any pending payouts will be processed before deletion.
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
              Why are you leaving? <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22] appearance-none cursor-pointer"
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
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
              Anything else you'd like to share?{" "}
              <span className="text-[#0B2343]/30 font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Your feedback helps us improve…"
              className="block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22] resize-none"
            />
            <p className="text-[9px] text-[#0B2343]/30 mt-0.5 text-right">
              {feedback.length}/500
            </p>
          </div>

          {/* Confirmation input */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
              Type <span className="font-bold text-red-500">DELETE</span> to
              confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="block w-full rounded-xl border border-red-300 bg-white px-3 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-red-500 font-mono tracking-wider"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Actions>
        <button
          type="button"
          onClick={handleDelete}
          disabled={!canDelete || isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 transition-colors"
        >
          {isPending ? (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          ) : (
            <Trash2 size={14} aria-hidden="true" />
          )}
          {isPending ? "Deleting…" : "Delete Forever"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}
