import { useState } from "react";
import {
  Award,
  Pencil,
  X,
  Check,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type { TutorQualification } from "../../../data/tutor/tutorProfileData";

interface Props {
  qualifications: TutorQualification[];
  onUpdate: (qualifications: TutorQualification[]) => void;
}

interface QualForm {
  id: string;
  title: string;
  institution: string;
  year: string;
}

export default function ProfileQualifications({
  qualifications,
  onUpdate,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formList, setFormList] = useState<QualForm[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startEdit = () => {
    setFormList(
      qualifications.map((q) => ({
        id: q.id,
        title: q.title,
        institution: q.institution,
        year: String(q.year),
      }))
    );
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const updateField = (id: string, field: keyof QualForm, value: string) => {
    setFormList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addNew = () => {
    setFormList((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        title: "",
        institution: "",
        year: String(new Date().getFullYear()),
      },
    ]);
  };

  const remove = (id: string) => {
    setFormList((prev) => prev.filter((q) => q.id !== id));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    formList.forEach((q) => {
      if (!q.title.trim()) e[`${q.id}-title`] = "Required";
      if (!q.institution.trim()) e[`${q.id}-inst`] = "Required";
      if (!q.year.trim() || isNaN(Number(q.year)))
        e[`${q.id}-year`] = "Valid year required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onUpdate(
      formList.map((q) => ({
        id: q.id,
        title: q.title.trim(),
        institution: q.institution.trim(),
        year: Number(q.year),
      }))
    );
    setSaving(false);
    setEditing(false);
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs text-[#0B2343] outline-none transition-colors ${
      hasError
        ? "border-red-300 bg-red-50/30 focus:border-red-400"
        : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40 focus:bg-white"
    }`;

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] p-3 sm:p-4 md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[13px] sm:text-sm font-semibold text-[#0B2343] flex items-center gap-2">
          <Award size={14} className="text-[#0B2343]/30" />
          Qualifications
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
        <div className="space-y-2.5">
          {qualifications.map((q) => (
            <div
              key={q.id}
              className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-[#0B2343]/[0.015] border border-[#0B2343]/[0.04]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                <Award size={14} className="text-[#0B2343]/25" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-[13px] font-semibold text-[#0B2343] truncate">
                  {q.title}
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35 truncate">
                  {q.institution} · {q.year}
                </p>
              </div>
            </div>
          ))}
          {qualifications.length === 0 && (
            <p className="text-xs text-[#0B2343]/25 text-center py-4">
              No qualifications added yet.
            </p>
          )}
        </div>
      ) : (
        /* Edit mode */
        <div className="space-y-3">
          {formList.map((q) => (
            <div
              key={q.id}
              className="p-2.5 sm:p-3 rounded-lg border border-[#0B2343]/[0.06] bg-[#0B2343]/[0.01] space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <input
                      value={q.title}
                      onChange={(e) =>
                        updateField(q.id, "title", e.target.value)
                      }
                      placeholder="Qualification title"
                      className={inputClass(!!errors[`${q.id}-title`])}
                    />
                    {errors[`${q.id}-title`] && (
                      <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                        <AlertCircle size={9} />
                        {errors[`${q.id}-title`]}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        value={q.institution}
                        onChange={(e) =>
                          updateField(q.id, "institution", e.target.value)
                        }
                        placeholder="Institution"
                        className={inputClass(!!errors[`${q.id}-inst`])}
                      />
                      {errors[`${q.id}-inst`] && (
                        <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                          <AlertCircle size={9} />
                          {errors[`${q.id}-inst`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        value={q.year}
                        onChange={(e) =>
                          updateField(q.id, "year", e.target.value)
                        }
                        placeholder="Year"
                        className={inputClass(!!errors[`${q.id}-year`])}
                      />
                      {errors[`${q.id}-year`] && (
                        <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                          <AlertCircle size={9} />
                          {errors[`${q.id}-year`]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => remove(q.id)}
                  className="shrink-0 p-1.5 rounded-lg text-[#0B2343]/20 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addNew}
            className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-[#ff7c22] hover:underline"
          >
            <Plus size={13} />
            Add qualification
          </button>
        </div>
      )}
    </div>
  );
}
