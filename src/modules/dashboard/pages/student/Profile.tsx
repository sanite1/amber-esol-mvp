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
import EsolPlacementSection from "../../components/student/profile/EsolPlacementSection";
import SecuritySection from "../../components/student/profile/SecuritySection";
// Phase 1 / Final Addendum §6 (BE-A) — learner-facing compliance
// timeline. ESOL-only (gated below on esolLevel) because the audit
// trail is meaningful only for funded ESOL learners — marketplace
// students don't accumulate compliance events.
import ComplianceTimelineSection from "../../components/student/profile/ComplianceTimelineSection";
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
    confirmNewPassword: string,
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

      {/* ESOL learners get the placement-based section instead of the
          marketplace CEFR-scale "Language & Goals" panel. Two reasons:
            1. ESOL uses NQF E1–L2, not CEFR A1–C2 — the legacy panel's
               levels are wrong axis for these users.
            2. ESOL learners can't set their own target level — it's
               assigned by the placement algorithm and adjusted by the
               teacher. Letting them pick A1→B2 here would be a no-op
               at best and confusing at worst.
          Detection: JWT-side esolLevel (set by /esol/placement/submit
          and refreshed on the result page's continue handler). */}
      {decoded?.esolLevel ? (
        <EsolPlacementSection
          esolLevel={decoded.esolLevel}
          orgName={(user as { orgName?: string | null })?.orgName ?? null}
        />
      ) : (
        <LanguageGoalsSection profile={profile} onSave={handleLanguageSave} />
      )}

      <SecuritySection
        profile={profile}
        onChangePassword={() => setShowPwModal(true)}
        onVerifyPhone={handleVerifyPhone}
      />

      {/* Phase 1 / Final Addendum §6 — append-only audit-log surface
          for the learner. Placed at the bottom of /profile so it
          doesn't interrupt the standard profile-edit flow above;
          inspectors and curious learners scroll for it. ESOL-only:
          marketplace learners don't accumulate audit entries. */}
      {decoded?.esolLevel && <ComplianceTimelineSection />}

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
