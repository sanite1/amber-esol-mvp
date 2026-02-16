import { useState, useRef } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Clock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Pencil,
  X,
  Loader2,
  Camera,
  AlertCircle,
} from "lucide-react";
import type { TutorProfileData } from "../../../data/tutor/tutorProfileData";

interface Props {
  profile: TutorProfileData;
  onUpdate: (updates: Partial<TutorProfileData>) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

export default function ProfileHeader({ profile, onUpdate }: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState(profile.name);
  const [formEmail, setFormEmail] = useState(profile.email);
  const [formPhone, setFormPhone] = useState(profile.phone);
  const [formCity, setFormCity] = useState(profile.city);
  const [formShortBio, setFormShortBio] = useState(profile.shortBio);
  const [errors, setErrors] = useState<FormErrors>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const profileUrl = `${window.location.origin}/tutors/${profile.profileSlug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEdit = () => {
    setFormName(profile.name);
    setFormEmail(profile.email);
    setFormPhone(profile.phone);
    setFormCity(profile.city);
    setFormShortBio(profile.shortBio);
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setErrors({});
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formName.trim()) e.name = "Name is required";
    if (!formEmail.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail))
      e.email = "Enter a valid email";
    if (!formPhone.trim()) e.phone = "Phone is required";
    if (!formCity.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onUpdate({
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      city: formCity.trim(),
      shortBio: formShortBio.trim(),
    });
    setSaving(false);
    setEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdate({ avatar: url });
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 rounded-lg border text-xs sm:text-sm text-[#0B2343] outline-none transition-colors ${
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
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            {/* Avatar upload overlay */}
            <button
              onClick={handleAvatarClick}
              className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Camera
                size={18}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            {profile.isOnline && (
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-[2.5px] border-white" />
            )}
            {profile.isVerified && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                <CheckCircle2
                  size={16}
                  className="text-blue-500 fill-blue-500"
                />
              </div>
            )}
          </div>

          {/* Name + badges + edit */}
          <div className="flex-1 min-w-0 text-center sm:text-left pb-0 sm:pb-1 w-full">
            {!editing ? (
              <>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B2343] truncate">
                    {profile.name}
                  </h2>
                  <div className="flex items-center gap-1.5">
                    {profile.isVerified && (
                      <span className="text-[9px] sm:text-[10px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                    <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {profile.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-[13px] text-[#0B2343]/40 mt-0.5">
                  {profile.shortBio}
                </p>
              </>
            ) : (
              <div className="space-y-2 text-left">
                <div>
                  <input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Full name"
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                      <AlertCircle size={10} />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    value={formShortBio}
                    onChange={(e) => setFormShortBio(e.target.value)}
                    placeholder="Short bio / tagline"
                    className={inputClass(false)}
                  />
                </div>
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
                {profile.city}, {profile.country}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/40">
              <Clock size={13} className="text-[#0B2343]/25 shrink-0" />
              <span className="truncate">{profile.timezone}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/40">
              <Mail size={13} className="text-[#0B2343]/25 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/40">
              <Phone size={13} className="text-[#0B2343]/25 shrink-0" />
              <span className="truncate">{profile.phone}</span>
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
                City
              </label>
              <input
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="City"
                className={inputClass(!!errors.city)}
              />
              {errors.city && (
                <p className="flex items-center gap-1 mt-1 text-[10px] text-red-500">
                  <AlertCircle size={10} />
                  {errors.city}
                </p>
              )}
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#0B2343]/30 py-2">
                <Clock size={13} className="shrink-0" />
                <span>{profile.timezone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Profile link + social */}
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

          {profile.socialLinks && (
            <div className="flex items-center gap-2">
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] sm:text-xs text-[#0B2343]/30 hover:text-[#0B2343]/60 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {profile.socialLinks.website && (
                <a
                  href={profile.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] sm:text-xs text-[#0B2343]/30 hover:text-[#0B2343]/60 transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
