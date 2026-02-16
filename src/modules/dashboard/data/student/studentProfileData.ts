export type LanguageLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2"
  | "Not sure";

export interface StudentProfile {
  id: string;
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
  preferredSchedule: string;
  joinedDate: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export const languageLevels: { value: LanguageLevel; label: string }[] = [
  { value: "A1", label: "A1 — Beginner" },
  { value: "A2", label: "A2 — Elementary" },
  { value: "B1", label: "B1 — Intermediate" },
  { value: "B2", label: "B2 — Upper Intermediate" },
  { value: "C1", label: "C1 — Advanced" },
  { value: "C2", label: "C2 — Proficiency" },
  { value: "Not sure", label: "Not sure yet" },
];

export const goalOptions: string[] = [
  "Pass IELTS exam",
  "Pass Cambridge exam",
  "Improve for work",
  "Academic study",
  "Travel & daily life",
  "Immigration requirements",
  "Job interviews",
  "General fluency",
  "Conversation confidence",
];

export const scheduleOptions: string[] = [
  "Mornings (before 12pm)",
  "Afternoons (12pm – 5pm)",
  "Evenings (after 5pm)",
  "Weekends only",
  "Flexible — any time",
];

export const timezoneOptions: string[] = [
  "GMT+0 (London)",
  "GMT+1 (Paris, Berlin)",
  "GMT+2 (Cairo, Athens)",
  "GMT+3 (Moscow, Istanbul)",
  "GMT+4 (Dubai)",
  "GMT+5 (Karachi)",
  "GMT+5:30 (Mumbai)",
  "GMT+8 (Singapore, Beijing)",
  "GMT+9 (Tokyo, Seoul)",
  "GMT-5 (New York)",
  "GMT-6 (Chicago)",
  "GMT-8 (Los Angeles)",
];

export const countryOptions: string[] = [
  "United Kingdom",
  "United States",
  "Nigeria",
  "India",
  "Pakistan",
  "Turkey",
  "Brazil",
  "China",
  "Japan",
  "South Korea",
  "Saudi Arabia",
  "UAE",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Poland",
  "Egypt",
  "Colombia",
  "Mexico",
  "Other",
];

export const nativeLanguageOptions: string[] = [
  "Arabic",
  "Bengali",
  "Chinese (Mandarin)",
  "French",
  "German",
  "Hindi",
  "Italian",
  "Japanese",
  "Korean",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Turkish",
  "Urdu",
  "Vietnamese",
  "Other",
];

export const studentProfile: StudentProfile = {
  id: "student-001",
  firstName: "Alex",
  lastName: "Thompson",
  email: "alex.thompson@email.com",
  phone: "+44 7700 123456",
  avatar: "",
  country: "United Kingdom",
  timezone: "GMT+0 (London)",
  bio: "Software developer looking to improve English for international meetings and presentations.",
  nativeLanguage: "Polish",
  currentLevel: "B2",
  targetLevel: "C1",
  learningGoals: ["Improve for work", "Conversation confidence"],
  preferredSchedule: "Evenings (after 5pm)",
  joinedDate: "2025-09-12",
  isEmailVerified: true,
  isPhoneVerified: false,
};
