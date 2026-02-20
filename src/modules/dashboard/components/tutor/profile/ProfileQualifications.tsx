import { useState } from "react";
import {
  Award,
  GraduationCap,
  Pencil,
  X,
  Check,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import type { UserData } from "../../../lib/types/authOnboarding";

interface Props {
  user: UserData;
  onUpdate: (updates: Partial<UserData>) => Promise<void>;
  isUpdating: boolean;
}

interface CertForm {
  _key: string;
  name: string;
  issuedBy: string;
  year: string;
}

interface EduForm {
  _key: string;
  degree: string;
  institution: string;
  year: string;
}

export default function ProfileQualifications({
  user,
  onUpdate,
  isUpdating,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [certList, setCertList] = useState<CertForm[]>([]);
  const [eduList, setEduList] = useState<EduForm[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const startEdit = () => {
    setCertList(
      (user.certifications ?? []).map((c, i) => ({
        _key: `cert-${i}-${Date.now()}`,
        name: c.name,
        issuedBy: c.issuedBy,
        year: c.year,
      }))
    );
    setEduList(
      (user.education ?? []).map((e, i) => ({
        _key: `edu-${i}-${Date.now()}`,
        degree: e.degree,
        institution: e.institution,
        year: e.year,
      }))
    );
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  /* ── Cert helpers ── */
  const updateCert = (key: string, field: keyof CertForm, value: string) => {
    setCertList((prev) =>
      prev.map((c) => (c._key === key ? { ...c, [field]: value } : c))
    );
  };

  const addCert = () => {
    setCertList((prev) => [
      ...prev,
      {
        _key: `cert-new-${Date.now()}`,
        name: "",
        issuedBy: "",
        year: String(new Date().getFullYear()),
      },
    ]);
  };

  const removeCert = (key: string) => {
    setCertList((prev) => prev.filter((c) => c._key !== key));
  };

  /* ── Edu helpers ── */
  const updateEdu = (key: string, field: keyof EduForm, value: string) => {
    setEduList((prev) =>
      prev.map((e) => (e._key === key ? { ...e, [field]: value } : e))
    );
  };

  const addEdu = () => {
    setEduList((prev) => [
      ...prev,
      {
        _key: `edu-new-${Date.now()}`,
        degree: "",
        institution: "",
        year: String(new Date().getFullYear()),
      },
    ]);
  };

  const removeEdu = (key: string) => {
    setEduList((prev) => prev.filter((e) => e._key !== key));
  };

  /* ── Validate ── */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    certList.forEach((c) => {
      if (!c.name.trim()) e[`${c._key}-name`] = "Required";
      if (!c.issuedBy.trim()) e[`${c._key}-issuer`] = "Required";
      if (!c.year.trim() || isNaN(Number(c.year)))
        e[`${c._key}-year`] = "Valid year required";
    });
    eduList.forEach((ed) => {
      if (!ed.degree.trim()) e[`${ed._key}-degree`] = "Required";
      if (!ed.institution.trim()) e[`${ed._key}-inst`] = "Required";
      if (!ed.year.trim() || isNaN(Number(ed.year)))
        e[`${ed._key}-year`] = "Valid year required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onUpdate({
        certifications: certList.map((c) => ({
          name: c.name.trim(),
          issuedBy: c.issuedBy.trim(),
          year: c.year.trim(),
        })),
        education: eduList.map((e) => ({
          degree: e.degree.trim(),
          institution: e.institution.trim(),
          year: e.year.trim(),
        })),
      });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-2.5 py-1.5 rounded-lg border text-base lg:text-sm text-[#0B2343] outline-none transition-colors ${
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

      {!editing ? (
        /* ── View mode ── */
        <div className="space-y-4">
          {/* Certifications */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
              Certifications
            </h4>
            <div className="space-y-2.5">
              {(user.certifications ?? []).map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-[#0B2343]/[0.015] border border-[#0B2343]/[0.04]"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                    <Award size={14} className="text-[#0B2343]/25" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-[#0B2343] truncate">
                      {c.name}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35 truncate">
                      {c.issuedBy} · {c.year}
                    </p>
                  </div>
                </div>
              ))}
              {(user.certifications ?? []).length === 0 && (
                <p className="text-xs text-[#0B2343]/25 text-center py-2">
                  No certifications added yet.
                </p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="pt-3 border-t border-[#0B2343]/[0.04]">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
              Education
            </h4>
            <div className="space-y-2.5">
              {(user.education ?? []).map((e, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-[#0B2343]/[0.015] border border-[#0B2343]/[0.04]"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0B2343]/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap size={14} className="text-[#0B2343]/25" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-[13px] font-semibold text-[#0B2343] truncate">
                      {e.degree}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-[#0B2343]/35 truncate">
                      {e.institution} · {e.year}
                    </p>
                  </div>
                </div>
              ))}
              {(user.education ?? []).length === 0 && (
                <p className="text-xs text-[#0B2343]/25 text-center py-2">
                  No education added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Edit mode ── */
        <div className="space-y-4">
          {/* Certifications edit */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
              Certifications
            </h4>
            <div className="space-y-3">
              {certList.map((c) => (
                <div
                  key={c._key}
                  className="p-2.5 sm:p-3 rounded-lg border border-[#0B2343]/[0.06] bg-[#0B2343]/[0.01] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <input
                          value={c.name}
                          onChange={(e) =>
                            updateCert(c._key, "name", e.target.value)
                          }
                          placeholder="Certificate name"
                          className={inputClass(!!errors[`${c._key}-name`])}
                        />
                        {errors[`${c._key}-name`] && (
                          <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                            <AlertCircle size={9} />
                            {errors[`${c._key}-name`]}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <input
                            value={c.issuedBy}
                            onChange={(e) =>
                              updateCert(c._key, "issuedBy", e.target.value)
                            }
                            placeholder="Issued by"
                            className={inputClass(!!errors[`${c._key}-issuer`])}
                          />
                          {errors[`${c._key}-issuer`] && (
                            <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                              <AlertCircle size={9} />
                              {errors[`${c._key}-issuer`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="number"
                            value={c.year}
                            onChange={(e) =>
                              updateCert(c._key, "year", e.target.value)
                            }
                            placeholder="Year"
                            className={inputClass(!!errors[`${c._key}-year`])}
                          />
                          {errors[`${c._key}-year`] && (
                            <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                              <AlertCircle size={9} />
                              {errors[`${c._key}-year`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCert(c._key)}
                      className="shrink-0 p-1.5 rounded-lg text-[#0B2343]/20 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addCert}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-[#ff7c22] hover:underline"
              >
                <Plus size={13} />
                Add certification
              </button>
            </div>
          </div>

          {/* Education edit */}
          <div className="pt-3 border-t border-[#0B2343]/[0.04]">
            <h4 className="text-[11px] sm:text-xs font-semibold text-[#0B2343]/60 mb-2">
              Education
            </h4>
            <div className="space-y-3">
              {eduList.map((ed) => (
                <div
                  key={ed._key}
                  className="p-2.5 sm:p-3 rounded-lg border border-[#0B2343]/[0.06] bg-[#0B2343]/[0.01] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <input
                          value={ed.degree}
                          onChange={(e) =>
                            updateEdu(ed._key, "degree", e.target.value)
                          }
                          placeholder="Degree / qualification"
                          className={inputClass(!!errors[`${ed._key}-degree`])}
                        />
                        {errors[`${ed._key}-degree`] && (
                          <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                            <AlertCircle size={9} />
                            {errors[`${ed._key}-degree`]}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <input
                            value={ed.institution}
                            onChange={(e) =>
                              updateEdu(ed._key, "institution", e.target.value)
                            }
                            placeholder="Institution"
                            className={inputClass(!!errors[`${ed._key}-inst`])}
                          />
                          {errors[`${ed._key}-inst`] && (
                            <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                              <AlertCircle size={9} />
                              {errors[`${ed._key}-inst`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="number"
                            value={ed.year}
                            onChange={(e) =>
                              updateEdu(ed._key, "year", e.target.value)
                            }
                            placeholder="Year"
                            className={inputClass(!!errors[`${ed._key}-year`])}
                          />
                          {errors[`${ed._key}-year`] && (
                            <p className="flex items-center gap-1 mt-0.5 text-[9px] text-red-500">
                              <AlertCircle size={9} />
                              {errors[`${ed._key}-year`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeEdu(ed._key)}
                      className="shrink-0 p-1.5 rounded-lg text-[#0B2343]/20 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addEdu}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-[#ff7c22] hover:underline"
              >
                <Plus size={13} />
                Add education
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
