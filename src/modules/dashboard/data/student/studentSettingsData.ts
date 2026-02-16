export interface NotificationSettings {
  emailLessonReminders: boolean;
  emailLessonSummaries: boolean;
  emailPromotions: boolean;
  emailMessages: boolean;
  pushLessonReminders: boolean;
  pushMessages: boolean;
  reminderTime: string; // e.g. "30min", "1hr", "2hr"
}

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

export interface StudentSettings {
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
}

export const reminderTimeOptions: { value: string; label: string }[] = [
  { value: "15min", label: "15 minutes before" },
  { value: "30min", label: "30 minutes before" },
  { value: "1hr", label: "1 hour before" },
  { value: "2hr", label: "2 hours before" },
  { value: "24hr", label: "24 hours before" },
];

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

export const studentSettings: StudentSettings = {
  notifications: {
    emailLessonReminders: true,
    emailLessonSummaries: true,
    emailPromotions: false,
    emailMessages: true,
    pushLessonReminders: true,
    pushMessages: true,
    reminderTime: "30min",
  },
  appearance: {
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
  },
  privacy: {
    profileVisibleToTutors: true,
    showOnlineStatus: true,
    allowTutorMessages: true,
  },
};
