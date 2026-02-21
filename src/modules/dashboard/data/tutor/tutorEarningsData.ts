// ── src/modules/dashboard/data/tutor/tutorEarningsData.ts ──

export interface EarningEntry {
  id: string;
  studentName: string;
  studentId: string;
  studentCountry?: string; // ← was required, now optional
  studentCountryCode?: string; // ← was required, now optional
  lessonDate: string;
  createdAt: string;
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
