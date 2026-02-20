import { useState } from "react";
import {
  Languages as LanguagesIcon,
  Pencil,
  X,
  Check,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type {
  UserData,
  Language,
  LanguageFluency,
} from "../../../lib/types/authOnboarding";

interface Props {
  user: UserData;
  onUpdate: (updates: Partial<UserData>) => Promise<void>;
  isUpdating: boolean;
}

const fluencyOptions: { value: LanguageFluency; label: string }[] = [
  { value: "native", label: "Native" },
  { value: "fluent", label: "Fluent" },
  { value: "advanced", label: "Advanced" },
  { value: "intermediate", label: "Intermediate" },
  { value: "basic", label: "Basic" },
];

const fluencyColors: Record<LanguageFluency, string> = {
  native: "bg-emerald-50 text-emerald-600",
  fluent: "bg-blue-50 text-blue-600",
  advanced: "bg-[#ff7c22]/10 text-[#ff7c22]",
  intermediate: "bg-purple-50 text-purple-600",
  basic: "bg-[#0B2343]/[0.05] text-[#0B2343]/40",
};

const fluencyLabel = (f: LanguageFluency) =>
  fluencyOptions.find((o) => o.value === f)?.label ?? f;

export default function ProfileLanguages({
  user,
  onUpdate,
  isUpdating,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formLanguages, setFormLanguages] = useState<Language[]>([]);
  const [formNative, setFormNative] = useState("");
  const [newLangName, setNewLangName] = useState("");
  const [newLangFluency, setNewLangFluency] =
    useState<LanguageFluency>("intermediate");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const languages = user.languages ?? [];
  const nativeLanguage = user.nativeLanguage ?? "";

  const startEdit = () => {
    setFormLanguages(languages.map((l) => ({ ...l })));
    setFormNative(nativeLanguage);
    setNewLangName("");
    setNewLangFluency("intermediate");
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const addLang = () => {
    const trimmed = newLangName.trim();
    if (!trimmed) return;
    if (formLanguages.some((l) => l.name === trimmed)) return;
    setFormLanguages((prev) => [
      ...prev,
      { name: trimmed, fluency: newLangFluency },
    ]);
    setNewLangName("");
    setNewLangFluency("intermediate");
  };

  const removeLang = (i: number) => {
    const removed = formLanguages[i];
    setFormLanguages((prev) => prev.filter((_, idx) => idx !== i));
    if (removed.name === formNative) {
      setFormNative("");
    }
  };

  const updateFluency = (i: number, fluency: LanguageFluency) => {
    setFormLanguages((prev) =>
      prev.map((l, idx) => (idx === i ? { ...l, fluency } : l))
    );
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (formLanguages.length === 0) e.list = "Add at least one language";
    if (!formNative.trim()) e.native = "Select a native language";
    else if (!formLanguages.some((l) => l.name === formNative))
      e.native = "Native language must be in your language list";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Ensure the native language entry has fluency "native"
      const finalLanguages = formLanguages.map((l) =>
        l.name === formNative
          ? { ...l, fluency: "native" as LanguageFluency }
          : l
      );
      await onUpdate({
        languages: finalLanguages,
        nativeLanguage: formNative,
      });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] flex items-center gap-2">
          <LanguagesIcon size={14} className="text-[#0B2343]/30" />
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
              key={lang.name}
              className="flex items-center justify-between gap-3 py-2 px-2.5 sm:px-3 rounded-lg bg-[#0B2343]/[0.015]"
            >
              <span className="text-xs sm:text-[13px] font-medium text-[#0B2343]/60">
                {lang.name}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  fluencyColors[lang.fluency] ?? fluencyColors.intermediate
                }`}
              >
                {fluencyLabel(lang.fluency)}
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
        <div className="space-y-3">
          {/* Native language selector */}
          <div>
            <label className="text-[10px] font-medium text-[#0B2343]/40 mb-1 block">
              Native Language
            </label>
            <select
              value={formNative}
              onChange={(e) => setFormNative(e.target.value)}
              className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs text-[#0B2343] outline-none transition-colors ${
                errors.native
                  ? "border-red-300 bg-red-50/30"
                  : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40"
              }`}
            >
              <option value="">Select native language</option>
              {formLanguages.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
            {errors.native && (
              <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                <AlertCircle size={9} />
                {errors.native}
              </p>
            )}
          </div>

          {/* Language list */}
          <div className="space-y-2">
            {formLanguages.map((lang, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 sm:p-2.5 rounded-lg border border-[#0B2343]/[0.06] bg-[#0B2343]/[0.01]"
              >
                <span className="flex-1 text-[11px] sm:text-xs font-medium text-[#0B2343]/60 min-w-0 truncate">
                  {lang.name}
                </span>
                {lang.name === formNative ? (
                  <span className="shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                    Native
                  </span>
                ) : (
                  <select
                    value={lang.fluency}
                    onChange={(e) =>
                      updateFluency(i, e.target.value as LanguageFluency)
                    }
                    className="shrink-0 px-2 py-1.5 rounded-lg border border-[#0B2343]/[0.1] bg-[#fafbfc] text-[11px] sm:text-xs text-[#0B2343] outline-none focus:border-[#ff7c22]/40"
                  >
                    {fluencyOptions
                      .filter((o) => o.value !== "native")
                      .map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                  </select>
                )}
                <button
                  onClick={() => removeLang(i)}
                  className="shrink-0 p-1.5 rounded-lg text-[#0B2343]/20 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          {errors.list && (
            <p className="flex items-center gap-1 text-[10px] text-red-500">
              <AlertCircle size={10} />
              {errors.list}
            </p>
          )}

          {/* Add new language */}
          <div className="flex items-center gap-2">
            <input
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLang();
                }
              }}
              placeholder="Language name…"
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30"
            />
            <select
              value={newLangFluency}
              onChange={(e) =>
                setNewLangFluency(e.target.value as LanguageFluency)
              }
              className="shrink-0 px-2 py-1.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30"
            >
              {fluencyOptions
                .filter((o) => o.value !== "native")
                .map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
            </select>
            <button
              onClick={addLang}
              className="shrink-0 p-1.5 rounded-lg bg-[#0B2343]/[0.04] hover:bg-[#0B2343]/[0.08] transition-colors"
            >
              <Plus size={12} className="text-[#0B2343]/40" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
