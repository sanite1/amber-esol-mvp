import { useState, useRef } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Pencil,
  X,
  Loader2,
  Camera,
  AlertCircle,
  Trash2,
} from "lucide-react";
import type { UserData } from "../../../lib/types/authOnboarding";
import {
  countryOptions,
  timezoneOptions,
} from "../../../data/student/studentProfileData";

interface Props {
  profile: UserData;
  onUpdate: (updates: Partial<UserData>) => Promise<void>;
  onAvatarChange: (file: File | null) => void;
  isAvatarUploading?: boolean;
}

interface FormErrors {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  country?: string;
}

export default function ProfileHeader({
  profile,
  onAvatarChange,
  onUpdate,
  isAvatarUploading = false,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formFirstName, setFormFirstName] = useState(profile.firstname);
  const [formLastName, setFormLastName] = useState(profile.lastname);
  const [formEmail, setFormEmail] = useState(profile.email);
  const [formPhone, setFormPhone] = useState(profile.phoneNumber ?? "");
  const [formCountry, setFormCountry] = useState(
    profile.address?.country ?? ""
  );
  const [formTimezone, setFormTimezone] = useState(profile.timezone ?? "");
  const [formShortBio, setFormShortBio] = useState(profile.bio ?? "");
  const [errors, setErrors] = useState<FormErrors>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = `${profile.firstname[0]}${profile.lastname[0]}`;
  const displayAvatar = previewUrl ?? profile.profilePicture;
  const hasAvatar = Boolean(displayAvatar);

  const profileUrl = `${window.location.origin}/tutors/${profile._id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEdit = () => {
    setFormFirstName(profile.firstname);
    setFormLastName(profile.lastname);
    setFormEmail(profile.email);
    setFormPhone(profile.phoneNumber ?? "");
    setFormCountry(profile.address?.country ?? "");
    setFormTimezone(profile.timezone ?? "");
    setFormShortBio(profile.bio ?? "");
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formFirstName.trim()) e.firstname = "First name is required";
    if (!formLastName.trim()) e.lastname = "Last name is required";
    if (!formEmail.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail))
      e.email = "Enter a valid email";
    if (!formPhone.trim()) e.phone = "Phone is required";
    if (!formCountry?.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onUpdate({
        ...(formFirstName.trim() !== profile.firstname && {
          firstname: formFirstName.trim(),
        }),
        ...(formLastName.trim() !== profile.lastname && {
          lastname: formLastName.trim(),
        }),
        ...(formEmail.trim() !== profile.email && {
          email: formEmail.trim(),
        }),
        ...(formPhone.trim() !== (profile.phoneNumber ?? "") && {
          phoneNumber: formPhone.trim(),
        }),
        ...(formCountry.trim() !== (profile.address?.country ?? "") && {
          address: { ...profile.address, country: formCountry.trim() },
        }),
        ...(formTimezone !== (profile.timezone ?? "") && {
          timezone: formTimezone,
        }),
        ...(formShortBio.trim() !== (profile.bio ?? "") && {
          bio: formShortBio.trim(),
        }),
      });
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    onAvatarChange(file);
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    onAvatarChange(null);
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-lg border text-base lg:text-sm text-[#0B2343] outline-none transition-colors ${
      hasError
        ? "border-red-300 bg-red-50/30 focus:border-red-400"
        : "border-[#0B2343]/[0.1] bg-[#fafbfc] focus:border-[#ff7c22]/40 focus:bg-white"
    }`;

  return (
    <div className="bg-white rounded-xl border border-[#0B2343]/[0.06] overflow-hidden">
      {/* Cover strip */}
      <div className="h-16 sm:h-20 bg-gradient-to-r from-[#0B2343] to-[#0B2343]/80" />

      <div className="px-3 pb-3 sm:px-5 sm:pb-5">
        {/* Avatar + core info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-4 -mt-8 sm:-mt-10">
          {/* Avatar */}
          <div className="relative shrink-0 group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-[#0B2343]/[0.06] flex items-center justify-center text-lg sm:text-xl font-bold text-[#0B2343]/30 shadow-sm overflow-hidden">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={profile.firstname}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {/* Loading overlay */}
            {isAvatarUploading && (
              <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/40 flex items-center justify-center">
                <Loader2 size={18} className="text-white animate-spin" />
              </div>
            )}

            {/* Hover overlay — only when NOT uploading */}
            {!isAvatarUploading && (
              <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center gap-1 transition-colors">
                <button
                  onClick={handleAvatarClick}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  title="Upload photo"
                >
                  <Camera size={13} className="text-white" />
                </button>
                {hasAvatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-white/20 hover:bg-red-500/60 flex items-center justify-center transition-all"
                    title="Remove photo"
                  >
                    <Trash2 size={13} className="text-white" />
                  </button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden text-base lg:text-sm"
            />
            {profile.verified && (
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-[2.5px] border-white" />
            )}
          </div>

          {/* Name + badges + edit */}
          <div className="flex-1 min-w-0 text-center sm:text-left pb-0 sm:pb-1 w-full">
            {!editing ? (
              <>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B2343] truncate">
                    {`${profile.firstname} ${profile.lastname}`}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    {profile.verified && (
                      <span className="text-[9px] sm:text-[10px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                    <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {profile.onlineStatus ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.specializations?.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] sm:text-[11px] font-medium text-[#ff7c22] bg-[#ff7c22]/[0.08] px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      value={formFirstName}
                      onChange={(e) => setFormFirstName(e.target.value)}
                      placeholder="First name"
                      className={inputClass(!!errors.firstname)}
                    />
                    {errors.firstname && (
                      <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                        <AlertCircle size={10} />
                        {errors.firstname}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      value={formLastName}
                      onChange={(e) => setFormLastName(e.target.value)}
                      placeholder="Last name"
                      className={inputClass(!!errors.lastname)}
                    />
                    {errors.lastname && (
                      <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                        <AlertCircle size={10} />
                        {errors.lastname}
                      </p>
                    )}
                  </div>
                </div>
                {/* <div>
                  <input
                    value={formShortBio}
                    onChange={(e) => setFormShortBio(e.target.value)}
                    placeholder="Short bio / tagline"
                    className={inputClass(false)}
                  />
                </div> */}
              </div>
            )}
          </div>

          {/* Edit / Save / Cancel */}
          {!editing ? (
            <button
              onClick={startEdit}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2343]/[0.04] text-[11px] sm:text-xs font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.08] transition-colors"
            >
              <Pencil size={12} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] transition-colors"
              >
                <X size={12} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2343] text-white text-[11px] sm:text-xs font-medium hover:bg-[#0B2343]/90 disabled:opacity-40 transition-colors"
              >
                {saving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Check size={12} />
                )}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* Contact & details */}
        {!editing ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-x-4 sm:gap-y-2">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/40">
              <MapPin size={13} className="text-[#0B2343]/25 shrink-0" />
              <span className="truncate">
                {profile.address?.country || (
                  <span className="text-[#0B2343]/15 italic">Not set</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/40">
              <Clock size={13} className="text-[#0B2343]/25 shrink-0" />
              <span className="truncate">
                {profile.timezone || (
                  <span className="text-[#0B2343]/15 italic">Not set</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/40">
              <Mail size={13} className="text-[#0B2343]/25 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/40">
              <Phone size={13} className="text-[#0B2343]/25 shrink-0" />
              <span className="truncate">
                {profile.phoneNumber || (
                  <span className="text-[#0B2343]/15 italic">Not added</span>
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="text-[10px] font-medium text-[#0B2343]/40 mb-1 block">
                Email
              </label>
              <input
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="Email address"
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                  <AlertCircle size={10} />
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#0B2343]/40 mb-1 block">
                Phone
              </label>
              <input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="Phone number"
                className={inputClass(!!errors.phone)}
              />
              {errors.phone && (
                <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                  <AlertCircle size={10} />
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#0B2343]/40 mb-1 block">
                Country
              </label>
              <select
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
                className={inputClass(!!errors.country)}
              >
                <option value="">Select</option>
                {countryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                  <AlertCircle size={10} />
                  {errors.country}
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#0B2343]/40 mb-1 block">
                Timezone
              </label>
              <select
                value={formTimezone}
                onChange={(e) => setFormTimezone(e.target.value)}
                className={inputClass(false)}
              >
                <option value="">Select</option>
                {timezoneOptions.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Profile link */}
        <div className="mt-3 pt-3 border-t border-[#0B2343]/[0.04] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0 bg-[#0B2343]/[0.02] rounded-lg px-2.5 py-2 sm:px-3">
            <Globe size={13} className="text-[#0B2343]/25 shrink-0" />
            <span className="text-[11px] sm:text-xs text-[#0B2343]/40 truncate flex-1">
              {profileUrl}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1 rounded hover:bg-[#0B2343]/[0.06] transition-colors"
              title="Copy link"
            >
              {copied ? (
                <Check size={13} className="text-emerald-500" />
              ) : (
                <Copy size={13} className="text-[#0B2343]/25" />
              )}
            </button>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-1 rounded hover:bg-[#0B2343]/[0.06] transition-colors"
              title="View public profile"
            >
              <ExternalLink size={13} className="text-[#0B2343]/25" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
