import { useState } from "react";
import {
  X,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

export default function ChangePasswordModal({ onClose, onConfirm }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!currentPassword.trim()) e.current = "Current password is required";
    if (!newPassword.trim()) e.new = "New password is required";
    else if (newPassword.length < 8) e.new = "Must be at least 8 characters";
    else if (!/[A-Z]/.test(newPassword))
      e.new = "Must include an uppercase letter";
    else if (!/[0-9]/.test(newPassword)) e.new = "Must include a number";
    if (!confirmPassword.trim()) e.confirm = "Please confirm your password";
    else if (confirmPassword !== newPassword)
      e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSuccess(true);
    onConfirm();
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl">
          <div className="px-5 py-8 sm:py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B2343] mb-1">
              Password Changed
            </h3>
            <p className="text-xs sm:text-[13px] text-[#0B2343]/40">
              Your password has been updated successfully.
            </p>
          </div>
          <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06]">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#0B2343] text-white text-xs sm:text-[13px] font-medium hover:bg-[#0B2343]/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full pl-3 pr-10 py-2.5 rounded-lg border text-xs sm:text-sm text-[#0B2343] outline-none transition-colors ${
      hasError
        ? "border-red-300 bg-red-50/30 focus:border-red-400"
        : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40 focus:bg-white"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-[#0B2343]/[0.06] sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#0B2343] flex items-center gap-2">
            <KeyRound size={16} className="text-[#0B2343]/30" />
            Change Password
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/30" />
          </button>
        </div>

        <div className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
          {/* Current password */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errors.current) setErrors((p) => ({ ...p, current: "" }));
                }}
                placeholder="Enter current password"
                className={inputClass(!!errors.current)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/20 hover:text-[#0B2343]/40"
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.current && (
              <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                <AlertCircle size={10} />
                {errors.current}
              </p>
            )}
          </div>

          {/* New password */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.new) setErrors((p) => ({ ...p, new: "" }));
                }}
                placeholder="Enter new password"
                className={inputClass(!!errors.new)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/20 hover:text-[#0B2343]/40"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.new && (
              <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                <AlertCircle size={10} />
                {errors.new}
              </p>
            )}
            {/* Strength hints */}
            {newPassword && !errors.new && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[
                  { label: "8+ chars", ok: newPassword.length >= 8 },
                  { label: "Uppercase", ok: /[A-Z]/.test(newPassword) },
                  { label: "Number", ok: /[0-9]/.test(newPassword) },
                ].map((rule) => (
                  <span
                    key={rule.label}
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                      rule.ok
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-[#0B2343]/[0.04] text-[#0B2343]/25"
                    }`}
                  >
                    {rule.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 mb-1.5 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirm) setErrors((p) => ({ ...p, confirm: "" }));
                }}
                placeholder="Confirm new password"
                className={inputClass(!!errors.confirm)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/20 hover:text-[#0B2343]/40"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirm && (
              <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                <AlertCircle size={10} />
                {errors.confirm}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 sm:px-5 border-t border-[#0B2343]/[0.06] flex items-center gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#0B2343]/[0.04] text-xs sm:text-[13px] font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0B2343] text-white text-xs sm:text-[13px] font-medium hover:bg-[#0B2343]/90 disabled:opacity-40 transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
