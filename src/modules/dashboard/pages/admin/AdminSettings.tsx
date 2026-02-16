import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import {
  adminSettingsData,
  type PlatformSettings,
  type LessonSettings,
  type NotificationSettings,
  type MaintenanceSettings,
  type AdminSettingsData,
} from "../../data/admin/adminSettingsData";
import { SettingsPageSkeleton } from "../../components/admin/settings/SettingsSkeleton";
import PlatformSettingsCard from "../../components/admin/settings/PlatformSettingsCard";
import LessonSettingsCard from "../../components/admin/settings/LessonSettingsCard";
import AdminNotificationSettingsCard from "../../components/admin/settings/AdminNotificationSettingsCard";
import MaintenanceCard from "../../components/admin/settings/MaintenanceCard";
import AdminSecurityCard from "../../components/admin/settings/AdminSecurityCard";
import AdminDangerZoneCard from "../../components/admin/settings/AdminDangerZoneCard";
import AdminChangePasswordModal from "../../components/admin/settings/AdminChangePasswordModal";
import AdminDeleteAccountModal from "../../components/admin/settings/AdminDeleteAccountModal";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] =
    useState<AdminSettingsData>(adminSettingsData);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  function handlePlatformUpdate(platform: PlatformSettings) {
    setSettings((prev) => ({ ...prev, platform }));
  }

  function handleLessonUpdate(lessons: LessonSettings) {
    setSettings((prev) => ({ ...prev, lessons }));
  }

  function handleNotificationUpdate(notifications: NotificationSettings) {
    setSettings((prev) => ({ ...prev, notifications }));
  }

  function handleMaintenanceUpdate(maintenance: MaintenanceSettings) {
    setSettings((prev) => ({ ...prev, maintenance }));
  }

  function handlePasswordChanged() {
    setSettings((prev) => ({
      ...prev,
      lastPasswordChange: new Date().toISOString().split("T")[0],
    }));
    setShowPasswordModal(false);
  }

  function handleDeleteAccount() {
    setShowDeleteModal(false);
    alert("Account deletion triggered. In production, redirect to logout.");
  }

  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2343]/[0.06] flex items-center justify-center">
          <Settings size={18} className="text-[#0B2343]/60" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#0B2343]">
            Platform Settings
          </h1>
          <p className="text-[11px] sm:text-xs text-[#0B2343]/50">
            Configure platform-wide settings, lesson rules, and notifications
          </p>
        </div>
      </div>

      {loading ? (
        <SettingsPageSkeleton />
      ) : (
        <>
          <PlatformSettingsCard
            settings={settings.platform}
            onUpdate={handlePlatformUpdate}
          />

          <LessonSettingsCard
            settings={settings.lessons}
            onUpdate={handleLessonUpdate}
          />

          <AdminNotificationSettingsCard
            settings={settings.notifications}
            onUpdate={handleNotificationUpdate}
          />

          <MaintenanceCard
            settings={settings.maintenance}
            onUpdate={handleMaintenanceUpdate}
          />

          <AdminSecurityCard
            lastPasswordChange={settings.lastPasswordChange}
            onChangePassword={() => setShowPasswordModal(true)}
          />

          <AdminDangerZoneCard
            accountCreated={settings.accountCreated}
            onDeleteAccount={() => setShowDeleteModal(true)}
          />
        </>
      )}

      {showPasswordModal && (
        <AdminChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSave={handlePasswordChanged}
        />
      )}

      {showDeleteModal && (
        <AdminDeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}
