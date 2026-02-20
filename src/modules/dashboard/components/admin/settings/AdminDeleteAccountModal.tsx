import React, { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminDeleteAccountModal({ onClose, onConfirm }: Props) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const canDelete = confirmText === "DELETE";

  async function handleDelete() {
    if (!canDelete) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setDeleting(false);
    onConfirm();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-red-100">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-sm sm:text-base font-bold text-red-600">
              Delete Account
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0B2343]/[0.04] flex items-center justify-center hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/60" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-4">
          <div className="bg-red-50 rounded-xl p-3 border border-red-200">
            <p className="text-xs text-red-600 font-medium mb-1">
              This action is permanent and cannot be undone.
            </p>
            <p className="text-[11px] text-red-400">
              All admin account data will be permanently deleted. Make sure
              another admin account exists before proceeding.
            </p>
          </div>

          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
              Type <span className="font-bold text-red-500">DELETE</span> to
              confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3 py-2.5 rounded-xl border border-red-200 bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/20 focus:outline-none focus:border-red-300 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[11px] sm:text-xs font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!canDelete || deleting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-[11px] sm:text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting && <Loader2 size={12} className="animate-spin" />}
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
