import { useState, useEffect, useCallback } from "react";
import { Settings, Loader2, CheckCircle2 } from "lucide-react";
import {
  studentSettings as initialSettings,
  type StudentSettings as SettingsType,
  type NotificationSettings,
  type AppearanceSettings,
  type PrivacySettings,
} from "../../data/student/studentSettingsData";
import SettingsSkeleton from "../../components/student/settings/SettingsSkeleton";
import NotificationsSection from "../../components/student/settings/NotificationsSection";
import AppearanceSection from "../../components/student/settings/AppearanceSection";
import PrivacySection from "../../components/student/settings/PrivacySection";
import DeleteAccountSection from "../../components/student/settings/DeleteAccountSection";

export default function StudentSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsType>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // Track changes
  const updateNotifications = useCallback(
    (data: Partial<NotificationSettings>) => {
      setSettings((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, ...data },
      }));
      setHasChanges(true);
      setSaved(false);
    },
    []
  );

  const updateAppearance = useCallback((data: Partial<AppearanceSettings>) => {
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, ...data },
    }));
    setHasChanges(true);
    setSaved(false);
  }, []);

  const updatePrivacy = useCallback((data: Partial<PrivacySettings>) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, ...data },
    }));
    setHasChanges(true);
    setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteAccount = async () => {
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 1500));
    // redirect to landing page
    window.location.href = "/";
  };

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
        settings={settings.notifications}
        onChange={updateNotifications}
      />
      <AppearanceSection
        settings={settings.appearance}
        onChange={updateAppearance}
      />
      <PrivacySection settings={settings.privacy} onChange={updatePrivacy} />

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
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#ff7c22] text-white text-xs font-semibold hover:bg-[#e56a10] disabled:opacity-50 transition-colors"
              >
                {saving ? (
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
      <DeleteAccountSection onDelete={handleDeleteAccount} />
    </div>
  );
}
