import React, { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Check,
  Lock,
} from "lucide-react";

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
    `w-full pl-3 pr-10 py-2.5 rounded-xl border text-base lg:text-sm text-[#0B2343] bg-[#fafbfc] focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-300 focus:border-red-400"
        : "border-[#0B2343]/[0.08] focus:border-[#ff7c22]/30"
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
        {met ? <Check size={9} /> : null}
        {label}
      </span>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-[#0B2343]/[0.06]">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-[#0B2343]/50" />
            <h2 className="text-sm sm:text-base font-bold text-[#0B2343]">
              Change Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0B2343]/[0.04] flex items-center justify-center hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            <X size={16} className="text-[#0B2343]/60" />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4 sm:py-5">
          {success ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Check size={24} className="text-emerald-500" />
              </div>
              <p className="text-sm font-semibold text-[#0B2343] mb-1">
                Password Changed
              </p>
              <p className="text-xs text-[#0B2343]/50">
                Your password has been updated successfully.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Current */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30 hover:text-[#0B2343]/60"
                  >
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
                    <AlertCircle size={10} />
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30 hover:text-[#0B2343]/60"
                  >
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
                    <AlertCircle size={10} />
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
                <label className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 mb-1 block">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B2343]/30 hover:text-[#0B2343]/60"
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
                    <AlertCircle size={10} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[11px] sm:text-xs font-medium text-[#0B2343]/50 hover:bg-[#0B2343]/[0.04] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2343] text-white text-[11px] sm:text-xs font-medium hover:bg-[#0B2343]/90 transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
