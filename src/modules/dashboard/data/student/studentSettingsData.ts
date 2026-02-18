// src/data/student/studentSettingsData.ts

/* ──────────────────────────────────────────────
   Notification settings — maps 1:1 to the backend
   notificationPreferences on the User model
   ────────────────────────────────────────────── */

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  lessonReminders: boolean;
  promotions: boolean;
  newMessages: boolean;
  lessonUpdates: boolean;
  paymentAlerts: boolean;
}

/* ──────────────────────────────────────────────
     Appearance & Privacy — NOT on the backend model.
     Persisted in localStorage only.
     ────────────────────────────────────────────── */

export interface AppearanceSettings {
  language: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
}

export interface PrivacySettings {
  profileVisibleToTutors: boolean;
  showOnlineStatus: boolean;
  allowTutorMessages: boolean;
}

/* ──────────────────────────────────────────────
     Combined settings shape
     ────────────────────────────────────────────── */

export interface StudentSettings {
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
}

/* ── Defaults ── */

export const defaultNotifications: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
  lessonReminders: true,
  promotions: false,
  newMessages: true,
  lessonUpdates: true,
  paymentAlerts: true,
};

export const defaultAppearance: AppearanceSettings = {
  language: "en",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
};

export const defaultPrivacy: PrivacySettings = {
  profileVisibleToTutors: true,
  showOnlineStatus: true,
  allowTutorMessages: true,
};

export const studentSettings: StudentSettings = {
  notifications: defaultNotifications,
  appearance: defaultAppearance,
  privacy: defaultPrivacy,
};

/* ── Options for selects ── */

export const languageOptions: { value: string; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
  { value: "ar", label: "العربية" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "tr", label: "Türkçe" },
  { value: "pl", label: "Polski" },
];

export const dateFormatOptions: { value: string; label: string }[] = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];
