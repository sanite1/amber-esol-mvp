/**
 * Confirm-activation modal for ComplianceConfig. The brief mandates
 * this dialog verbatim — clicking "Activate this version" doesn't go
 * straight to the POST; it opens this modal first.
 *
 * Accessibility:
 *   - role="dialog" + aria-labelledby / aria-describedby via Modal primitive
 *   - The destructive action carries a clear label + a warning chip
 *   - Focus moves to the close button on open; returns to the trigger
 *     on close (browser default for portal-managed dialogs)
 */

import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "../../../components/Modal";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
  domain: string;
  academicYear: string;
}

export default function ActivateConfigConfirmModal({
  open,
  onCancel,
  onConfirm,
  busy,
  domain,
  academicYear,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Activate compliance config?"
      titleId="activate-config-title"
      size="sm"
      // Don't allow backdrop / Escape to dismiss mid-flight — the
      // POST might still be in progress.
      disableEscapeKey={busy}
      disableBackdropClick={busy}
    >
      <Modal.Body>
        <p
          id="activate-config-description"
          className="text-sm text-[#0B2343]/75 leading-relaxed mb-3"
        >
          You are about to activate a new version of the{" "}
          <strong className="font-bold text-[#0B2343]">
            {domain} / {academicYear}
          </strong>{" "}
          compliance config.
        </p>

        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
        >
          <AlertTriangle
            size={18}
            aria-hidden="true"
            className="shrink-0 mt-0.5 text-amber-700"
          />
          <p className="text-sm text-amber-900 leading-relaxed">
            This will affect every future ILR export and RARPA evaluation.
            Continue?
          </p>
        </div>

        <p className="text-xs text-[#0B2343]/55 mt-3 leading-relaxed">
          The currently active version will be deactivated and the in-memory
          rule cache reloaded. Existing exports that have already started are
          unaffected; subsequent exports use the new rules immediately.
        </p>
      </Modal.Body>

      <Modal.Actions>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 transition-colors"
        >
          {busy ? (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          ) : (
            <AlertTriangle size={14} aria-hidden="true" />
          )}
          {busy ? "Activating…" : "Activate this version"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
}
