// src/data/student/studentProfileData.ts

export type LanguageLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper-intermediate"
  | "advanced"
  | "proficiency";

export type ScheduleSlot = "morning" | "afternoon" | "evening" | "weekend";

export interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  country: string;
  timezone: string;
  bio: string;
  nativeLanguage: string;
  currentLevel: LanguageLevel;
  targetLevel: LanguageLevel;
  learningGoals: string[];
  preferredSchedule: ScheduleSlot[];
  verified: boolean;
  isActive: boolean;
}

export const languageLevels: { value: LanguageLevel; label: string }[] = [
  { value: "beginner", label: "A1 – Beginner" },
  { value: "elementary", label: "A2 – Elementary" },
  { value: "intermediate", label: "B1 – Intermediate" },
  { value: "upper-intermediate", label: "B2 – Upper Intermediate" },
  { value: "advanced", label: "C1 – Advanced" },
  { value: "proficiency", label: "C2 – Proficiency" },
];

export const countryOptions = [
  "United Kingdom",
  "United States",
  "Nigeria",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Brazil",
  "Japan",
  "South Korea",
  "China",
  "India",
  "Canada",
  "Australia",
  "Other",
];

export const timezoneOptions = [
  "UTC-12:00",
  "UTC-11:00",
  "UTC-10:00",
  "UTC-09:00",
  "UTC-08:00",
  "UTC-07:00",
  "UTC-06:00",
  "UTC-05:00",
  "UTC-04:00",
  "UTC-03:00",
  "UTC-02:00",
  "UTC-01:00",
  "UTC+00:00",
  "UTC+01:00",
  "UTC+02:00",
  "UTC+03:00",
  "UTC+04:00",
  "UTC+05:00",
  "UTC+05:30",
  "UTC+06:00",
  "UTC+07:00",
  "UTC+08:00",
  "UTC+09:00",
  "UTC+10:00",
  "UTC+11:00",
  "UTC+12:00",
];

export const nativeLanguageOptions = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Italian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
  "Turkish",
  "Dutch",
  "Other",
];

export const goalOptions = [
  "Conversational fluency",
  "Business English",
  "Exam preparation (IELTS/TOEFL)",
  "Academic writing",
  "Travel communication",
  "Accent reduction",
  "Grammar improvement",
  "Vocabulary expansion",
];

export const scheduleOptions: { value: ScheduleSlot; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "weekend", label: "Weekend" },
];
