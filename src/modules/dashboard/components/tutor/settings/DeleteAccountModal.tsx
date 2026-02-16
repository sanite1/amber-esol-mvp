import { useState } from "react";
import { X, AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteAccountModal({ onClose, onConfirm }: Props) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const canDelete = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDeleting(false);
    onConfirm();
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
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {deleting ? "Deleting…" : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
