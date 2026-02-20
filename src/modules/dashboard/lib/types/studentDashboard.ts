/* ──────────────────────────────────────────────
   Student Dashboard — API response types
   GET /api/student-dashboard
   ────────────────────────────────────────────── */

import type { BookingType } from "./booking";

/* ──────────────────────────────────────────────
      Welcome section
      ────────────────────────────────────────────── */

export interface StudentDashboardWelcome {
  firstName: string;
  hasUpcomingLesson: boolean;
  nextLessonTime: string | null; // ISO datetime string or null
}

/* ──────────────────────────────────────────────
      Stats grid
      ────────────────────────────────────────────── */

export interface StudentDashboardStats {
  totalLessons: number;
  completedLessons: number;
  cancelledLessons: number;
  activeTutors: number;
}

/* ──────────────────────────────────────────────
      Upcoming lesson (matches DashboardUpcomingLesson shape)
      ────────────────────────────────────────────── */

export interface DashboardUpcomingLesson {
  id: string;
  tutorName: string;
  tutorAvatar: string;
  date: string;
  startTime: string;
  endTime: string;
  type: BookingType;
  status: string;
  meetingUrl: string | null;
}

/* ──────────────────────────────────────────────
      Recent message (matches RecentMessage shape)
      ────────────────────────────────────────────── */

export interface DashboardRecentMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: "tutor" | "student";
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

/* ──────────────────────────────────────────────
      Spending summary (matches SpendingSummary shape)
      ────────────────────────────────────────────── */

export interface DashboardSpendingSummary {
  totalSpent: number;
  thisMonthSpent: number;
  upcomingLessonsValue: number;
  totalHoursBooked: number;
}

/* ──────────────────────────────────────────────
      Learning progress (matches LearningProgress shape)
      ────────────────────────────────────────────── */

export interface DashboardLearningProgress {
  currentLevel: string;
  targetLevel: string;
  lessonsCompleted: number;
  totalLessonsNeeded: number;
  streak: number;
  longestStreak: number;
  hoursLearned: number;
}

/* ──────────────────────────────────────────────
      Recommended tutor (matches RecommendedTutor shape)
      ────────────────────────────────────────────── */

export interface DashboardRecommendedTutor {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  nextAvailable: string;
}

/* ──────────────────────────────────────────────
      Combined dashboard response
      ────────────────────────────────────────────── */

export interface StudentDashboardResponse {
  welcome: StudentDashboardWelcome;
  stats: StudentDashboardStats;
  upcomingLessons: DashboardUpcomingLesson[];
  recentMessages: DashboardRecentMessage[];
  spendingSummary: DashboardSpendingSummary;
  learningProgress: DashboardLearningProgress;
  recommendedTutors: DashboardRecommendedTutor[];
}

/* ──────────────────────────────────────────────
      Query params
      ────────────────────────────────────────────── */

export interface StudentDashboardQuery {
  upcomingLimit?: number;
  messagesLimit?: number;
  recommendedLimit?: number;
}
