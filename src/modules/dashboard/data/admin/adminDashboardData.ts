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

export interface RecentSignup {
  id: string;
  name: string;
  avatar?: string;
  type: "student" | "tutor";
  country: string;
  countryCode: string;
  date: string;
  status: "active" | "pending_approval";
}

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

export interface RecentTransaction {
  id: string;
  studentName: string;
  tutorName: string;
  amount: number;
  type: "payment" | "refund" | "payout";
  status: "completed" | "pending" | "processing" | "failed";
  date: string;
}

export interface FlaggedItem {
  id: string;
  type: "reported_review" | "pending_approval" | "failed_payout" | "dispute";
  title: string;
  description: string;
  date: string;
  severity: "low" | "medium" | "high";
}

export interface MonthlyRevenue {
  month: string;
  label: string;
  revenue: number;
  commission: number;
  lessons: number;
}

export interface AdminDashboardData {
  stats: PlatformStats;
  recentSignups: RecentSignup[];
  recentLessons: RecentLesson[];
  recentTransactions: RecentTransaction[];
  flaggedItems: FlaggedItem[];
  monthlyRevenue: MonthlyRevenue[];
}

const now = new Date();
const today = now.toISOString().split("T")[0];
const yesterday = new Date(now.getTime() - 86400000)
  .toISOString()
  .split("T")[0];

