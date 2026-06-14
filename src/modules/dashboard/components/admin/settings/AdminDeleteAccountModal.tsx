import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import Modal from "../../../../../components/Modal";

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
    <Modal
      open
      onClose={onClose}
      title="Delete Account"
      titleId="admin-delete-account-title"
      size="sm"
      disableEscapeKey={deleting}
      disableBackdropClick={deleting}
    >
      <Modal.Body>
        <div className="space-y-4">
          {/* Warning */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <p className="font-medium leading-relaxed mb-2">
              This action is permanent and cannot be undone.
            </p>
            <p className="text-xs text-red-800/70 leading-relaxed">
              All admin account data will be permanently deleted. Make sure
              another admin account exists before proceeding.
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
          disabled={!canDelete || deleting}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 transition-colors"
        >
          {deleting ? (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          ) : (
            <Trash2 size={14} aria-hidden="true" />
          )}
          {deleting ? "Deleting…" : "Delete Forever"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={deleting}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}
