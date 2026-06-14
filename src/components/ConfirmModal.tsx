/**
 * ConfirmModal — confirmation dialog built on the Modal primitive.
 *
 * Replaces `window.confirm()` calls, which bypass the design system
 * entirely (native browser chrome, no branding, no mobile sheet, no
 * focus management). Use this for any destructive or hard-to-reverse
 * action that needs a second look before firing.
 *
 * Inherits every Modal behaviour for free:
 *   - centered card on desktop, bottom-sheet + grab handle on mobile
 *   - portal-mounted at z-[100000], light-blur navy backdrop
 *   - Esc / backdrop-click close (blocked while `busy`)
 *   - side-by-side actions, primary right / cancel left
 *
 * Tones map to the platform's semantic palette:
 *   - danger  → red    (revoke, delete, remove)
 *   - warning → amber  (activate config, irreversible-but-not-deleting)
 *   - primary → orange (default confirm)
 */

import React from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";

export type ConfirmTone = "danger" | "warning" | "primary";

const TONE_BUTTON: Record<ConfirmTone, string> = {
  danger:
    "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/40 text-white",
  warning:
    "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500/40 text-white",
  primary:
    "bg-[#ff7c22] hover:bg-[#e56a10] focus-visible:ring-[#ff7c22]/40 text-white",
};

export interface ConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  /** id for aria-labelledby — must be unique per modal instance. */
  titleId: string;
  /** Body copy. A string or richer JSX (e.g. with <strong> names). */
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  /** True while the confirmed action's mutation is in flight —
   *  blocks Esc/backdrop dismissal and shows a spinner. */
  busy?: boolean;
}

export default function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  title,
  titleId,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  busy = false,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      titleId={titleId}
      size="sm"
      disableEscapeKey={busy}
      disableBackdropClick={busy}
    >
      <Modal.Body>
        <div className="text-sm text-[#0B2343]/75 leading-relaxed">
          {message}
        </div>
      </Modal.Body>
      <Modal.Actions>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 transition-colors ${TONE_BUTTON[tone]}`}
        >
          {busy && (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          )}
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
        >
          {cancelLabel}
        </button>
      </Modal.Actions>
    </Modal>
  );
}
