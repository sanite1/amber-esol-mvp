import { useState } from "react";
import {
  PoundSterling,
  TrendingUp,
  Zap,
  Shield,
  Star,
  Pencil,
  X,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { TutorProfileData } from "../../../data/tutor/tutorProfileData";

interface Props {
  profile: TutorProfileData;
  onUpdate: (updates: Partial<TutorProfileData>) => void;
}

export default function ProfileRatesInfo({ profile, onUpdate }: Props) {
  const { stats } = profile;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formRate, setFormRate] = useState(String(profile.hourlyRate));
  const [formTrial, setFormTrial] = useState(String(profile.trialRate));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startEdit = () => {
    setFormRate(String(profile.hourlyRate));
    setFormTrial(String(profile.trialRate));
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
    if (formTrial.trim() !== "" && isNaN(Number(formTrial)))
      e.trial = "Enter a valid amount or 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onUpdate({
      hourlyRate: Number(formRate),
      trialRate: Number(formTrial || 0),
    });
    setSaving(false);
    setEditing(false);
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
              disabled={saving}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <X size={11} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B2343] text-white text-[10px] sm:text-[11px] font-medium hover:bg-[#0B2343]/90 disabled:opacity-40 transition-colors"
            >
              {saving ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Check size={11} />
              )}
              {saving ? "Saving…" : "Save"}
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
              £{profile.hourlyRate}
            </p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-lg p-2.5 sm:p-3 text-center">
            <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35">
              Trial Lesson
            </p>
            <p className="text-base sm:text-lg font-bold text-emerald-600 mt-0.5">
              {profile.trialRate === 0 ? "Free" : `£${profile.trialRate}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-3">
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
              className={inputClass(!!errors.trial)}
            />
            {errors.trial && (
              <p className="flex items-center justify-center gap-1 mt-1 text-[9px] text-red-500">
                <AlertCircle size={9} />
                {errors.trial}
              </p>
            )}
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
            {stats.completionRate}%
          </span>
        </div>
        <div className="flex items-center justify-between py-2 px-2.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
            <Zap size={12} className="text-amber-400" />
            Response Rate
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-[#0B2343]">
            {stats.responseRate}%
          </span>
        </div>
        <div className="flex items-center justify-between py-2 px-2.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
            <Shield size={12} className="text-blue-400" />
            Avg Response Time
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-[#0B2343]">
            {stats.responseTime}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 px-2.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.015]">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40">
            <Star size={12} className="text-amber-400" />
            Reviews
          </span>
          <span className="text-xs sm:text-[13px] font-bold text-[#0B2343]">
            {stats.totalReviews}
          </span>
        </div>
      </div>

      <p className="text-[10px] sm:text-[11px] text-[#0B2343]/20 text-center mt-3 pt-3 border-t border-[#0B2343]/[0.04]">
        Member since{" "}
        {new Date(profile.joined).toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
