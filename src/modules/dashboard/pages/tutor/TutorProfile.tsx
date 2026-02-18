import { useState } from "react";
import { User } from "lucide-react";
import { useFetchUserById, useUpdateUser } from "../../lib/api/authOnboarding";
import type { UserData } from "../../lib/types/authOnboarding";

import ProfileHeader from "../../components/tutor/profile/ProfileHeader";
import ProfileStats from "../../components/tutor/profile/ProfileStats";
import ProfileAbout from "../../components/tutor/profile/ProfileAbout";
import ProfileQualifications from "../../components/tutor/profile/ProfileQualifications";
import ProfileCompletion from "../../components/tutor/profile/ProfileCompletion";
import ProfileRatesInfo from "../../components/tutor/profile/ProfileRatesInfo";
import ProfileLanguages from "../../components/tutor/profile/ProfileLanguages";
import { getDecodedJwt } from "../../lib/auth";

export default function TutorProfile() {
  const decoded = getDecodedJwt();
  const userId = decoded?.id ?? "";

  const { data: user, isLoading, isError } = useFetchUserById(userId);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

  /* generic field‑update handler */
  const handleUpdate = async (payload: Partial<UserData>) => {
    if (!userId) return;
    await updateUser({ id: userId, payload });
  };

  /* avatar upload / remove */
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const handleAvatarChange = async (file: File | null) => {
    if (!userId) return;
    setIsAvatarUploading(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append("profilePicture", file);
        await updateUser({ id: userId, payload: fd as any });
      } else {
        await updateUser({ id: userId, payload: { profilePicture: "" } });
      }
    } finally {
      setIsAvatarUploading(false);
    }
  };

  /* ---------- loading / error ---------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <User className="h-16 w-16 mb-4" />
        <p className="text-lg font-medium">Could not load profile</p>
      </div>
    );
  }

  /* ---------- render ---------- */
  return (
    <div className="space-y-8">
      <ProfileHeader
        profile={user}
        onUpdate={handleUpdate}
        onAvatarChange={handleAvatarChange}
        isAvatarUploading={isAvatarUploading}
      />

      <ProfileStats user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProfileAbout
            user={user}
            onUpdate={handleUpdate}
            isUpdating={isUpdating}
          />
          <ProfileQualifications
            user={user}
            onUpdate={handleUpdate}
            isUpdating={isUpdating}
          />
        </div>

        <div className="space-y-8">
          <ProfileCompletion user={user} />
          <ProfileRatesInfo
            user={user}
            onUpdate={handleUpdate}
            isUpdating={isUpdating}
          />
          <ProfileLanguages
            user={user}
            onUpdate={handleUpdate}
            isUpdating={isUpdating}
          />
        </div>
      </div>
    </div>
  );
}
