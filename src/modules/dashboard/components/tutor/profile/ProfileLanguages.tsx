import { useState } from "react";
import {
  Languages,
  Pencil,
  X,
  Check,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type { TutorLanguage } from "../../../data/tutor/tutorProfileData";

interface Props {
  languages: TutorLanguage[];
  onUpdate: (languages: TutorLanguage[]) => void;
}

const levelOptions: TutorLanguage["level"][] = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
];

const levelColors: Record<string, string> = {
  Native: "bg-emerald-50 text-emerald-600",
  Fluent: "bg-blue-50 text-blue-600",
  Advanced: "bg-[#ff7c22]/10 text-[#ff7c22]",
  Intermediate: "bg-[#0B2343]/[0.05] text-[#0B2343]/40",
};

export default function ProfileLanguages({ languages, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formList, setFormList] = useState<TutorLanguage[]>([]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const startEdit = () => {
    setFormList(languages.map((l) => ({ ...l })));
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const updateLang = (i: number, field: keyof TutorLanguage, value: string) => {
    setFormList((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l))
    );
  };

  const addLang = () => {
    setFormList((prev) => [...prev, { language: "", level: "Intermediate" }]);
  };

  const removeLang = (i: number) => {
    setFormList((prev) => prev.filter((_, idx) => idx !== i));
  };

  const validate = (): boolean => {
    const e: Record<number, string> = {};
    formList.forEach((l, i) => {
      if (!l.language.trim()) e[i] = "Language name is required";
    });
    if (formList.length === 0) e[-1] = "Add at least one language";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onUpdate(
      formList.map((l) => ({
        language: l.language.trim(),
        level: l.level,
      }))
    );
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] flex items-center gap-2">
          <Languages size={14} className="text-[#0B2343]/30" />
          Languages
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

      {/* View mode */}
      {!editing ? (
        <div className="space-y-2">
          {languages.map((lang) => (
            <div
              key={lang.language}
              className="flex items-center justify-between gap-3 py-2 px-2.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.015]"
            >
              <span className="text-xs sm:text-[13px] font-medium text-[#0B2343]/60">
                {lang.language}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  levelColors[lang.level] || levelColors.Intermediate
                }`}
              >
                {lang.level}
              </span>
            </div>
          ))}
          {languages.length === 0 && (
            <p className="text-xs text-[#0B2343]/25 text-center py-4">
              No languages added yet.
            </p>
          )}
        </div>
      ) : (
        /* Edit mode */
        <div className="space-y-2">
          {formList.map((lang, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg border border-[#0B2343]/[0.06] bg-[#0B2343]/[0.01]"
            >
              <div className="flex-1 min-w-0">
                <input
                  value={lang.language}
                  onChange={(e) => updateLang(i, "language", e.target.value)}
                  placeholder="Language"
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs text-[#0B2343] outline-none transition-colors ${
                    errors[i]
                      ? "border-red-300 bg-red-50/30"
                      : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40"
                  }`}
                />
                {errors[i] && (
                  <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                    <AlertCircle size={9} />
                    {errors[i]}
                  </p>
                )}
              </div>
              <select
                value={lang.level}
                onChange={(e) => updateLang(i, "level", e.target.value)}
                className="shrink-0 px-2 py-1.5 rounded-lg border border-[#0B2343]/[0.1] bg-[#fafbfc] text-[11px] sm:text-xs text-[#0B2343] outline-none focus:border-[#ff7c22]/40"
              >
                {levelOptions.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeLang(i)}
                className="shrink-0 p-1.5 rounded-lg text-[#0B2343]/20 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}

          {errors[-1] && (
            <p className="flex items-center gap-1 text-[10px] text-red-500">
              <AlertCircle size={10} />
              {errors[-1]}
            </p>
          )}

          <button
            onClick={addLang}
            className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-[#ff7c22] hover:underline"
          >
            <Plus size={13} />
            Add language
          </button>
        </div>
      )}
    </div>
  );
}
