import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import {
  tutorSettingsData,
  type TutorSettingsData,
  type NotificationPreferences,
} from "../../data/tutor/tutorSettingsData";
import { SettingsPageSkeleton } from "../../components/tutor/settings/SettingsSkeleton";
import GeneralSettingsCard from "../../components/tutor/settings/GeneralSettingsCard";
import SecuritySettingsCard from "../../components/tutor/settings/SecuritySettingsCard";
import NotificationSettingsCard from "../../components/tutor/settings/NotificationSettingsCard";
import DangerZoneCard from "../../components/tutor/settings/DangerZoneCard";
import ChangePasswordModal from "../../components/tutor/settings/ChangePasswordModal";
import DeleteAccountModal from "../../components/tutor/settings/DeleteAccountModal";

export default function TutorSettings() {
  const [settings, setSettings] = useState<TutorSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setSettings(tutorSettingsData);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (loading || !settings) {
    return <SettingsPageSkeleton />;
  }

  const handleUpdateSettings = (updates: Partial<TutorSettingsData>) => {
    setSettings((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const handleUpdateNotifications = (prefs: NotificationPreferences) => {
    setSettings((prev) => (prev ? { ...prev, notifications: prefs } : prev));
  };

  const handleToggle2FA = () => {
    setSettings((prev) =>
      prev ? { ...prev, twoFactorEnabled: !prev.twoFactorEnabled } : prev
    );
  };

  const handlePasswordChanged = () => {
    // In production: API call already done in modal
  };

  const handleDeleteAccount = () => {
    // In production: redirect to login / landing
    setShowDeleteModal(false);
    alert(
      "Account deleted. In production this would redirect to the landing page."
    );
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-5 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/5 flex items-center justify-center">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B2343]/40" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
              Settings
            </h1>
            <p className="text-[11px] sm:text-xs text-[#0B2343]/35">
              Manage your account preferences
            </p>
          </div>
        </div>

        {/* General */}
        <GeneralSettingsCard
          settings={settings}
          onUpdate={handleUpdateSettings}
        />

        {/* Security */}
        <SecuritySettingsCard
          settings={settings}
          onToggle2FA={handleToggle2FA}
          onChangePassword={() => setShowPasswordModal(true)}
        />

        {/* Notifications */}
        <NotificationSettingsCard
          notifications={settings.notifications}
          onUpdate={handleUpdateNotifications}
        />

        {/* Danger zone */}
        <DangerZoneCard
          accountCreated={settings.accountCreated}
          onDeleteAccount={() => setShowDeleteModal(true)}
        />
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onConfirm={handlePasswordChanged}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </>
  );
}
