export interface NotificationPreferences {
  emailNewBooking: boolean;
  emailCancellation: boolean;
  emailNewMessage: boolean;
  emailReview: boolean;
  emailPayout: boolean;
  pushNewBooking: boolean;
  pushCancellation: boolean;
  pushNewMessage: boolean;
  pushLessonReminder: boolean;
  reminderMinutes: number;
}

export interface TutorSettingsData {
  email: string;
  phone: string;
  timezone: string;
  language: string;
  notifications: NotificationPreferences;
  twoFactorEnabled: boolean;
  accountCreated: string;
}

export const timezoneOptions = [
  "Europe/London (GMT+0)",
  "Europe/Paris (GMT+1)",
  "Europe/Berlin (GMT+1)",
  "Europe/Istanbul (GMT+3)",
  "Asia/Dubai (GMT+4)",
  "Asia/Kolkata (GMT+5:30)",
  "Asia/Tokyo (GMT+9)",
  "America/New_York (GMT-5)",
  "America/Chicago (GMT-6)",
  "America/Los_Angeles (GMT-8)",
  "Australia/Sydney (GMT+11)",
];

export const languageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Japanese",
  "Arabic",
];

export const tutorSettingsData: TutorSettingsData = {
  email: "james.hartwell@email.com",
  phone: "+44 7911 123456",
  timezone: "Europe/London (GMT+0)",
  language: "English",
  notifications: {
    emailNewBooking: true,
    emailCancellation: true,
    emailNewMessage: true,
    emailReview: true,
    emailPayout: true,
    pushNewBooking: true,
    pushCancellation: true,
    pushNewMessage: true,
    pushLessonReminder: true,
    reminderMinutes: 15,
  },
  twoFactorEnabled: false,
  accountCreated: "2024-03-10",
};
