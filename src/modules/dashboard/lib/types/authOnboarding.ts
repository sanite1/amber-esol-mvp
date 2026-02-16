// =====================
// 🧾 AUTH & USER TYPES
// =====================

// ✅ Login
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  message?: string;
  user?: UserData;
}

export interface refreshResponse {
  accessToken: string;
}

// ✅ Signup
export interface SignupPayload {
  // firstname: string;
  // lastname: string;
  email: string;
  password: string;
  signupCode: string;
}

// ✅ Update Password
export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// ✅ Forgot Password
export interface forgotPasswordPayload {
  email: string;
}

// ✅ Update User
export interface UpdateUserPayload {
  firstname?: string;
  lastname?: string;
  middlename?: string;
  phoneNumber?: string;
  profilePicture?: string;
  dateOfBirth?: string;
  address?: Partial<IAddress>;
  skillsAndPreferences?: Partial<ISkillsAndPreferences>;
}

export type UserRole = "admin" | "contributor";
export type UserStatus = "active" | "suspended" | "terminated" | "unverified";
export type VerificationStatus =
  | "not_started"
  | "pending"
  | "verified"
  | "failed";
export type LanguageProficiency =
  | "Native"
  | "Fluent"
  | "Intermediate"
  | "Basic";
export type WeeklyAvailability =
  | "Less than 10 hours"
  | "10-20 hours"
  | "20-30 hours"
  | "30-40 hours"
  | "40+ hours";

// Sub-interfaces
export interface ILanguage {
  name: string;
  proficiency: LanguageProficiency;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IVerification {
  emailVerified: boolean;
  addressVerified: boolean;
  ssnVerified: boolean;
  ssnVerificationStatus: VerificationStatus;
  ssnLastFour?: string; // Last 4 digits of SSN (stored encrypted)
  ssnSubmittedAt?: string;
  documentVerified: boolean;
  documentVerificationStatus: VerificationStatus;
  documentVerificationLink?: string;
  documentSubmittedAt?: Date;
}

export interface ISkillsAndPreferences {
  skills: string[];
  languages: ILanguage[];
  preferredCategories: string[];
  weeklyAvailability: WeeklyAvailability;
}

export interface IPaymentMethod {
  _id: string;

  type: "bank" | "paypal";
  isDefault: boolean;
  // Bank details (encrypted)
  bankName?: string;
  accountType?: "checking" | "savings";
  accountLastFour?: string;
  routingLastFour?: string;
  accountHolderName?: string;
  // PayPal details
  paypalEmail?: string;
  addedAt: Date;
}

export interface IEarnings {
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  lastPayoutDate?: Date;
  lastPayoutAmount?: number;
}

export interface IStats {
  tasksCompleted: number;
  hoursWorked: number;
  averageRating: number;
  performanceScore: number;
  accuracyRate: number;
  speedScore: number;
  qualityScore: number;
}

// Main User Interface
export interface UserData extends Document {
  _id: string;

  // Personal Information
  firstname: string;
  lastname: string;
  middlename?: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  dateOfBirth?: string;

  // Address
  address?: IAddress;

  // Authentication
  password: string;
  role: UserRole;
  status: UserStatus;
  signupCode: string;

  // Verification
  verification: IVerification;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpires?: Date;

  applicationGeoLocation?: string;
  applicationIp?: string;
  applicationRegion?: string;
  applicationTimezone?: string;
  applicationCity?: string;

  // Skills & Preferences
  skillsAndPreferences: ISkillsAndPreferences;

  // Payment
  paymentMethods: IPaymentMethod[];
  earnings: IEarnings;

  // Stats
  stats: IStats;

  // Metadata
  lastLoginAt?: Date;
  memberSince: Date;
  createdAt: string;
  updatedAt: Date;
}

// ✅ Decoded JWT User (used in Header)
export interface DecodedUser {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// SSN Verification Payload
export interface SSNVerificationPayload {
  ssn: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface UserResponseData {
  total: number;
  currentPage: number;
  totalPages: number;
  users: UserData[];
}
