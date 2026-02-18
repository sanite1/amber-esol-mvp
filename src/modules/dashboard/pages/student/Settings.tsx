// src/pages/student/StudentSettings.tsx
import { useState, useEffect, useCallback } from "react";
import { Settings, Loader2, CheckCircle2 } from "lucide-react";
import {
  useFetchUserById,
  useUpdateUser,
  useDeleteAccount,
} from "../../lib/api/authOnboarding";
import { getDecodedJwt } from "../../lib/auth";
import {
  defaultNotifications,
  type NotificationSettings,
} from "../../data/student/studentSettingsData";
import SettingsSkeleton from "../../components/student/settings/SettingsSkeleton";
import NotificationsSection from "../../components/student/settings/NotificationsSection";
import DeleteAccountSection from "../../components/student/settings/DeleteAccountSection";
import { useAuth } from "../../context/AuthContext";

/* ── Component ── */

export default function StudentSettings() {
  const decoded = getDecodedJwt();
  const userId = decoded?.id ?? "";

  const { data: user, isLoading } = useFetchUserById(userId);
  const { logout } = useAuth();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: deleteAccountMut, isPending: isDeleting } =
    useDeleteAccount();

  /* ── State ── */

  // Notifications — sourced from backend
  const [notifications, setNotifications] =
    useState<NotificationSettings>(defaultNotifications);

  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync notification state when user data arrives
  useEffect(() => {
    if (user?.notificationPreferences) {
      setNotifications({
        email: user.notificationPreferences.email ?? defaultNotifications.email,
        push: user.notificationPreferences.push ?? defaultNotifications.push,
        sms: user.notificationPreferences.sms ?? defaultNotifications.sms,
        lessonReminders:
          user.notificationPreferences.lessonReminders ??
          defaultNotifications.lessonReminders,
        promotions:
          user.notificationPreferences.promotions ??
          defaultNotifications.promotions,
        newMessages:
          user.notificationPreferences.newMessages ??
          defaultNotifications.newMessages,
        lessonUpdates:
          user.notificationPreferences.lessonUpdates ??
          defaultNotifications.lessonUpdates,
        paymentAlerts:
          user.notificationPreferences.paymentAlerts ??
          defaultNotifications.paymentAlerts,
      });
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ── Change handlers ── */

  const updateNotifications = useCallback(
    (data: Partial<NotificationSettings>) => {
      setNotifications((prev) => ({ ...prev, ...data }));
      setHasChanges(true);
      setSaved(false);
    },
    []
  );

  /* ── Save: sends notification prefs to backend ── */

  const handleSave = async () => {
    try {
      await updateUser({
        id: userId,
        payload: {
          notificationPreferences: notifications,
        },
      });
      // Appearance & Privacy already saved to localStorage on change
      setSaved(true);
      setHasChanges(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (error: unknown) {
      console.warn("Failed to save settings:", error);
    }
  };

  /* ── Delete account ── */
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

      window.location.href = "/";
      return true;
    } catch (error) {
      console.error("Error deleting account:", error);
      return false;
    }
  };

  /* ── Loading ── */

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#ff7c22]/10 flex items-center justify-center">
            <Settings size={18} className="text-[#ff7c22]" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-[#0B2343]">Settings</h1>
            <p className="text-[11px] text-[#0B2343]/35">
              Notifications, appearance, and privacy
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <NotificationsSection
        settings={notifications}
        onChange={updateNotifications}
      />
      {/* <AppearanceSection settings={appearance} onChange={updateAppearance} />
      <PrivacySection settings={privacy} onChange={updatePrivacy} /> */}

      {/* Save bar */}
      {(hasChanges || saved) && (
        <div className="sticky bottom-4 z-30">
          <div className="bg-[#0B2343] rounded-xl px-4 py-3 flex items-center justify-between shadow-lg">
            <p className="text-xs text-white/60">
              {saved ? "Settings saved" : "You have unsaved changes"}
            </p>
            {saved ? (
              <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                <CheckCircle2 size={14} />
                Saved
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#ff7c22] text-white text-xs font-semibold hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <DeleteAccountSection
        onDelete={handleDeleteAccount}
        isPending={isDeleting}
      />
    </div>
  );
}
