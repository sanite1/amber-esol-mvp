// ── src/modules/dashboard/data/tutor/tutorEarningsData.ts ──

export interface EarningEntry {
  id: string;
  studentName: string;
  studentId: string;
  studentCountry?: string; // ← was required, now optional
  studentCountryCode?: string; // ← was required, now optional
  lessonDate: string;
  lessonType: "trial" | "regular";
  lessonTopic?: string;
  duration: number;
  rate: number;
  amount: number;
  status: "paid" | "pending" | "processing";
  paidDate?: string;
  payoutId?: string;
}

export interface PayoutRecord {
  id: string;
  amount: number;
  status: "completed" | "processing" | "failed" | "scheduled";
  method: string;
  reference: string;
  requestedDate: string;
  completedDate?: string;
  entries: string[];
}

export interface EarningsStats {
  totalEarned: number;
  thisMonthEarned: number;
  lastMonthEarned: number;
  pendingBalance: number;
  availableBalance: number;
  processingBalance: number;
  totalLessons: number;
  avgPerLesson: number;
  avgPerHour: number;
  monthlyTrend: "up" | "down" | "stable";
  monthlyTrendPct: number;
}

export interface PayoutSettings {
  method: "bank_transfer" | "paypal" | "wise";
  bankName?: string;
  accountLast4?: string;
  paypalEmail?: string;
  wiseEmail?: string;
  minPayout: number;
  autoPayout: boolean;
  autoPayoutDay: number;
}

export interface MonthlyEarning {
  month: string;
  label: string;
  amount: number;
  lessons: number;
}

export interface TutorEarningsData {
  stats: EarningsStats;
  earnings: EarningEntry[];
  payouts: PayoutRecord[];
  payoutSettings: PayoutSettings;
  monthlyChart: MonthlyEarning[];
}

