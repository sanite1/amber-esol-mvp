/* ──────────────────────────────────────────────
   Enums / Unions
   ────────────────────────────────────────────── */

export type BookingType = "trial" | "regular";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled_student"
  | "cancelled_tutor"
  | "cancelled_admin"
  | "no_show";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed" | "free";

export type CancelledBy = "student" | "tutor" | "admin";

/* ──────────────────────────────────────────────
      Populated user snapshots
      (what comes back from .populate() on the backend)
      ────────────────────────────────────────────── */

export interface BookingStudent {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  learningPreferences?: {
    currentLevel?: string;
    targetLevel?: string;
    goals?: string[];
    preferredSchedule?: string[];
    lessonTypePreference?: string;
  };
  address?: {
    country?: string;
  };
}

export interface BookingTutor {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  specializations?: string[];
  hourlyRate?: number;
}

/* ──────────────────────────────────────────────
      Main Booking type (what the backend returns)
      ────────────────────────────────────────────── */

export interface Booking {
  _id: string;
  studentId: string | BookingStudent;
  tutorId: string | BookingTutor;

  type: BookingType;
  status: BookingStatus;

  bookingGroupId?: string;

  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  timezone: string;

  price: number;
  currency: string;

  specialty?: string;
  notes?: string;
  message?: string;

  meetingUrl?: string;
  calendarEventId?: string;

  cancelReason?: string;
  cancelledBy?: CancelledBy;
  cancelledAt?: string;
  learningPreferences?: {
    currentLevel?: string;
    targetLevel?: string;
    goals?: string[];
    preferredSchedule?: string[];
    lessonTypePreference?: string;
  };

  stripePaymentIntentId?: string;
  stripeCheckoutSessionId?: string;
  paymentStatus: PaymentStatus;

  completedAt?: string;

  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
      Request payloads
      ────────────────────────────────────────────── */

export interface SlotSelection {
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface CreateBookingPayload {
  tutorId: string;
  type: BookingType;
  slots: SlotSelection[];
  specialty?: string;
  notes?: string;
  message?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CancelBookingPayload {
  reason?: string;
}

export interface DeclineBookingPayload {
  reason?: string;
}

/* ──────────────────────────────────────────────
      Query params
      ────────────────────────────────────────────── */

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  type?: BookingType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: "newest" | "oldest" | "price_high" | "price_low";
}

export interface UpcomingQuery {
  limit?: number;
}

/* ──────────────────────────────────────────────
      Response types
      ────────────────────────────────────────────── */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateBookingResponse {
  bookings: Booking[];
  bookingGroupId: string | null;
  checkoutUrl: string | null;
  totalPrice: number;
  paymentRequired: boolean;
}

export interface ListBookingsResponse {
  bookings: Booking[];
  pagination: PaginationMeta;
}

export interface UpcomingBookingsResponse {
  bookings: Booking[];
}

export interface BookingStatsResponse {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShows: number;
  upcoming: number;
  hoursThisMonth: number;
  earningsThisMonth: number;
  totalSpent: number;
}

/* ──────────────────────────────────────────────
      Helper types for components
      ────────────────────────────────────────────── */

/** Flattened lesson shape for student MyLessons page */
export interface StudentLesson {
  _id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  tutorSpecialty: string;
  date: string;
  startTime: string;
  endTime: string;
  type: BookingType;
  status: BookingStatus;
  price: number;
  meetingUrl: string | null;
  notes: string | null;
  cancelledBy: CancelledBy | null;
  cancelReason: string | null;
  createdAt: string;
}

/** Flattened lesson shape for tutor TutorLessons page */
export interface TutorLesson {
  _id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentLevel: string;
  studentCountry: string;
  lessonType: BookingType;
  status: BookingStatus;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  notes?: string;
  earnings: number;
  cancelledBy?: CancelledBy;
  cancellationReason?: string;
}

/** Pending booking shape for tutor dashboard PendingBookingsCard */
export interface PendingBooking {
  _id: string;
  studentName: string;
  studentAvatar: string;
  studentLevel: string;
  hoursRequested: number;
  totalAmount: number;
  requestedDate: string;
  lessonType: BookingType;
  message?: string;
}

/** Stats shape for student MyLessons stats bar */
export interface StudentLessonStats {
  totalLessons: number;
  upcomingLessons: number;
  completedLessons: number;
  cancelledLessons: number;
  totalHours: number;
  totalSpent: number;
}

/** Stats shape for tutor TutorLessons stats bar */
export interface TutorLessonStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  noShows: number;
  hoursThisMonth: number;
  earningsThisMonth: number;
}

/** Shape the UpcomingLessons dashboard component expects */
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

/** Shape the TutorUpcomingLessons dashboard component expects */
export interface TutorDashboardLesson {
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

/** Shape the PendingBookingsCard dashboard component expects */
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
