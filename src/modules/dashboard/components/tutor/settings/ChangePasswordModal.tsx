import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Modal from "../../../../../components/Modal";

interface Props {
  onClose: () => void;
  onSubmit: (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => Promise<void>;
  isPending: boolean;
}

export default function ChangePasswordModal({
  onClose,
  onSubmit,
  isPending,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    currentPassword.length >= 1 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleSubmit = async () => {
    if (!valid) return;
    setError(null);
    try {
      await onSubmit(currentPassword, newPassword, confirmPassword);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to change password",
      );
    }
  };

  const inputClass =
    "block w-full rounded-xl border border-[#0B2343]/[0.12] bg-white pl-10 pr-11 py-2 min-h-[44px] text-sm text-[#0B2343] placeholder:text-[#0B2343]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22] focus-visible:border-[#ff7c22]";

  return (
    <Modal
      open
      onClose={onClose}
      title="Change Password"
      titleId="tutor-change-password-title"
      size="sm"
      disableEscapeKey={isPending}
      disableBackdropClick={isPending}
    >
      <Modal.Body>
        <form
          id="tutor-change-password-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle
                size={14}
                aria-hidden="true"
                className="text-red-500 shrink-0 mt-0.5"
              />
              <p>{error}</p>
            </div>
          )}

          {/* Current password */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
              Current Password
            </label>
            <div className="relative">
              <Lock
                size={14}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
              />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label={showCurrent ? "Hide password" : "Show password"}
                aria-pressed={showCurrent}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50"
              >
                {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
              New Password
            </label>
            <div className="relative">
              <Lock
                size={14}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
              />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide password" : "Show password"}
                aria-pressed={showNew}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50"
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {newPassword.length > 0 && newPassword.length < 8 && (
              <p className="text-[10px] text-amber-500 mt-1">
                Must be at least 8 characters
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0B2343]/55 mb-1.5 block">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock
                size={14}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25"
              />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                aria-pressed={showConfirm}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50"
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {confirmPassword.length > 0 && confirmPassword !== newPassword && (
              <p className="text-[10px] text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Actions>
        <button
          type="submit"
          form="tutor-change-password-form"
          disabled={!valid || isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#ff7c22] text-white text-sm font-bold hover:bg-[#e56a10] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7c22]/40 transition-colors"
        >
          {isPending && (
            <Loader2 size={14} aria-hidden="true" className="animate-spin" />
          )}
          {isPending ? "Updating" : "Update Password"}
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
