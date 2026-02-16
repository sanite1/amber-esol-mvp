import { useState, useEffect } from "react";
import { User } from "lucide-react";
import {
  tutorProfileData,
  TutorQualification,
  type TutorProfileData,
  TutorLanguage,
} from "../../data/tutor/tutorProfileData";
import { ProfilePageSkeleton } from "../../components/tutor/profile/ProfileSkeleton";
import ProfileHeader from "../../components/tutor/profile/ProfileHeader";
import ProfileStats from "../../components/tutor/profile/ProfileStats";
import ProfileAbout from "../../components/tutor/profile/ProfileAbout";
import ProfileQualifications from "../../components/tutor/profile/ProfileQualifications";
import ProfileLanguages from "../../components/tutor/profile/ProfileLanguages";
import ProfileRatesInfo from "../../components/tutor/profile/ProfileRatesInfo";
import ProfileCompletion from "../../components/tutor/profile/ProfileCompletion";

export default function TutorProfile() {
  const [profile, setProfile] = useState<TutorProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setProfile(tutorProfileData);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  if (loading || !profile) {
    return <ProfilePageSkeleton />;
  }

  const handleProfileUpdate = (updates: Partial<TutorProfileData>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const handleQualificationsUpdate = (qualifications: TutorQualification[]) => {
    setProfile((prev) => (prev ? { ...prev, qualifications } : prev));
  };

  const handleLanguagesUpdate = (languages: TutorLanguage[]) => {
    setProfile((prev) => (prev ? { ...prev, languages } : prev));
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/5 flex items-center justify-center">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2343]/40" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            My Profile
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
            Manage how students see you
          </p>
        </div>
      </div>

      {/* Profile header card */}
      <ProfileHeader profile={profile} onUpdate={handleProfileUpdate} />

      {/* Stats row */}
      <ProfileStats stats={profile.stats} />

      {/* Two‑column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Left column — 2/3 */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <ProfileAbout profile={profile} onUpdate={handleProfileUpdate} />
          <ProfileQualifications
            qualifications={profile.qualifications}
            onUpdate={handleQualificationsUpdate}
          />
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-4 sm:space-y-5">
          <ProfileCompletion profile={profile} />
          <ProfileRatesInfo profile={profile} onUpdate={handleProfileUpdate} />
          <ProfileLanguages
            languages={profile.languages}
            onUpdate={handleLanguagesUpdate}
          />
        </div>
      </div>
    </div>
  );
}
