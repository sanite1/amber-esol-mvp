import { useState } from "react";
import { User, Edit3, X, Check, Loader2 } from "lucide-react";
import {
  StudentProfile,
  countryOptions,
  timezoneOptions,
} from "../../../data/student/studentProfileData";

interface Props {
  profile: StudentProfile;
  onSave: (data: Partial<StudentProfile>) => Promise<void>;
}

export default function PersonalInfoSection({ profile, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    country: profile.country,
    timezone: profile.timezone,
    bio: profile.bio,
  });

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      country: profile.country,
      timezone: profile.timezone,
      bio: profile.bio,
    });
    setEditing(false);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-xl border border-[#0B2343]/[0.08] bg-[#fafbfc] text-base lg:text-sm text-[#0B2343] placeholder:text-[#0B2343]/25 outline-none focus:border-[#ff7c22]/30 focus:bg-white transition-colors";
  const labelClass = "text-[11px] font-medium text-[#0B2343]/40 mb-1 block";

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#ff7c22]/10 flex items-center justify-center">
            <User size={13} className="text-[#ff7c22]" />
          </div>
          <h3 className="text-sm font-semibold text-[#0B2343]">
            Personal Information
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
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+44 7700 000000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className={inputClass}
              >
                <option value="">Select</option>
                {countryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Timezone</label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className={inputClass}
            >
              <option value="">Select</option>
              {timezoneOptions.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Short Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={2}
              maxLength={200}
              placeholder="Brief intro for your tutors…"
              className={`${inputClass} resize-none`}
            />
            <p className="text-[9px] text-[#0B2343]/20 mt-0.5 text-right">
              {form.bio.length}/200
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          <div>
            <p className="text-[10px] text-[#0B2343]/25">Name</p>
            <p className="text-sm text-[#0B2343]/60">
              {profile.firstName} {profile.lastName}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#0B2343]/25">Phone</p>
            <p className="text-sm text-[#0B2343]/60">
              {profile.phone || (
                <span className="text-[#0B2343]/15 italic">Not added</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#0B2343]/25">Country</p>
            <p className="text-sm text-[#0B2343]/60">
              {profile.country || (
                <span className="text-[#0B2343]/15 italic">Not set</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[#0B2343]/25">Timezone</p>
            <p className="text-sm text-[#0B2343]/60">
              {profile.timezone || (
                <span className="text-[#0B2343]/15 italic">Not set</span>
              )}
            </p>
          </div>
          {profile.bio && (
            <div className="col-span-2 pt-1.5 mt-1 border-t border-[#0B2343]/[0.03]">
              <p className="text-[10px] text-[#0B2343]/25 mb-0.5">Bio</p>
              <p className="text-sm text-[#0B2343]/45 leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
