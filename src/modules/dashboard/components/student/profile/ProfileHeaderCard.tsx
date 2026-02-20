// src/components/student/profile/ProfileHeaderCard.tsx
import { useRef, useState } from "react";
import {
  Camera,
  MapPin,
  Globe,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import type { StudentProfile } from "../../../data/student/studentProfileData";

interface Props {
  profile: StudentProfile;
  onAvatarChange: (file: File | null) => void;
  isAvatarUploading?: boolean;
}

export default function ProfileHeaderCard({
  profile,
  onAvatarChange,
  isAvatarUploading = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [hovering, setHovering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
  const displayAvatar = previewUrl ?? profile.avatar;
  const hasAvatar = Boolean(displayAvatar);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    onAvatarChange(file);

    // Reset input so selecting the same file again still triggers onChange
    e.target.value = "";
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onAvatarChange(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#0B2343]/[0.06] p-4 sm:p-5">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="relative shrink-0"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0B2343]/[0.08] to-[#0B2343]/[0.04] flex items-center justify-center overflow-hidden">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base sm:text-lg font-bold text-[#0B2343]/25 select-none">
                {initials}
              </span>
            )}
          </div>

          {/* Loading overlay */}
          {isAvatarUploading && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-[#0B2343]/50">
              <Loader2 size={18} className="text-white animate-spin" />
            </div>
          )}

          {/* Hover overlay — only when NOT uploading */}
          {!isAvatarUploading && hovering && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center bg-[#0B2343]/40 gap-1">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                title="Upload photo"
              >
                <Camera size={13} className="text-white" />
              </button>
              {hasAvatar && (
                <button
                  onClick={handleRemove}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-red-500/60 flex items-center justify-center transition-colors"
                  title="Remove photo"
                >
                  <Trash2 size={13} className="text-white" />
                </button>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden text-base lg:text-sm"
            onChange={handleFileSelect}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-[#0B2343] truncate">
            {profile.firstName} {profile.lastName}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail size={11} className="text-[#0B2343]/25 shrink-0" />
            <span className="text-xs text-[#0B2343]/40 truncate">
              {profile.email}
            </span>
            {profile.isActive ? (
              <CheckCircle2
                size={11}
                className="text-green-500 shrink-0"
                fill="currentColor"
              />
            ) : (
              <AlertCircle size={11} className="text-amber-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {profile.country && (
              <span className="flex items-center gap-1 text-[11px] text-[#0B2343]/30">
                <MapPin size={10} />
                {profile.country}
              </span>
            )}
            {profile.timezone && (
              <span className="flex items-center gap-1 text-[11px] text-[#0B2343]/30">
                <Globe size={10} />
                {profile.timezone}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
