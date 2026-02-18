import { useState } from "react";
import {
  PoundSterling,
  TrendingUp,
  Shield,
  Star,
  Pencil,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { UserData } from "../../../lib/types/authOnboarding";

interface Props {
  user: UserData;
  onUpdate: (updates: Partial<UserData>) => Promise<void>;
  isUpdating: boolean;
}

export default function ProfileRatesInfo({
  user,
  onUpdate,
  isUpdating,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [formRate, setFormRate] = useState(String(user.hourlyRate ?? 0));
  const [formTrial, setFormTrial] = useState(
    String(user.trialLessonPrice ?? 0)
  );
  const [formTrialOffered, setFormTrialOffered] = useState(
    user.trialLessonOffered ?? false
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatResponseTime = (min?: number) => {
    if (!min) return "—";
    if (min < 60) return `${min}m`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const startEdit = () => {
    setFormRate(String(user.hourlyRate ?? 0));
    setFormTrial(String(user.trialLessonPrice ?? 0));
    setFormTrialOffered(user.trialLessonOffered ?? false);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formRate.trim() || isNaN(Number(formRate)) || Number(formRate) <= 0)
      e.rate = "Enter a valid rate";
    if (formTrialOffered && formTrial.trim() !== "" && isNaN(Number(formTrial)))
      e.trial = "Enter a valid amount or 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await onUpdate({
        hourlyRate: Number(formRate),
        trialLessonOffered: formTrialOffered,
        trialLessonPrice: formTrialOffered ? Number(formTrial || 0) : 0,
      });
    } finally {
      setEditing(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-lg border text-sm font-bold text-center outline-none transition-colors ${
      hasError
        ? "border-red-300 bg-red-50/30 focus:border-red-400 text-red-600"
        : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40 focus:bg-white text-[#0B2343]"
    }`;

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] flex items-center gap-2">
          <PoundSterling size={14} className="text-[#0B2343]/30" />
          Rates & Performance
        </h3>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#0B2343]/30 hover:text-[#ff7c22] transition-colors"
          >
            <Pencil size={11} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={cancelEdit}
              disabled={isUpdating}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <X size={11} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B2343] text-white text-[10px] sm:text-[11px] font-medium hover:bg-[#0B2343]/90 disabled:opacity-40 transition-colors"
            >
              {isUpdating ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Check size={11} />
              )}
              {isUpdating ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {/* Rates */}
      {!editing ? (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#ff7c22]/[0.04] border border-[#ff7c22]/10 rounded-lg p-2.5 sm:p-3 text-center">
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35">
              Hourly Rate
            </p>
            <p className="text-base sm:text-lg font-bold text-[#ff7c22] mt-0.5">
              £{user.hourlyRate ?? 0}
            </p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-lg p-2.5 sm:p-3 text-center">
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35">
              Trial Lesson
            </p>
            <p className="text-base sm:text-lg font-bold text-emerald-600 mt-0.5">
              {!user.trialLessonOffered
                ? "N/A"
                : (user.trialLessonPrice ?? 0) === 0
                  ? "Free"
                  : `£${user.trialLessonPrice}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#ff7c22]/[0.04] border border-[#ff7c22]/10 rounded-lg p-2.5 sm:p-3">
              <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35 text-center mb-1.5">
                Hourly Rate (£)
              </p>
              <input
                type="number"
                value={formRate}
                onChange={(e) => setFormRate(e.target.value)}
                className={inputClass(!!errors.rate)}
              />
              {errors.rate && (
                <p className="flex items-center justify-center gap-1 mt-1 text-[9px] text-red-500">
                  <AlertCircle size={9} />
                  {errors.rate}
                </p>
              )}
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-lg p-2.5 sm:p-3">
              <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35 text-center mb-1.5">
                Trial Rate (£)
              </p>
              <input
                type="number"
                value={formTrial}
                onChange={(e) => setFormTrial(e.target.value)}
                placeholder="0 = Free"
                disabled={!formTrialOffered}
                className={`${inputClass(!!errors.trial)} ${
                  !formTrialOffered ? "opacity-40" : ""
                }`}
              />
              {errors.trial && (
                <p className="flex items-center justify-center gap-1 mt-1 text-[9px] text-red-500">
                  <AlertCircle size={9} />
                  {errors.trial}
                </p>
              )}
            </div>
          </div>
          {/* Trial toggle */}
          <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-[#0B2343]/[0.015]">
            <span className="text-[11px] sm:text-xs text-[#0B2343]/40">
              Offer trial lesson
            </span>
            <button
              onClick={() => setFormTrialOffered(!formTrialOffered)}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                formTrialOffered ? "bg-emerald-400" : "bg-[#0B2343]/15"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  formTrialOffered ? "translate-x-4" : ""
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Performance metrics (read-only always) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 px-2.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
            <TrendingUp size={12} className="text-emerald-400" />
            Completion Rate
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-[#0B2343]">
            {user.completionRate ?? 0}%
          </span>
        </div>
        <div className="flex items-center justify-between py-2 px-2.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
            <Shield size={12} className="text-blue-400" />
            Avg Response Time
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-[#0B2343]">
            {formatResponseTime(user.responseTime)}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 px-2.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
            <Star size={12} className="text-amber-400" />
            Reviews
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-[#0B2343]">
            {user.numberOfReviews ?? 0}
          </span>
        </div>
      </div>

      <p className="text-[10px] sm:text-[11px] text-[#0B2343]/20 text-center mt-3 pt-3 border-t border-[#0B2343]/[0.04]">
        Member since{" "}
        {new Date(user.createdAt).toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
