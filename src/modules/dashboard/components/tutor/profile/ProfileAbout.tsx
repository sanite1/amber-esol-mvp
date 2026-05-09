import { useState } from "react";
import {
  ChevronDown,
  Pencil,
  X,
  Check,
  Loader2,
  AlertCircle,
  Plus,
} from "lucide-react";
import type {
  TeachingPreferences,
  UserData,
} from "../../../lib/types/authOnboarding";

interface Props {
  user: UserData;
  onUpdate: (updates: Partial<UserData>) => Promise<void>;
  isUpdating: boolean;
}

interface FormErrors {
  bio?: string;
  specializations?: string;
}

const allLessonTypes = ["one-on-one", "group"] as const;

const allLevels = [
  "beginner",
  "elementary",
  "intermediate",
  "upper-intermediate",
  "advanced",
] as const;

const levelLabels: Record<string, string> = {
  beginner: "Beginner",
  elementary: "Elementary",
  intermediate: "Intermediate",
  "upper-intermediate": "Upper-Int.",
  advanced: "Advanced",
};

const lessonTypeLabels: Record<string, string> = {
  "one-on-one": "One-on-One",
  group: "Group",
};

export default function ProfileAbout({ user, onUpdate, isUpdating }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formBio, setFormBio] = useState(user.bio ?? "");
  const [formSpecializations, setFormSpecializations] = useState<string[]>([
    ...(user.specializations ?? []),
  ]);
  const [formLessonTypes, setFormLessonTypes] = useState<string[]>([
    ...(user.teachingPreferences?.lessonTypes ?? []),
  ]);
  const [formPreferredLevels, setFormPreferredLevels] = useState<string[]>([
    ...(user.teachingPreferences?.preferredLevels ?? []),
  ]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const bioPreviewLength = 220;
  const bioText = user.bio ?? "";
  const needsTruncate = bioText.length > bioPreviewLength;

  const startEdit = () => {
    setFormBio(user.bio ?? "");
    setFormSpecializations([...(user.specializations ?? [])]);
    setFormLessonTypes([...(user.teachingPreferences?.lessonTypes ?? [])]);
    setFormPreferredLevels([
      ...(user.teachingPreferences?.preferredLevels ?? []),
    ]);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formBio.trim()) e.bio = "Bio is required";
    else if (formBio.trim().length < 50)
      e.bio = "Bio should be at least 50 characters";
    if (formSpecializations.length === 0)
      e.specializations = "Add at least one specialty";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onUpdate({
        bio: formBio.trim(),
        specializations: formSpecializations,
        teachingPreferences: {
          ...(user.teachingPreferences as TeachingPreferences),
          lessonTypes: formLessonTypes as ("one-on-one" | "group")[],
          preferredLevels: formPreferredLevels as (
            | "beginner"
            | "elementary"
            | "intermediate"
            | "upper-intermediate"
            | "advanced"
          )[],
        },
      });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const toggleItem = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    setList(
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value],
    );
  };

  const addChip = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void,
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput("");
  };

  const removeChip = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    setList(list.filter((i) => i !== value));
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-lg border text-base lg:text-sm text-[#0B2343] outline-none transition-colors resize-none ${
      hasError
        ? "border-red-300 bg-red-50/30 focus:border-red-400"
        : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40 focus:bg-white"
    }`;

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343]">
          About Me
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

      {/* Bio */}
      {!editing ? (
        <div className="mb-4">
          <p className="text-xs sm:text-[13px] text-[#0B2343]/50 leading-relaxed">
            {expanded || !needsTruncate
              ? bioText
              : `${bioText.slice(0, bioPreviewLength)}…`}
          </p>
          {!bioText && (
            <p className="text-xs sm:text-[13px] text-[#0B2343]/50 leading-relaxed italic">
              Not Set
            </p>
          )}
          {needsTruncate && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-1.5 text-[11px] sm:text-xs text-[#ff7c22] font-medium hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
              <ChevronDown
                size={12}
                className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <label className="text-[10px] font-medium text-[#0B2343]/40 mb-1 block">
            Bio
          </label>
          <textarea
            value={formBio}
            onChange={(e) => setFormBio(e.target.value)}
            rows={5}
            placeholder="Tell students about yourself…"
            className={inputClass(!!errors.bio)}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.bio ? (
              <p className="flex items-center gap-1 text-[10px] text-red-500">
                <AlertCircle size={10} />
                {errors.bio}
              </p>
            ) : (
              <span />
            )}
            <span className="text-[10px] text-[#0B2343]/20">
              {formBio.length} chars
            </span>
          </div>
        </div>
      )}

      {/* Specializations */}
      <div className="pt-3 border-t border-[#0B2343]/[0.04]">
        <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
          Specialties
        </h4>
        {!editing ? (
          <div className="flex flex-wrap gap-1.5">
            {user.specializations ? (
              (user.specializations ?? []).map((s) => (
                <span
                  key={s}
                  className="text-[10px] sm:text-[11px] font-medium text-[#ff7c22] bg-[#ff7c22]/[0.08] px-2 py-0.5 rounded-full"
                >
                  {s}
                </span>
              ))
            ) : (
              <p className="text-xs sm:text-[13px] text-[#0B2343]/50 leading-relaxed italic">
                Not Set
              </p>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formSpecializations.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#ff7c22] bg-[#ff7c22]/[0.08] pl-2 pr-1 py-0.5 rounded-full"
                >
                  {s}
                  <button
                    onClick={() =>
                      removeChip(s, formSpecializations, setFormSpecializations)
                    }
                    className="p-0.5 rounded-full hover:bg-[#ff7c22]/20"
                  >
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChip(
                      newSpecialty,
                      formSpecializations,
                      setFormSpecializations,
                      setNewSpecialty,
                    );
                  }
                }}
                placeholder="Add specialty…"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] outline-none focus:border-[#ff7c22]/30"
              />
              <button
                onClick={() =>
                  addChip(
                    newSpecialty,
                    formSpecializations,
                    setFormSpecializations,
                    setNewSpecialty,
                  )
                }
                className="shrink-0 p-1.5 rounded-lg bg-[#0B2343]/[0.04] hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                <Plus size={12} className="text-[#0B2343]/40" />
              </button>
            </div>
            {errors.specializations && (
              <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                <AlertCircle size={10} />
                {errors.specializations}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Lesson Types */}
      <div className="pt-3 mt-3 border-t border-[#0B2343]/[0.04]">
        <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
          Lesson Types
        </h4>
        {!editing ? (
          <div className="flex flex-wrap gap-1.5">
            {user.teachingPreferences?.lessonTypes ? (
              (user.teachingPreferences?.lessonTypes ?? []).map((t) => (
                <span
                  key={t}
                  className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 bg-[#0B2343]/[0.04] px-2 py-0.5 rounded-full"
                >
                  {lessonTypeLabels[t] ?? t}
                </span>
              ))
            ) : (
              <p className="text-xs sm:text-[13px] text-[#0B2343]/50 leading-relaxed italic">
                Not Set
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {allLessonTypes.map((t) => (
              <button
                key={t}
                onClick={() =>
                  toggleItem(t, formLessonTypes, setFormLessonTypes)
                }
                className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-colors ${
                  formLessonTypes.includes(t)
                    ? "bg-[#0B2343] text-white"
                    : "bg-[#0B2343]/[0.04] text-[#0B2343]/25 hover:bg-[#0B2343]/[0.08]"
                }`}
              >
                {lessonTypeLabels[t] ?? t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preferred Levels */}
      <div className="pt-3 mt-3 border-t border-[#0B2343]/[0.04]">
        <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
          Preferred Levels
        </h4>
        {!editing ? (
          <div className="flex flex-wrap gap-1.5">
            {user.teachingPreferences?.preferredLevels ? (
              (user.teachingPreferences?.preferredLevels ?? []).map((l) => (
                <span
                  key={l}
                  className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 bg-[#0B2343]/[0.04] px-2 py-0.5 rounded-full"
                >
                  {levelLabels[l] ?? l}
                </span>
              ))
            ) : (
              <p className="text-xs sm:text-[13px] text-[#0B2343]/50 leading-relaxed italic">
                Not Set
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {allLevels.map((l) => (
              <button
                key={l}
                onClick={() =>
                  toggleItem(l, formPreferredLevels, setFormPreferredLevels)
                }
                className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-colors ${
                  formPreferredLevels.includes(l)
                    ? "bg-[#0B2343] text-white"
                    : "bg-[#0B2343]/[0.04] text-[#0B2343]/25 hover:bg-[#0B2343]/[0.08]"
                }`}
              >
                {levelLabels[l] ?? l}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
