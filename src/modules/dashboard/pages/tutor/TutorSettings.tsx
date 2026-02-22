import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { getDecodedJwt } from "../../lib/auth";
import {
  useFetchUserById,
  useUpdateUser,
  useUpdatePassword,
  useDeleteAccount,
} from "../../lib/api/authOnboarding";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import type { NotificationPreferences } from "../../lib/types/authOnboarding";
import { SettingsPageSkeleton } from "../../components/tutor/settings/SettingsSkeleton";
import SecuritySettingsCard from "../../components/tutor/settings/SecuritySettingsCard";
import NotificationSettingsCard from "../../components/tutor/settings/NotificationSettingsCard";
import DangerZoneCard from "../../components/tutor/settings/DangerZoneCard";
import ChangePasswordModal from "../../components/tutor/settings/ChangePasswordModal";
import DeleteAccountModal from "../../components/tutor/settings/DeleteAccountModal";

export default function TutorSettings() {
  const decoded = getDecodedJwt();
  const userId = decoded?.id ?? "";
  const { logout } = useAuth();

  const { data: user, isLoading, isError } = useFetchUserById(userId);
  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: updatePassword, isPending: isPasswordPending } =
    useUpdatePassword();
  const { mutateAsync: deleteAccountMut, isPending: isDeleting } =
    useDeleteAccount();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ── Notification state (synced from server) ── */
  const [notifications, setNotifications] =
    useState<NotificationPreferences | null>(null);
  const [notifDirty, setNotifDirty] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  useEffect(() => {
    if (user?.notificationPreferences) {
      setNotifications(user.notificationPreferences);
    }
  }, [user]);

  /* ── Loading / error ── */
  if (isLoading || !user) return <SettingsPageSkeleton />;
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-[#0B2343]/40">
        Failed to load settings.
      </div>
    );
  }

  /* ── Handlers ── */

  const handleNotificationChange = (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    setNotifications((prev) => (prev ? { ...prev, [key]: value } : prev));
    setNotifDirty(true);
    setNotifSaved(false);
  };

  const handleSaveNotifications = async () => {
    if (!notifications) return;
    setNotifSaving(true);
    try {
      await updateUser({
        id: userId,
        payload: { notificationPreferences: notifications },
      });
      setNotifDirty(false);
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2000);
    } finally {
      setNotifSaving(false);
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ) => {
    await updatePassword({
      oldPassword: currentPassword,
      newPassword,
      confirmNewPassword,
    });
    setShowPasswordModal(false);
  };

  const handleDeleteAccount = async (
    reason: string,
    feedback: string
  ): Promise<boolean> => {
    try {
      await deleteAccountMut({
        id: userId,
        payload: { reason, feedback },
      });
      logout();
      Cookies.remove("authToken");
      localStorage.removeItem("user");
      window.location.href = "/";
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      return false;
    }
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

        {/* Security */}
        <SecuritySettingsCard
          email={user.email}
          verified={user.verified}
          onChangePassword={() => setShowPasswordModal(true)}
        />

        {/* Notifications */}
        {notifications && (
          <NotificationSettingsCard
            notifications={notifications}
            onChange={handleNotificationChange}
            onSave={handleSaveNotifications}
            isSaving={notifSaving}
            hasChanges={notifDirty}
            saved={notifSaved}
          />
        )}

        {/* Danger zone */}
        <DangerZoneCard
          accountCreated={user.createdAt}
          onDeleteAccount={() => setShowDeleteModal(true)}
        />
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
          isPending={isPasswordPending}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
          isPending={isDeleting}
        />
      )}
    </>
  );
}
