// src/components/student/profile/LanguageGoalsSection.tsx
import { useState } from "react";
import {
  Languages,
  Edit3,
  X,
  Check,
  Loader2,
  Target,
  Clock,
} from "lucide-react";
import type {
  StudentProfile,
  LanguageLevel,
  ScheduleSlot,
} from "../../../data/student/studentProfileData";
import {
  languageLevels,
  nativeLanguageOptions,
  goalOptions,
  scheduleOptions,
} from "../../../data/student/studentProfileData";

interface Props {
  profile: StudentProfile;
  onSave: (data: Partial<StudentProfile>) => Promise<boolean>;
}

export default function LanguageGoalsSection({ profile, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nativeLanguage: profile.nativeLanguage,
    currentLevel: profile.currentLevel,
    targetLevel: profile.targetLevel,
    learningGoals: profile.learningGoals,
    preferredSchedule: profile.preferredSchedule,
  });

  const toggleGoal = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(goal)
        ? prev.learningGoals.filter((g) => g !== goal)
        : [...prev.learningGoals, goal],
    }));
  };

  const toggleSchedule = (slot: ScheduleSlot) => {
    setForm((prev) => ({
      ...prev,
      preferredSchedule: prev.preferredSchedule.includes(slot)
        ? prev.preferredSchedule.filter((s) => s !== slot)
        : [...prev.preferredSchedule, slot],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const saved = await onSave(form);
    setSaving(false);
    if (saved) {
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setForm({
      nativeLanguage: profile.nativeLanguage,
      currentLevel: profile.currentLevel,
      targetLevel: profile.targetLevel,
      learningGoals: profile.learningGoals,
      preferredSchedule: profile.preferredSchedule,
    });
    setEditing(false);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors";
  const labelClass = "text-[11px] font-medium text-[#0B2343]/40 mb-1 block";

  // Progress calc
  const levelIndex = languageLevels.findIndex(
    (l) => l.value === profile.currentLevel
  );
  const targetIndex = languageLevels.findIndex(
    (l) => l.value === profile.targetLevel
  );
  const progressPercent =
    targetIndex > 0 ? Math.round((levelIndex / targetIndex) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
            <Languages size={13} className="text-purple-500" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Language & Goals
          </h3>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B2343]/[0.04] text-[11px] text-[#0B2343]/45 hover:bg-[#0B2343]/[0.08] transition-colors"
          >
            <Edit3 size={11} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-[#0B2343]/35 hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <X size={11} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ff7c22] text-white text-[11px] font-medium hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Check size={11} />
              )}
              Save
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Native Language</label>
              <select
                value={form.nativeLanguage}
                onChange={(e) =>
                  setForm({ ...form, nativeLanguage: e.target.value })
                }
                className={inputClass}
              >
                <option value="">Select</option>
                {nativeLanguageOptions.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Current Level</label>
              <select
                value={form.currentLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    currentLevel: e.target.value as LanguageLevel,
                  })
                }
                className={inputClass}
              >
                {languageLevels.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Target Level</label>
              <select
                value={form.targetLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    targetLevel: e.target.value as LanguageLevel,
                  })
                }
                className={inputClass}
              >
                {languageLevels.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preferred Schedule – multi-toggle */}
          <div>
            <label className={labelClass}>Preferred Schedule</label>
            <div className="flex flex-wrap gap-1.5">
              {scheduleOptions.map((slot) => {
                const active = form.preferredSchedule.includes(slot.value);
                return (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => toggleSchedule(slot.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                      active
                        ? "border-purple-300 bg-purple-50 text-purple-600"
                        : "border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/[0.12]"
                    }`}
                  >
                    <Clock size={10} className="inline mr-1 -mt-px" />
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learning Goals – multi-toggle */}
          <div>
            <label className={labelClass}>Learning Goals</label>
            <div className="flex flex-wrap gap-1.5">
              {goalOptions.map((goal) => {
                const active = form.learningGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-colors ${
                      active
                        ? "border-[#ff7c22]/30 bg-[#ff7c22]/[0.08] text-[#ff7c22]"
                        : "border-[#0B2343]/[0.06] text-[#0B2343]/30 hover:border-[#0B2343]/[0.12]"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Level journey */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B2343]/[0.015] border border-[#0B2343]/[0.04]">
            <div className="text-center shrink-0">
              <span className="text-base font-bold text-[#ff7c22] capitalize">
                {profile.currentLevel}
              </span>
              <p className="text-[9px] text-[#0B2343]/25">Current</p>
            </div>
            <div className="flex-1">
              <div className="h-1.5 bg-[#0B2343]/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff7c22] to-green-400 rounded-full transition-all"
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                />
              </div>
            </div>
            <div className="text-center shrink-0">
              <span className="text-base font-bold text-green-500 capitalize">
                {profile.targetLevel}
              </span>
              <p className="text-[9px] text-[#0B2343]/25">Target</p>
            </div>
          </div>

          {/* Grid info */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <p className="text-[10px] text-[#0B2343]/25">Native Language</p>
              <p className="text-sm text-[#0B2343]/60">
                {profile.nativeLanguage || (
                  <span className="text-[#0B2343]/15 italic">Not set</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#0B2343]/25">
                Preferred Schedule
              </p>
              {profile.preferredSchedule.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {profile.preferredSchedule.map((slot) => (
                    <span
                      key={slot}
                      className="text-[11px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md capitalize flex items-center gap-1"
                    >
                      <Clock size={9} className="text-purple-400" />
                      {slot}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#0B2343]/60 flex items-center gap-1">
                  <Clock size={11} className="text-[#0B2343]/20" />
                  <span className="text-[#0B2343]/15 italic">Not set</span>
                </p>
              )}
            </div>
          </div>

          {/* Goals */}
          {profile.learningGoals.length > 0 && (
            <div className="pt-2 border-t border-[#0B2343]/[0.03]">
              <p className="text-[10px] text-[#0B2343]/25 mb-1.5 flex items-center gap-1">
                <Target size={10} />
                Learning Goals
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.learningGoals.map((goal) => (
                  <span
                    key={goal}
                    className="text-[11px] font-medium text-[#0B2343]/45 bg-[#ff7c22]/[0.06] px-2.5 py-1 rounded-lg"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
