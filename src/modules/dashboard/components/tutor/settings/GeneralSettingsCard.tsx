import { useState } from "react";
import { Globe, Languages, Pencil, X, Check, Loader2 } from "lucide-react";
import type { TutorSettingsData } from "../../../data/tutor/tutorSettingsData";
import {
  timezoneOptions,
  languageOptions,
} from "../../../data/tutor/tutorSettingsData";

interface Props {
  settings: TutorSettingsData;
  onUpdate: (updates: Partial<TutorSettingsData>) => void;
}

export default function GeneralSettingsCard({ settings, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formTimezone, setFormTimezone] = useState(settings.timezone);
  const [formLanguage, setFormLanguage] = useState(settings.language);

  const startEdit = () => {
    setFormTimezone(settings.timezone);
    setFormLanguage(settings.language);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onUpdate({ timezone: formTimezone, language: formLanguage });
    setSaving(false);
    setEditing(false);
  };

  const selectClass =
    "w-full px-3 py-2 rounded-lg border border-[#0B2343]/[0.1] bg-[#fafbfc] text-xs sm:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/40 focus:bg-white transition-colors cursor-pointer";

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343]">
          General
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

      <div className="space-y-3">
        {/* Timezone */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
          <label className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40 sm:w-32 shrink-0">
            <Globe size={13} className="text-[#0B2343]/25" />
            Timezone
          </label>
          {!editing ? (
            <p className="text-xs sm:text-[13px] font-medium text-[#0B2343]/70">
              {settings.timezone}
            </p>
          ) : (
            <select
              value={formTimezone}
              onChange={(e) => setFormTimezone(e.target.value)}
              className={selectClass}
            >
              {timezoneOptions.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Language */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
          <label className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0B2343]/40 sm:w-32 shrink-0">
            <Languages size={13} className="text-[#0B2343]/25" />
            Language
          </label>
          {!editing ? (
            <p className="text-xs sm:text-[13px] font-medium text-[#0B2343]/70">
              {settings.language}
            </p>
          ) : (
            <select
              value={formLanguage}
              onChange={(e) => setFormLanguage(e.target.value)}
              className={selectClass}
            >
              {languageOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
