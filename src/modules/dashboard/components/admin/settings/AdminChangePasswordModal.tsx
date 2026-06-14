import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react";
import Modal from "../../../../../components/Modal";

interface Props {
  onClose: () => void;
  onSave: () => void;
}

export default function AdminChangePasswordModal({ onClose, onSave }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!currentPassword.trim())
      errs.currentPassword = "Current password is required";
    if (!hasMinLength) errs.newPassword = "At least 8 characters";
    else if (!hasUppercase)
      errs.newPassword = "Must contain an uppercase letter";
    else if (!hasNumber) errs.newPassword = "Must contain a number";
    if (!passwordsMatch) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      onSave();
    }, 1500);
  }

  const inputClass = (field: string) =>
    `block w-full rounded-xl bg-white px-3 pr-11 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 ${
      errors[field]
        ? "border border-red-300 focus-visible:ring-red-500 focus-visible:border-red-500"
        : "border border-[#0B2343]/[0.12] focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]"
    }`;

  function Chip({ met, label }: { met: boolean; label: string }) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
          met
            ? "bg-emerald-50 text-emerald-600"
            : "bg-[#0B2343]/[0.04] text-[#0B2343]/40"
        }`}
      >
        {met ? <Check size={9} aria-hidden="true" /> : null}
        {label}
      </span>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Change Password"
      titleId="admin-change-password-title"
      size="sm"
      disableEscapeKey={saving}
      disableBackdropClick={saving}
    >
      <Modal.Body>
        {success ? (
          <div className="text-center py-6" role="status">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <Check
                size={24}
                aria-hidden="true"
                className="text-emerald-500"
              />
            </div>
            <p className="text-sm font-semibold text-[#0B2343] mb-1">
              Password Changed
            </p>
            <p className="text-xs text-[#0B2343]/50">
              Your password has been updated successfully.
            </p>
          </div>
        ) : (
          <form
            id="admin-change-password-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-3"
          >
            {/* Current */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass("currentPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                  aria-pressed={showCurrent}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30 hover:text-[#0B2343]/60"
                >
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
                  <AlertCircle size={10} aria-hidden="true" />
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                  aria-pressed={showNew}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30 hover:text-[#0B2343]/60"
                >
                  {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
                  <AlertCircle size={10} aria-hidden="true" />
                  {errors.newPassword}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <Chip met={hasMinLength} label="8+ chars" />
                <Chip met={hasUppercase} label="Uppercase" />
                <Chip met={hasNumber} label="Number" />
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  aria-pressed={showConfirm}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30 hover:text-[#0B2343]/60"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
                  <AlertCircle size={10} aria-hidden="true" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </form>
        )}
      </Modal.Body>
      {!success && (
        <Modal.Actions>
          <button
            type="submit"
            form="admin-change-password-form"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
          >
            {saving && (
              <Loader2 size={14} aria-hidden="true" className="animate-spin" />
            )}
            {saving ? "Updating…" : "Update Password"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2.5 min-h-[44px] rounded-xl bg-white border border-[#0B2343]/[0.12] text-[#0B2343] text-sm font-bold hover:bg-[#fafbfc] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </Modal.Actions>
      )}
    </Modal>
  );
}
