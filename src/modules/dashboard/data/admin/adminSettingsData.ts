// ─── Interfaces ─────────────────────────────────────────────────────

export interface PlatformSettings {
  commissionRate: number; // percentage e.g. 15
  minPayoutAmount: number; // £
  payoutProcessingDays: number;
  trialLessonDuration: number; // minutes
  maxTrialsPerStudent: number;
  supportedCurrencies: string[];
  defaultCurrency: string;
  platformName: string;
  supportEmail: string;
  timezone: string;
}

export interface LessonSettings {
  minLessonDuration: number; // minutes
  maxLessonDuration: number;
  cancellationWindowHours: number;
  noShowGracePeriodMinutes: number;
  autoRefundOnTutorCancel: boolean;
  allowTrialBookingWithoutCard: boolean;
}

export interface NotificationSettings {
  adminNewTutorApplication: boolean;
  adminNewReport: boolean;
  adminPayoutRequest: boolean;
  adminFailedTransaction: boolean;
  adminDailySummary: boolean;
  adminWeeklyReport: boolean;
}

export interface MaintenanceSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  announcementBanner: boolean;
  announcementMessage: string;
  announcementType: "info" | "warning" | "success";
}

export interface AdminSettingsData {
  platform: PlatformSettings;
  lessons: LessonSettings;
  notifications: NotificationSettings;
  maintenance: MaintenanceSettings;
  accountCreated: string;
  lastPasswordChange?: string;
}

// ─── Options ────────────────────────────────────────────────────────

export const currencyOptions = [
  { value: "GBP", label: "£ GBP – British Pound" },
  { value: "USD", label: "$ USD – US Dollar" },
  { value: "EUR", label: "€ EUR – Euro" },
  { value: "CAD", label: "$ CAD – Canadian Dollar" },
  { value: "AUD", label: "$ AUD – Australian Dollar" },
];

export const timezoneOptions = [
  { value: "Europe/London", label: "Europe/London (GMT+0)" },
  { value: "Europe/Paris", label: "Europe/Paris (GMT+1)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (GMT+1)" },
  { value: "America/New_York", label: "America/New York (GMT-5)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (GMT-8)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (GMT+9)" },
  { value: "Asia/Dubai", label: "Asia/Dubai (GMT+4)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (GMT+11)" },
];

// ─── Sample Data ────────────────────────────────────────────────────

export const adminSettingsData: AdminSettingsData = {
  platform: {
    commissionRate: 15,
    minPayoutAmount: 20,
    payoutProcessingDays: 3,
    trialLessonDuration: 30,
    maxTrialsPerStudent: 1,
    supportedCurrencies: ["GBP", "USD", "EUR"],
    defaultCurrency: "GBP",
    platformName: "LinguaConnect",
    supportEmail: "support@linguaconnect.com",
    timezone: "Europe/London",
  },
  lessons: {
    minLessonDuration: 30,
    maxLessonDuration: 120,
    cancellationWindowHours: 24,
    noShowGracePeriodMinutes: 10,
    autoRefundOnTutorCancel: true,
    allowTrialBookingWithoutCard: true,
  },
  notifications: {
    adminNewTutorApplication: true,
    adminNewReport: true,
    adminPayoutRequest: true,
    adminFailedTransaction: true,
    adminDailySummary: false,
    adminWeeklyReport: true,
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage:
      "We are currently performing scheduled maintenance. Please check back soon.",
    announcementBanner: false,
    announcementMessage: "",
    announcementType: "info",
  },
  accountCreated: "2024-01-15",
  lastPasswordChange: "2025-11-20",
};
