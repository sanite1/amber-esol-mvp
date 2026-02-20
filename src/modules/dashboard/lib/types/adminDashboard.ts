/* ──────────────────────────────────────────────
   Admin Dashboard — API response types
   GET /api/admin-dashboard
   ────────────────────────────────────────────── */

/* ──────────────────────────────────────────────
   Platform stats (matches PlatformStats shape)
   ────────────────────────────────────────────── */

export interface PlatformStats {
  totalStudents: number;
  totalTutors: number;
  activeTutors: number;
  pendingTutorApprovals: number;
  totalLessons: number;
  lessonsToday: number;
  lessonsThisWeek: number;
  completionRate: number;
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueTrend: "up" | "down" | "stable";
  revenueTrendPct: number;
  platformCommission: number;
  commissionEarnedThisMonth: number;
  pendingPayouts: number;
  pendingPayoutsAmount: number;
  reportedReviews: number;
  activeLessonsNow: number;
}

/* ──────────────────────────────────────────────
     Monthly revenue chart data point
     ────────────────────────────────────────────── */

export interface MonthlyRevenue {
  month: string;
  label: string;
  revenue: number;
  commission: number;
  lessons: number;
}

/* ──────────────────────────────────────────────
     Recent signup
     ────────────────────────────────────────────── */

export interface RecentSignup {
  id: string;
  name: string;
  avatar: string;
  type: "student" | "tutor";
  country: string;
  countryCode: string;
  date: string;
  status: "active" | "pending_approval";
}

/* ──────────────────────────────────────────────
     Recent lesson
     ────────────────────────────────────────────── */

export interface RecentLesson {
  id: string;
  studentName: string;
  tutorName: string;
  type: "trial" | "regular";
  status: "completed" | "upcoming" | "cancelled" | "in_progress" | "no_show";
  date: string;
  duration: number;
  amount: number;
}

/* ──────────────────────────────────────────────
     Recent transaction
     ────────────────────────────────────────────── */

export interface RecentTransaction {
  id: string;
  studentName: string;
  tutorName: string;
  amount: number;
  type: "payment" | "refund" | "payout";
  status: "completed" | "pending" | "processing" | "failed";
  date: string;
}

/* ──────────────────────────────────────────────
     Flagged item
     ────────────────────────────────────────────── */

export interface FlaggedItem {
  id: string;
  type: "reported_review" | "pending_approval" | "failed_payout" | "dispute";
  title: string;
  description: string;
  date: string;
  severity: "low" | "medium" | "high";
}

/* ──────────────────────────────────────────────
     Combined dashboard response
     ────────────────────────────────────────────── */

export interface AdminDashboardResponse {
  stats: PlatformStats;
  monthlyRevenue: MonthlyRevenue[];
  recentSignups: RecentSignup[];
  recentLessons: RecentLesson[];
  recentTransactions: RecentTransaction[];
  flaggedItems: FlaggedItem[];
}

/* ──────────────────────────────────────────────
     Query params
     ────────────────────────────────────────────── */

export interface AdminDashboardQuery {
  signupsLimit?: number;
  lessonsLimit?: number;
  transactionsLimit?: number;
  chartMonths?: number;
}
