/* ──────────────────────────────────────────────
   Tutor Dashboard — API response types
   GET /api/tutor-dashboard
   ────────────────────────────────────────────── */

import type { BookingType, BookingStatus } from "./booking";

/* ──────────────────────────────────────────────
      Welcome section
      ────────────────────────────────────────────── */

export interface TutorDashboardWelcome {
  firstName: string;
  avatarUrl: string;
  isOnline: boolean;
  averageRating: number;
  totalStudents: number;
}

/* ──────────────────────────────────────────────
      Stats row
      ────────────────────────────────────────────── */

export interface TutorDashboardStats {
  todayLessons: number;
  weekLessons: number;
  newStudents: number;
  unreadMessages: number;
  totalLessons: number;
  averageRating: number;
  completionRate: number;
  totalStudents: number;
}

/* ──────────────────────────────────────────────
      Upcoming lesson (matches TutorDashboardLesson shape)
      ────────────────────────────────────────────── */

export interface DashboardUpcomingLesson {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentLevel: string;
  lessonType: BookingType;
  status: string;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  notes?: string;
}

/* ──────────────────────────────────────────────
      Pending booking (matches DashboardPendingBooking shape)
      ────────────────────────────────────────────── */

export interface DashboardPendingBooking {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentLevel: string;
  lessonType: BookingType;
  hoursRequested: number;
  totalAmount: number;
  requestedDate: string;
  message?: string;
}

/* ──────────────────────────────────────────────
      Earnings (matches TutorEarnings shape)
      ────────────────────────────────────────────── */

export interface DashboardEarnings {
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  totalEarnings: number;
  pendingPayout: number;
  nextPayoutDate: string;
  completedLessonsThisMonth: number;
}

/* ──────────────────────────────────────────────
      Availability (matches DashboardAvailabilityStatus shape)
      ────────────────────────────────────────────── */

export interface DashboardAvailability {
  totalSlotsThisWeek: number;
  bookedSlotsThisWeek: number;
  nextAvailableSlot: string;
}

/* ──────────────────────────────────────────────
      Performance (matches TutorPerformance shape)
      ────────────────────────────────────────────── */

export interface DashboardPerformance {
  rating: number;
  responseRate: number;
  completionRate: number;
  repeatStudentRate: number;
}

/* ──────────────────────────────────────────────
      Recent message (matches RecentStudentMessage shape)
      ────────────────────────────────────────────── */

export interface DashboardRecentMessage {
  id: string;
  studentName: string;
  studentAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

/* ──────────────────────────────────────────────
      Combined dashboard response
      ────────────────────────────────────────────── */

export interface TutorDashboardResponse {
  welcome: TutorDashboardWelcome;
  stats: TutorDashboardStats;
  upcomingLessons: DashboardUpcomingLesson[];
  pendingBookings: DashboardPendingBooking[];
  earnings: DashboardEarnings;
  availability: DashboardAvailability;
  performance: DashboardPerformance;
  recentMessages: DashboardRecentMessage[];
}

/* ──────────────────────────────────────────────
      Query params
      ────────────────────────────────────────────── */

export interface TutorDashboardQuery {
  upcomingLimit?: number;
  messagesLimit?: number;
}
