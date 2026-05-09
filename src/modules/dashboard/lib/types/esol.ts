/* ── Shared ESOL types matching backend interfaces ── */

export type EsolLevel =
  | "Entry 1"
  | "Entry 2"
  | "Entry 3"
  | "Level 1"
  | "Level 2";

export type AISessionMode = "BRIDGE" | "ANCHOR" | "IMMERSION";

export type UlnStatus = "pending" | "verified" | "not_required";

export type FundingStatus = "esfa_funded" | "self_funded" | "employer_funded";

export type DbsCheckStatus = "pending" | "clear" | "flagged" | "expired";

export type EsolQualificationType =
  | "CELTA"
  | "DELTA"
  | "CertTESOL"
  | "DipTESOL"
  | "PGCE"
  | "other";

export type OrgPaymentModel = "invoiced" | "stripe";
export type OrgInvoiceCycle = "monthly" | "quarterly" | "annual";

export type SafeguardingLevel = "low" | "medium" | "high" | "critical";

/* ── Core entities ── */

export interface OrganisationAddress {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface Organisation {
  _id: string;
  name: string;
  slug: string;
  contactEmail: string;
  contactName: string;
  phoneNumber?: string;
  address?: OrganisationAddress;
  logoUrl?: string;
  contractStart?: string;
  contractEnd?: string;
  paymentModel: OrgPaymentModel;
  invoiceCycle: OrgInvoiceCycle;
  maxLearners?: number;
  isActive: boolean;
  adminUserId:
    | string
    | { _id: string; firstname: string; lastname: string; email: string };
  referralCode?: string;
  ilrProviderRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralToken {
  _id: string;
  orgId: string;
  token: string;
  email?: string;
  esolLevel?: string;
  usedBy?: string | null;
  usedAt?: string | null;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EsolLearner {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  esolLevel?: string | null;
  l1Language?: string | null;
  uln?: string | null;
  ulnStatus?: UlnStatus | null;
  fundingStatus?: FundingStatus | null;
  esolOnboardedAt?: string | null;
  verified: boolean;
  isActive: boolean;
  status: "active" | "suspended" | "terminated" | "unverified";
  createdAt: string;
}

export interface EsolTeacher {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  esolTeacherApproved: boolean | null;
  esolQualificationType?: EsolQualificationType | null;
  esolQualificationUrl?: string | null;
  dbsCheckStatus?: DbsCheckStatus | null;
  esolTeacherNotes?: string | null;
  averageRating?: number;
  totalLessons?: number;
  verified?: boolean;
  createdAt: string;
}

export interface AISessionTurn {
  turnIndex: number;
  originalInput: string;
  scrubbed: boolean;
  deepSeekResponse: string;
  claudeAssessment?: string;
  safeguardingScore?: number;
  timestamp: string;
}

export interface AISession {
  _id: string;
  learnerId:
    | string
    | {
        _id: string;
        firstname: string;
        lastname: string;
        email: string;
        esolLevel?: string;
      };
  teacherId:
    | string
    | { _id: string; firstname: string; lastname: string; email: string };
  orgId: string;
  bookingId?: string | null;
  sessionMode: AISessionMode;
  esolLevel: string;
  topic?: string | null;
  turns: AISessionTurn[];
  safeguardingFlagged: boolean;
  safeguardingAlertId?: string | null;
  assessmentSummary?: string;
  vocabIntroduced?: string[];
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TurnResult {
  response: string;
  assessment: string;
  grammarFeedback: string;
  comprehensionScore: number;
  vocabIntroduced: string[];
  safeguardingFlagged: boolean;
  redactionsApplied: string[];
}

export interface TeacherPrepNote {
  _id: string;
  teacherId: string;
  learnerId: string;
  orgId: string;
  bookingId: string;
  sessionId?: string | null;
  content: string;
  viewedAt?: string | null;
  generatedAt: string;
}

export interface SessionAccessToken {
  token: string;
  expiresAt: string;
  sessionId: string;
}

export interface PaginatedResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrgListResponse extends PaginatedResponse<Organisation> {
  organisations: Organisation[];
}

export interface ReferralListResponse extends PaginatedResponse<ReferralToken> {
  tokens: ReferralToken[];
}

export interface LearnerListResponse extends PaginatedResponse<EsolLearner> {
  learners: EsolLearner[];
}

export interface TeacherListResponse extends PaginatedResponse<EsolTeacher> {
  teachers: EsolTeacher[];
}

export interface SessionListResponse extends PaginatedResponse<AISession> {
  sessions: AISession[];
}

export interface ReferralValidatePreview {
  orgName: string;
  orgLogoUrl: string | null;
  esolLevel: string | null;
  email: string | null;
}

export interface ReferralCreateResponse {
  referralToken: ReferralToken;
  inviteUrl: string;
}

export interface ProvisionOrgResponse {
  organisation: Organisation;
  adminUser: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
}
