// src/pages/student/StudentProfile.tsx
import { useState } from "react";
import {
  useFetchUserById,
  useUpdateUser,
  useUpdatePassword,
} from "../../lib/api/authOnboarding";
import { getDecodedJwt } from "../../lib/auth";
import type {
  ScheduleSlot,
  StudentProfile as StudentProfileType,
} from "../../data/student/studentProfileData";
import type { LanguageLevel } from "../../data/student/studentProfileData";
import ProfileHeaderCard from "../../components/student/profile/ProfileHeaderCard";
import PersonalInfoSection from "../../components/student/profile/PersonalInfoSection";
import LanguageGoalsSection from "../../components/student/profile/LanguageGoalsSection";
import SecuritySection from "../../components/student/profile/SecuritySection";
import ChangePasswordModal from "../../components/student/profile/ChangePasswordModal";
import { ProfilePageSkeleton } from "../../components/student/profile/ProfileSkeleton";

export default function StudentProfile() {
  const decoded = getDecodedJwt();
  const userId = decoded?.id ?? "";

  const { data: user, isLoading, isError } = useFetchUserById(userId);
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: updatePassword, isPending: isPasswordPending } =
    useUpdatePassword();

  const [showPwModal, setShowPwModal] = useState(false);

  /* ── Loading / error states ── */
  if (isLoading) return <ProfilePageSkeleton />;
  if (isError || !user) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-[#0B2343]/40">
        Failed to load profile.
      </div>
    );
  }

  /* ──────────────────────────────────────────────
   * Bridge: map UserData → StudentProfile shape
   * ──────────────────────────────────────────── */
  const profile: StudentProfileType = {
    firstName: user.firstname ?? "",
    lastName: user.lastname ?? "",
    email: user.email ?? "",
    phone: user.phoneNumber ?? "",
    avatar: user.profilePicture ?? "",
    country: user.address?.country ?? "",
    timezone: user.timezone ?? "",
    bio: user.bio ?? "",
    nativeLanguage: user.nativeLanguage ?? "",
    currentLevel:
      (user.learningPreferences?.currentLevel as LanguageLevel) ?? "A1",
    targetLevel:
      (user.learningPreferences?.targetLevel as LanguageLevel) ?? "B2",
    learningGoals: user.learningPreferences?.goals ?? [],
    preferredSchedule:
      (user.learningPreferences?.preferredSchedule as ScheduleSlot[]) ?? "",
    verified: user.verified ?? false,
    isActive: user.isActive ?? false,
  };

  /* ── Handlers ── */

  const handleAvatarChange = async (file: File | null) => {
    if (file) {
      // Upload new picture
      const formData = new FormData();
      formData.append("profilePicture", file);
      try {
        await updateUser({ id: userId, payload: formData });
      } catch (error: unknown) {
        console.warn("Avatar upload failed:", error);
      }
    } else {
      // Remove picture — send empty string to clear it
      try {
        await updateUser({ id: userId, payload: { profilePicture: "" } });
      } catch (error: unknown) {
        console.warn("Avatar removal failed:", error);
      }
    }
  };

  const handlePersonalSave = async (data: Partial<StudentProfileType>) => {
    try {
      // Map component field names → API field names
      await updateUser({
        id: userId,
        payload: {
          ...(data.firstName !== undefined && { firstname: data.firstName }),
          ...(data.lastName !== undefined && { lastname: data.lastName }),
          ...(data.phone !== undefined && { phoneNumber: data.phone }),
          ...(data.country !== undefined && {
            address: { ...user.address, country: data.country },
          }),
          ...(data.timezone !== undefined && { timezone: data.timezone }),
          ...(data.bio !== undefined && { bio: data.bio }),
        },
      });
    } catch (error: any) {
      console.warn(error);
    }
  };

  const handleLanguageSave = async (data: Partial<StudentProfileType>) => {
    try {
      await updateUser({
        id: userId,
        payload: {
          ...(data.nativeLanguage !== undefined && {
            nativeLanguage: data.nativeLanguage,
          }),
          learningPreferences: {
            ...user.learningPreferences,
            ...(data.currentLevel !== undefined && {
              currentLevel: data.currentLevel,
            }),
            ...(data.targetLevel !== undefined && {
              targetLevel: data.targetLevel,
            }),
            ...(data.learningGoals !== undefined && {
              goals: data.learningGoals,
            }),
            ...(data.preferredSchedule !== undefined && {
              preferredSchedule: data.preferredSchedule,
            }),
          },
        },
      });
      return true;
    } catch (error: any) {
      console.warn(error);
      return false;
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => {
    try {
      await updatePassword({
        oldPassword: currentPassword,
        newPassword,
        confirmNewPassword,
      });
    } catch (error: any) {
      console.warn(error);
    }
  };

  const handleVerifyPhone = () => {
    // TODO: implement phone verification flow
    console.log("Phone verification requested");
  };

  /* ── Render ── */
  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5 pb-8">
      <ProfileHeaderCard
        profile={profile}
        onAvatarChange={handleAvatarChange}
        isAvatarUploading={isUpdating}
      />

      <PersonalInfoSection profile={profile} onSave={handlePersonalSave} />

      <LanguageGoalsSection profile={profile} onSave={handleLanguageSave} />

      <SecuritySection
        profile={profile}
        onChangePassword={() => setShowPwModal(true)}
        onVerifyPhone={handleVerifyPhone}
      />

      {showPwModal && (
        <ChangePasswordModal
          onClose={() => setShowPwModal(false)}
          onSubmit={handleChangePassword}
          isPending={isPasswordPending}
        />
      )}
    </div>
  );
}
