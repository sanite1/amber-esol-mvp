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
import type { TutorProfileData } from "../../../data/tutor/tutorProfileData";

interface Props {
  profile: TutorProfileData;
  onUpdate: (updates: Partial<TutorProfileData>) => void;
}

interface FormErrors {
  bio?: string;
  teachingStyle?: string;
  specialties?: string;
}

export default function ProfileAbout({ profile, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formBio, setFormBio] = useState(profile.bio);
  const [formTeachingStyle, setFormTeachingStyle] = useState(
    profile.teachingStyle
  );
  const [formSpecialties, setFormSpecialties] = useState([
    ...profile.specialties,
  ]);
  const [formLessonTypes, setFormLessonTypes] = useState([
    ...profile.lessonTypes,
  ]);
  const [formCefrLevels, setFormCefrLevels] = useState([...profile.cefrLevels]);
  const [formAgeGroups, setFormAgeGroups] = useState([...profile.ageGroups]);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newLessonType, setNewLessonType] = useState("");
  const [newAgeGroup, setNewAgeGroup] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const bioPreviewLength = 220;
  const needsTruncate = profile.bio.length > bioPreviewLength;

  const allCefr = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const startEdit = () => {
    setFormBio(profile.bio);
    setFormTeachingStyle(profile.teachingStyle);
    setFormSpecialties([...profile.specialties]);
    setFormLessonTypes([...profile.lessonTypes]);
    setFormCefrLevels([...profile.cefrLevels]);
    setFormAgeGroups([...profile.ageGroups]);
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
    if (!formTeachingStyle.trim())
      e.teachingStyle = "Teaching style is required";
    if (formSpecialties.length === 0)
      e.specialties = "Add at least one specialty";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onUpdate({
      bio: formBio.trim(),
      teachingStyle: formTeachingStyle.trim(),
      specialties: formSpecialties,
      lessonTypes: formLessonTypes,
      cefrLevels: formCefrLevels,
      ageGroups: formAgeGroups,
    });
    setSaving(false);
    setEditing(false);
  };

  const addChip = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void
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
    setList: (v: string[]) => void
  ) => {
    setList(list.filter((i) => i !== value));
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-lg border text-xs sm:text-sm text-[#0B2343] outline-none transition-colors resize-none ${
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
              ? profile.bio
              : `${profile.bio.slice(0, bioPreviewLength)}…`}
          </p>
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

      {/* Teaching style */}
      <div className="pt-3 border-t border-[#0B2343]/[0.04]">
        <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-1.5">
          Teaching Style
        </h4>
        {!editing ? (
          <p className="text-[11px] sm:text-xs text-[#0B2343]/40 leading-relaxed">
            {profile.teachingStyle}
          </p>
        ) : (
          <div>
            <textarea
              value={formTeachingStyle}
              onChange={(e) => setFormTeachingStyle(e.target.value)}
              rows={3}
              placeholder="Describe your teaching approach…"
              className={inputClass(!!errors.teachingStyle)}
            />
            {errors.teachingStyle && (
              <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                <AlertCircle size={10} />
                {errors.teachingStyle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Specialties */}
      <div className="pt-3 mt-3 border-t border-[#0B2343]/[0.04]">
        <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
          Specialties
        </h4>
        {!editing ? (
          <div className="flex flex-wrap gap-1.5">
            {profile.specialties.map((s) => (
              <span
                key={s}
                className="text-[10px] sm:text-[11px] font-medium text-[#ff7c22] bg-[#ff7c22]/[0.08] px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formSpecialties.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#ff7c22] bg-[#ff7c22]/[0.08] pl-2 pr-1 py-0.5 rounded-full"
                >
                  {s}
                  <button
                    onClick={() =>
                      removeChip(s, formSpecialties, setFormSpecialties)
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
                      formSpecialties,
                      setFormSpecialties,
                      setNewSpecialty
                    );
                  }
                }}
                placeholder="Add specialty…"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-[11px] sm:text-xs text-[#0B2343] outline-none focus:border-[#ff7c22]/30"
              />
              <button
                onClick={() =>
                  addChip(
                    newSpecialty,
                    formSpecialties,
                    setFormSpecialties,
                    setNewSpecialty
                  )
                }
                className="shrink-0 p-1.5 rounded-lg bg-[#0B2343]/[0.04] hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                <Plus size={12} className="text-[#0B2343]/40" />
              </button>
            </div>
            {errors.specialties && (
              <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                <AlertCircle size={10} />
                {errors.specialties}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Lesson types */}
      <div className="pt-3 mt-3 border-t border-[#0B2343]/[0.04]">
        <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
          Lesson Types
        </h4>
        {!editing ? (
          <div className="flex flex-wrap gap-1.5">
            {profile.lessonTypes.map((t) => (
              <span
                key={t}
                className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 bg-[#0B2343]/[0.04] px-2 py-0.5 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formLessonTypes.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 bg-[#0B2343]/[0.04] pl-2 pr-1 py-0.5 rounded-full"
                >
                  {t}
                  <button
                    onClick={() =>
                      removeChip(t, formLessonTypes, setFormLessonTypes)
                    }
                    className="p-0.5 rounded-full hover:bg-[#0B2343]/10"
                  >
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newLessonType}
                onChange={(e) => setNewLessonType(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChip(
                      newLessonType,
                      formLessonTypes,
                      setFormLessonTypes,
                      setNewLessonType
                    );
                  }
                }}
                placeholder="Add lesson type…"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-[11px] sm:text-xs text-[#0B2343] outline-none focus:border-[#ff7c22]/30"
              />
              <button
                onClick={() =>
                  addChip(
                    newLessonType,
                    formLessonTypes,
                    setFormLessonTypes,
                    setNewLessonType
                  )
                }
                className="shrink-0 p-1.5 rounded-lg bg-[#0B2343]/[0.04] hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                <Plus size={12} className="text-[#0B2343]/40" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CEFR levels */}
      <div className="pt-3 mt-3 border-t border-[#0B2343]/[0.04]">
        <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
          Student Levels
        </h4>
        {!editing ? (
          <div className="flex flex-wrap gap-1.5">
            {profile.cefrLevels.map((l) => (
              <span
                key={l}
                className="text-[10px] sm:text-[11px] font-bold text-[#0B2343]/30 bg-[#0B2343]/[0.04] w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center"
              >
                {l}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {allCefr.map((l) => (
              <button
                key={l}
                onClick={() =>
                  setFormCefrLevels((prev) =>
                    prev.includes(l)
                      ? prev.filter((x) => x !== l)
                      : [...prev, l]
                  )
                }
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-[11px] sm:text-xs font-bold transition-colors ${
                  formCefrLevels.includes(l)
                    ? "bg-[#0B2343] text-white"
                    : "bg-[#0B2343]/[0.04] text-[#0B2343]/25 hover:bg-[#0B2343]/[0.08]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Age groups */}
      <div className="pt-3 mt-3 border-t border-[#0B2343]/[0.04]">
        <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
          Age Groups
        </h4>
        {!editing ? (
          <div className="flex flex-wrap gap-1.5">
            {profile.ageGroups.map((a) => (
              <span
                key={a}
                className="text-[10px] sm:text-[11px] font-medium text-[#0B2343]/40 bg-[#0B2343]/[0.04] px-2 py-0.5 rounded-full"
              >
                {a}
              </span>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formAgeGroups.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#0B2343]/50 bg-[#0B2343]/[0.04] pl-2 pr-1 py-0.5 rounded-full"
                >
                  {a}
                  <button
                    onClick={() =>
                      removeChip(a, formAgeGroups, setFormAgeGroups)
                    }
                    className="p-0.5 rounded-full hover:bg-[#0B2343]/10"
                  >
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newAgeGroup}
                onChange={(e) => setNewAgeGroup(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addChip(
                      newAgeGroup,
                      formAgeGroups,
                      setFormAgeGroups,
                      setNewAgeGroup
                    );
                  }
                }}
                placeholder="Add age group…"
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-[#0B2343]/[0.08] bg-[#fafbfc] text-[11px] sm:text-xs text-[#0B2343] outline-none focus:border-[#ff7c22]/30"
              />
              <button
                onClick={() =>
                  addChip(
                    newAgeGroup,
                    formAgeGroups,
                    setFormAgeGroups,
                    setNewAgeGroup
                  )
                }
                className="shrink-0 p-1.5 rounded-lg bg-[#0B2343]/[0.04] hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                <Plus size={12} className="text-[#0B2343]/40" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
