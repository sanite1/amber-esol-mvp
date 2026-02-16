import { useState } from "react";
import { X, Eye, EyeOff, Loader2, CheckCircle2, Lock } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
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

  const handleSubmit = async () => {
    if (!isValid) return;
    setError("");
    setSaving(true);
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => onClose(), 1500);
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors pr-10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0B2343]/40 backdrop-blur-sm"
        onClick={!saving ? onClose : undefined}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
              <Lock size={14} className="text-[#ff7c22]" />
            </div>
            <h2 className="text-sm font-semibold text-[#0B2343]">
              Change Password
            </h2>
          </div>
          {!saving && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <X size={15} className="text-[#0B2343]/25" />
            </button>
          )}
        </div>

        {success ? (
          <div className="px-5 pb-6 pt-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-green-500" />
            </div>
            <p className="text-sm font-semibold text-[#0B2343] mb-1">
              Password Updated
            </p>
            <p className="text-xs text-[#0B2343]/35">
              Your password has been changed successfully.
            </p>
          </div>
        ) : (
          <div className="px-5 pb-5">
            {error && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Current password */}
              <div>
                <label className="text-[11px] font-medium text-[#0B2343]/40 mb-1 block">
                  Current Password
                </label>
                <div className="relative">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showCurrent ? (
                      <EyeOff size={14} className="text-[#0B2343]/20" />
                    ) : (
                      <Eye size={14} className="text-[#0B2343]/20" />
                    )}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="text-[11px] font-medium text-[#0B2343]/40 mb-1 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showNew ? (
                      <EyeOff size={14} className="text-[#0B2343]/20" />
                    ) : (
                      <Eye size={14} className="text-[#0B2343]/20" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="text-[11px] font-medium text-[#0B2343]/40 mb-1 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirm ? (
                      <EyeOff size={14} className="text-[#0B2343]/20" />
                    ) : (
                      <Eye size={14} className="text-[#0B2343]/20" />
                    )}
                  </button>
                </div>
              </div>

              {/* Requirements */}
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
                      className={`flex items-center gap-1.5 text-[11px] ${
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

            <button
              onClick={handleSubmit}
              disabled={!isValid || saving}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#ff7c22] text-white text-sm font-semibold hover:bg-[#e56a10] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Updating…
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
