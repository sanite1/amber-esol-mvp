import { useState } from "react";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";

interface Props {
  onDelete: () => Promise<void>;
}

export default function DeleteAccountSection({ onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const canDelete = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

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

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0B2343]/40 backdrop-blur-sm"
            onClick={!deleting ? () => setShowConfirm(false) : undefined}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm">
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
                  onClick={() => setShowConfirm(false)}
                  className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
                >
                  <X size={15} className="text-[#0B2343]/25" />
                </button>
              )}
            </div>

            <div className="px-5 pb-5">
              <div className="p-3 rounded-xl bg-red-50/50 mb-4">
                <p className="text-xs text-red-600 leading-relaxed">
                  This will permanently delete your account including all lesson
                  history, messages, payment records, and profile data. Any
                  upcoming booked lessons will be cancelled. You will not be
                  able to recover your account.
                </p>
              </div>

              <label className="text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
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

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmText("");
                  }}
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