export const adminDashboardData: AdminDashboardData = {
  stats: {
    totalStudents: 342,
    totalTutors: 28,
    activeTutors: 22,
    pendingTutorApprovals: 3,
    totalLessons: 8420,
    lessonsToday: 47,
    lessonsThisWeek: 312,
    completionRate: 96.4,
    totalRevenue: 126400,
    revenueThisMonth: 14200,
    revenueLastMonth: 12800,
    revenueTrend: "up",
    revenueTrendPct: 10.9,
    platformCommission: 15,
    commissionEarnedThisMonth: 2130,
    pendingPayouts: 5,
    pendingPayoutsAmount: 1840,
    reportedReviews: 2,
    activeLessonsNow: 4,
  },
  monthlyRevenue: [
    {
      month: "2025-09",
      label: "Sep",
      revenue: 8200,
      commission: 1230,
      lessons: 547,
    },
    {
      month: "2025-10",
      label: "Oct",
      revenue: 9400,
      commission: 1410,
      lessons: 627,
    },
    {
      month: "2025-11",
      label: "Nov",
      revenue: 10800,
      commission: 1620,
      lessons: 720,
    },
    {
      month: "2025-12",
      label: "Dec",
      revenue: 11200,
      commission: 1680,
      lessons: 747,
    },
    {
      month: "2026-01",
      label: "Jan",
      revenue: 12800,
      commission: 1920,
      lessons: 853,
    },
    {
      month: "2026-02",
      label: "Feb",
      revenue: 14200,
      commission: 2130,
      lessons: 892,
    },
  ],
  recentSignups: [
    {
      id: "su-001",
      name: "Isabella Martinez",
      type: "student",
      country: "Spain",
      countryCode: "ES",
      date: `${today}T13:20:00Z`,
      status: "active",
    },
    {
      id: "su-002",
      name: "David Chen",
      type: "tutor",
      country: "Canada",
      countryCode: "CA",
      date: `${today}T11:45:00Z`,
      status: "pending_approval",
    },
    {
      id: "su-003",
      name: "Aisha Mohammed",
      type: "student",
      country: "UAE",
      countryCode: "AE",
      date: `${today}T09:10:00Z`,
      status: "active",
    },
    {
      id: "su-004",
      name: "Thomas Weber",
      type: "tutor",
      country: "Austria",
      countryCode: "AT",
      date: `${yesterday}T22:30:00Z`,
      status: "pending_approval",
    },
    {
      id: "su-005",
      name: "Mei Lin",
      type: "student",
      country: "China",
      countryCode: "CN",
      date: `${yesterday}T18:15:00Z`,
      status: "active",
    },
    {
      id: "su-006",
      name: "Sarah Johnson",
      type: "tutor",
      country: "United States",
      countryCode: "US",
      date: `${yesterday}T14:00:00Z`,
      status: "pending_approval",
    },
    {
      id: "su-007",
      name: "Omar Farouk",
      type: "student",
      country: "Egypt",
      countryCode: "EG",
      date: `${yesterday}T10:30:00Z`,
      status: "active",
    },
  ],
  recentLessons: [
    {
      id: "rl-001",
      studentName: "Amara Okonkwo",
      tutorName: "James Hartwell",
      type: "regular",
      status: "in_progress",
      date: `${today}T14:00:00Z`,
      duration: 60,
      amount: 15,
    },
    {
      id: "rl-002",
      studentName: "Kenji Tanaka",
      tutorName: "James Hartwell",
      type: "regular",
      status: "upcoming",
      date: `${today}T16:00:00Z`,
      duration: 45,
      amount: 11.25,
    },
    {
      id: "rl-003",
      studentName: "Sofia Reyes",
      tutorName: "Emily Clarke",
      type: "trial",
      status: "completed",
      date: `${today}T10:00:00Z`,
      duration: 30,
      amount: 0,
    },
    {
      id: "rl-004",
      studentName: "Lucas Müller",
      tutorName: "James Hartwell",
      type: "regular",
      status: "completed",
      date: `${today}T09:00:00Z`,
      duration: 60,
      amount: 15,
    },
    {
      id: "rl-005",
      studentName: "Pierre Dubois",
      tutorName: "Emily Clarke",
      type: "regular",
      status: "cancelled",
      date: `${yesterday}T15:00:00Z`,
      duration: 60,
      amount: 15,
    },
    {
      id: "rl-006",
      studentName: "Fatima Al-Hassan",
      tutorName: "James Hartwell",
      type: "regular",
      status: "no_show",
      date: `${yesterday}T11:00:00Z`,
      duration: 60,
      amount: 15,
    },
  ],
  recentTransactions: [
    {
      id: "rt-001",
      studentName: "Amara Okonkwo",
      tutorName: "James Hartwell",
      amount: 15,
      type: "payment",
      status: "completed",
      date: `${today}T09:05:00Z`,
    },
    {
      id: "rt-002",
      studentName: "Pierre Dubois",
      tutorName: "Emily Clarke",
      amount: 15,
      type: "refund",
      status: "processing",
      date: `${today}T08:30:00Z`,
    },
    {
      id: "rt-003",
      studentName: "",
      tutorName: "James Hartwell",
      amount: 560,
      type: "payout",
      status: "completed",
      date: `${yesterday}T16:00:00Z`,
    },
    {
      id: "rt-004",
      studentName: "Lucas Müller",
      tutorName: "James Hartwell",
      amount: 15,
      type: "payment",
      status: "completed",
      date: `${yesterday}T09:10:00Z`,
    },
    {
      id: "rt-005",
      studentName: "",
      tutorName: "Emily Clarke",
      amount: 320,
      type: "payout",
      status: "pending",
      date: `${yesterday}T08:00:00Z`,
    },
  ],
  flaggedItems: [
    {
      id: "fl-001",
      type: "reported_review",
      title: "Review reported by James Hartwell",
      description:
        "Student Carlos Mendez left a review claiming the tutor was late. Tutor disputes this.",
      date: `${today}T10:00:00Z`,
      severity: "medium",
    },
    {
      id: "fl-002",
      type: "pending_approval",
      title: "3 tutors awaiting approval",
      description:
        "David Chen, Thomas Weber, and Sarah Johnson have completed their applications.",
      date: `${today}T11:45:00Z`,
      severity: "high",
    },
    {
      id: "fl-003",
      type: "failed_payout",
      title: "Payout failed for Emily Clarke",
      description: "Bank transfer returned, invalid account details.",
      date: `${yesterday}T16:00:00Z`,
      severity: "high",
    },
    {
      id: "fl-004",
      type: "reported_review",
      title: "Review reported by Emily Clarke",
      description: "Student left inappropriate language in review text.",
      date: `${yesterday}T12:00:00Z`,
      severity: "low",
    },
  ],
};
