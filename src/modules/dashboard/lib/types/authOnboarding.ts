/* ──────────────────────────────────────────────
   Subdocument / nested types
   ────────────────────────────────────────────── */

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country: string;
}

export interface Certification {
  name: string;
  issuedBy: string;
  year: string;
  documentUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  lessonReminders: boolean;
  promotions: boolean;
  newMessages: boolean;
  lessonUpdates: boolean;
  paymentAlerts: boolean;
}

export interface TeachingPreferences {
  maxStudents: number;
  lessonTypes: ("one-on-one" | "group")[];
  preferredLevels: (
    | "beginner"
    | "elementary"
    | "intermediate"
    | "upper-intermediate"
    | "advanced"
  )[];
  autoAcceptBookings: boolean;
}
// Add this new interface near the other subdocument types
export type LanguageFluency =
  | "native"
  | "fluent"
  | "advanced"
  | "intermediate"
  | "basic";

export interface Language {
  name: string;
  fluency: LanguageFluency;
}

export type CurrentLevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "upper-intermediate"
  | "advanced"
  | "proficiency";

export type LessonTypePreference = "one-on-one" | "group" | "both";

export type ScheduleSlot = "morning" | "afternoon" | "evening" | "weekend";

export interface LearningPreferences {
  currentLevel?: CurrentLevel;
  targetLevel?: CurrentLevel;
  goals?: string[];
  preferredSchedule?: ScheduleSlot[];
  lessonTypePreference?: LessonTypePreference;
}

/* ──────────────────────────────────────────────
   User data (what the backend returns)
   ────────────────────────────────────────────── */

export interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "tutor" | "student";
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  address?: Address;
  timezone?: string;
  bio?: string;

  // Account status
  verified: boolean;
  isActive: boolean;
  suspensionEnd?: string;
  suspensionReason?: string;
  lastLogin?: string;
  onlineStatus: "online" | "offline" | "away";
  lastSeen?: string;

  // Tutor-specific
  languages?: Language[];
  nativeLanguage?: string;
  hourlyRate?: number;
  yearsOfExperience?: number;
  certifications?: Certification[];
  education?: Education[];
  specializations?: string[];
  teachingPreferences?: TeachingPreferences;
  ratings?: number[];
  averageRating?: number;
  totalLessons?: number;
  totalStudents?: number;
  numberOfReviews?: number;
  completionRate?: number;
  responseTime?: number;
  introVideoUrl?: string;
  trialLessonOffered?: boolean;
  trialLessonPrice?: number;

  // Student-specific
  learningPreferences?: LearningPreferences;
  enrolledCourses?: string[];
  totalLessonsTaken?: number;
  totalHoursLearned?: number;
  currentStreak?: number;
  longestStreak?: number;

  // Notification preferences
  notificationPreferences?: NotificationPreferences;

  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
   Decoded JWT payload
   ────────────────────────────────────────────── */

export interface DecodedUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "tutor" | "student";
  profilePicture: string;
  exp: number;
  iat: number;
}

/* ──────────────────────────────────────────────
   Request payloads
   ────────────────────────────────────────────── */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterStudentPayload {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: Address;
  timezone?: string;
  learningPreferences?: LearningPreferences;
}

export interface RegisterTutorPayload {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: Address;
  timezone?: string;
  bio: string;
  languages: Language[];
  nativeLanguage: string;
  hourlyRate: number;
  yearsOfExperience: number;
  certifications: Certification[];
  education?: Education[];
  specializations?: string[];
  teachingPreferences?: TeachingPreferences;
  trialLessonOffered?: boolean;
  trialLessonPrice?: number;
  introVideoUrl?: string;
}

export interface RegisterAdminPayload {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateUserPayload {
  firstname?: string;
  lastname?: string;
  phoneNumber?: string;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: Address;
  timezone?: string;
  bio?: string;
  languages?: Language[];
  nativeLanguage?: string;
  hourlyRate?: number;
  yearsOfExperience?: number;
  certifications?: Certification[];
  education?: Education[];
  specializations?: string[];
  teachingPreferences?: TeachingPreferences;
  learningPreferences?: LearningPreferences;
  notificationPreferences?: NotificationPreferences;
  trialLessonOffered?: boolean;
  trialLessonPrice?: number;
  introVideoUrl?: string;
}

export interface DeleteAccountPayload {
  reason: string;
  feedback?: string;
}

/* ──────────────────────────────────────────────
   Response types
   ────────────────────────────────────────────── */

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface RegisterResponse {
  user: UserData;
}

export interface UpdateUserResponse {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

/* ──────────────────────────────────────────────
   Tutor listing / filters
   ────────────────────────────────────────────── */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// src/lib/types/authOnboarding.ts — add/update these types

export interface TutorFilters {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  language?: string;
  specialization?: string;
  minPrice?: number;
  maxPrice?: number;
  level?: string;
  trialOnly?: boolean;
}

export interface TutorListItem {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture: string;
  bio: string;
  specializations: string[];
  languages: Language[];
  nativeLanguage: string;
  hourlyRate: number;
  trialLessonOffered: boolean;
  trialLessonPrice: number;
  yearsOfExperience: number;
  rating: number;
  totalReviews: number;
  totalLessons: number;
  isOnline: boolean;
  address: {
    country?: string;
  };
  timezone: string;
  certifications: { name: string; issuedBy: string; year: string }[];
  teachingPreferences?: {
    maxStudents?: number;
    lessonTypes?: string[];
    preferredLevels?: string[];
    autoAcceptBookings?: boolean;
  };
}

export interface TutorListResponse {
  tutors: TutorListItem[];
  pagination: PaginationMeta;
}
