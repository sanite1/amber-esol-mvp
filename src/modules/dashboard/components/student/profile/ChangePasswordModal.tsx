import { useState } from "react";
import { X, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  onClose: () => void;
  onSubmit?: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
  isPending?: boolean;
}

export default function ChangePasswordModal({
  onClose,
  onSubmit,
  isPending = false,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isLongEnough = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;
  const isValid =
    isLongEnough &&
    hasUppercase &&
    hasNumber &&
    passwordsMatch &&
    currentPassword.length > 0;

  const isBusy = saving || isPending;

  const handleSubmit = async () => {
    if (!isValid) return;
    setError("");
    setSaving(true);

    try {
      if (onSubmit) {
        await onSubmit(currentPassword, newPassword, confirmPassword);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setSaving(false);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err: unknown) {
      setSaving(false);
      const message =
        err instanceof Error ? err.message : "Failed to update password.";
      setError(message);
    }
  };

  const inputClass =
    "w-full pl-10 pr-10 py-2.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors";

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
        onClick={!isBusy ? onClose : undefined}
      />

      {/* Drawer / Modal */}
      <div className="relative z-[10000] w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header — sticky */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343] flex items-center gap-2">
            <Lock size={15} className="text-[#0B2343]/30" />
            Change Password
          </h3>
          {!isBusy && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <X size={16} className="text-[#0B2343]/30" />
            </button>
          )}
        </div>

        {success ? (
          /* Success view */
          <div className="px-4 py-8 sm:px-5 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-green-500" />
            </div>
            <p className="text-sm font-semibold text-[#0B2343] mb-1">
              Password Updated
            </p>
            <p className="text-[11px] text-[#0B2343]/30">
              Your password has been changed successfully.
            </p>
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* Current password */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
                  Current Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50"
                  >
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
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
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={14}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/25 hover:text-[#0B2343]/50"
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {confirmPassword.length > 0 &&
                  confirmPassword !== newPassword && (
                    <p className="text-[10px] text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* Password requirements */}
              {newPassword.length > 0 && (
                <div className="p-2.5 rounded-xl bg-[#0B2343]/[0.02] space-y-1">
                  {[
                    { met: isLongEnough, label: "At least 8 characters" },
                    { met: hasUppercase, label: "One uppercase letter" },
                    { met: hasNumber, label: "One number" },
                    { met: passwordsMatch, label: "Passwords match" },
                  ].map((req) => (
                    <div
                      key={req.label}
                      className={`flex items-center gap-1.5 text-[10px] sm:text-[11px] ${
                        req.met ? "text-green-500" : "text-[#0B2343]/25"
                      }`}
                    >
                      <CheckCircle2
                        size={10}
                        fill={req.met ? "currentColor" : "none"}
                      />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2">
              <button
                onClick={onClose}
                disabled={isBusy}
                className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid || isBusy}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#ff7c22] text-white text-xs sm:text-[13px] font-medium hover:bg-[#e56a10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                {isBusy ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Updating
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
