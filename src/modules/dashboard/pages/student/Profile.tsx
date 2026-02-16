import { useState, useEffect } from "react";
import { UserCircle } from "lucide-react";
import {
  studentProfile as initialProfile,
  type StudentProfile as ProfileType,
} from "../../data/student/studentProfileData";
import { ProfilePageSkeleton } from "../../components/student/profile/ProfileSkeleton";
import ProfileHeaderCard from "../../components/student/profile/ProfileHeaderCard";
import PersonalInfoSection from "../../components/student/profile/PersonalInfoSection";
import LanguageGoalsSection from "../../components/student/profile/LanguageGoalsSection";
import SecuritySection from "../../components/student/profile/SecuritySection";
import ChangePasswordModal from "../../components/student/profile/ChangePasswordModal";

export default function StudentProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileType>(initialProfile);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleSave = async (data: Partial<ProfileType>) => {
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 800));
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const handleAvatarChange = async (file: File) => {
    // TODO: upload to storage, get URL
    const fakeUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, avatar: fakeUrl }));
  };

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="space-y-4 max-w-3xl m-auto">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
          <UserCircle size={18} className="text-[#ff7c22]" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[#0B2343]">My Profile</h1>
          <p className="text-[11px] text-[#0B2343]/35">
            Info visible to your tutors and Amber ESOL
          </p>
        </div>
      </div>

      {/* Avatar + name */}
      <ProfileHeaderCard
        profile={profile}
        onAvatarChange={handleAvatarChange}
      />

      {/* Personal details */}
      <PersonalInfoSection profile={profile} onSave={handleSave} />

      {/* Language, level, goals — combined */}
      <LanguageGoalsSection profile={profile} onSave={handleSave} />

      {/* Security */}
      <SecuritySection
        profile={profile}
        onChangePassword={() => setShowPasswordModal(true)}
        onVerifyPhone={() => {
          /* TODO: trigger phone verification */
        }}
      />

      {/* Change password modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