// Dummy data kept as fallback — no other changes below this line
export const tutorEarningsData: TutorEarningsData = {
  stats: {
    totalEarned: 4280,
    thisMonthEarned: 840,
    lastMonthEarned: 1120,
    pendingBalance: 340,
    availableBalance: 195,
    processingBalance: 145,
    totalLessons: 285,
    avgPerLesson: 15.02,
    avgPerHour: 15.02,
    monthlyTrend: "down",
    monthlyTrendPct: 25,
  },
  monthlyChart: [
    { month: "2025-09", label: "Sep", amount: 420, lessons: 28 },
    { month: "2025-10", label: "Oct", amount: 510, lessons: 34 },
    { month: "2025-11", label: "Nov", amount: 680, lessons: 45 },
    { month: "2025-12", label: "Dec", amount: 710, lessons: 47 },
    { month: "2026-01", label: "Jan", amount: 1120, lessons: 75 },
    { month: "2026-02", label: "Feb", amount: 840, lessons: 56 },
  ],
  payoutSettings: {
    method: "bank_transfer",
    bankName: "Barclays",
    accountLast4: "7842",
    minPayout: 50,
    autoPayout: true,
    autoPayoutDay: 1,
  },
  payouts: [
    {
      id: "po-001",
      amount: 560,
      status: "completed",
      method: "Bank Transfer",
      reference: "PO-2026-0201",
      requestedDate: "2026-02-01",
      completedDate: "2026-02-03",
      entries: ["e-001", "e-002", "e-003", "e-004", "e-005"],
    },
    {
      id: "po-002",
      amount: 1120,
      status: "completed",
      method: "Bank Transfer",
      reference: "PO-2026-0101",
      requestedDate: "2026-01-01",
      completedDate: "2026-01-03",
      entries: [],
    },
    {
      id: "po-003",
      amount: 145,
      status: "processing",
      method: "Bank Transfer",
      reference: "PO-2026-0210",
      requestedDate: "2026-02-10",
      entries: ["e-010", "e-011"],
    },
    {
      id: "po-004",
      amount: 195,
      status: "scheduled",
      method: "Bank Transfer",
      reference: "PO-2026-0301",
      requestedDate: "2026-03-01",
      entries: [],
    },
  ],
  earnings: [
    {
      id: "e-001",
      studentName: "Amara Okonkwo",
      studentId: "stu-001",
      studentCountry: "Nigeria",
      studentCountryCode: "NG",
      lessonDate: "2026-02-14T10:00:00Z",
      lessonType: "regular",
      lessonTopic: "Business Presentations",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "pending",
    },
    {
      id: "e-002",
      studentName: "Kenji Tanaka",
      studentId: "stu-002",
      studentCountry: "Japan",
      studentCountryCode: "JP",
      lessonDate: "2026-02-13T14:00:00Z",
      lessonType: "regular",
      lessonTopic: "IELTS Speaking",
      duration: 45,
      rate: 15,
      amount: 11.25,
      status: "pending",
    },
    {
      id: "e-003",
      studentName: "Pierre Dubois",
      studentId: "stu-006",
      studentCountry: "France",
      studentCountryCode: "FR",
      lessonDate: "2026-02-12T15:00:00Z",
      lessonType: "regular",
      lessonTopic: "Phrasal Verbs",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "pending",
    },
    {
      id: "e-004",
      studentName: "Lucas Mller",
      studentId: "stu-004",
      studentCountry: "Germany",
      studentCountryCode: "DE",
      lessonDate: "2026-02-13T09:00:00Z",
      lessonType: "regular",
      lessonTopic: "Conversational English",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "pending",
    },
    {
      id: "e-005",
      studentName: "Amara Okonkwo",
      studentId: "stu-001",
      studentCountry: "Nigeria",
      studentCountryCode: "NG",
      lessonDate: "2026-02-12T10:00:00Z",
      lessonType: "regular",
      lessonTopic: "Email Writing",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "pending",
    },
    {
      id: "e-006",
      studentName: "Pierre Dubois",
      studentId: "stu-006",
      studentCountry: "France",
      studentCountryCode: "FR",
      lessonDate: "2026-02-14T15:00:00Z",
      lessonType: "regular",
      lessonTopic: "Pronunciation",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "pending",
    },
    {
      id: "e-007",
      studentName: "Sofia Reyes",
      studentId: "stu-003",
      studentCountry: "Colombia",
      studentCountryCode: "CO",
      lessonDate: "2026-02-14T16:00:00Z",
      lessonType: "trial",
      lessonTopic: "Level Assessment",
      duration: 30,
      rate: 0,
      amount: 0,
      status: "paid",
      paidDate: "2026-02-14",
    },
    {
      id: "e-008",
      studentName: "Amara Okonkwo",
      studentId: "stu-001",
      studentCountry: "Nigeria",
      studentCountryCode: "NG",
      lessonDate: "2026-02-10T10:00:00Z",
      lessonType: "regular",
      lessonTopic: "Phone Conversations",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "paid",
      paidDate: "2026-02-03",
      payoutId: "po-001",
    },
    {
      id: "e-009",
      studentName: "Kenji Tanaka",
      studentId: "stu-002",
      studentCountry: "Japan",
      studentCountryCode: "JP",
      lessonDate: "2026-02-09T14:00:00Z",
      lessonType: "regular",
      lessonTopic: "IELTS Writing",
      duration: 45,
      rate: 15,
      amount: 11.25,
      status: "paid",
      paidDate: "2026-02-03",
      payoutId: "po-001",
    },
    {
      id: "e-010",
      studentName: "Lucas Mller",
      studentId: "stu-004",
      studentCountry: "Germany",
      studentCountryCode: "DE",
      lessonDate: "2026-02-06T09:00:00Z",
      lessonType: "regular",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "processing",
      payoutId: "po-003",
    },
    {
      id: "e-011",
      studentName: "Pierre Dubois",
      studentId: "stu-006",
      studentCountry: "France",
      studentCountryCode: "FR",
      lessonDate: "2026-02-05T15:00:00Z",
      lessonType: "regular",
      lessonTopic: "Idioms",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "processing",
      payoutId: "po-003",
    },
    {
      id: "e-012",
      studentName: "Fatima Al-Hassan",
      studentId: "stu-005",
      studentCountry: "Saudi Arabia",
      studentCountryCode: "SA",
      lessonDate: "2026-01-28T11:00:00Z",
      lessonType: "regular",
      lessonTopic: "Grammar Review",
      duration: 60,
      rate: 15,
      amount: 15,
      status: "paid",
      paidDate: "2026-02-03",
      payoutId: "po-001",
    },
  ],
};
