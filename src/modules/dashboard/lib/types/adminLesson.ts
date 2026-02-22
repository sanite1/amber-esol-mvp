/* ──────────────────────────────────────────────
   Admin Lessons Stats (from GET /api/bookings/admin/stats)
   ────────────────────────────────────────────── */

export interface AdminLessonsStats {
  totalLessons: number;
  completedLessons: number;
  upcomingLessons: number;
  cancelledLessons: number;
  noShowLessons: number;
  inProgressLessons: number;
  trialLessons: number;
  totalRevenue: number;
  totalCommission: number;
  completionRate: number;
  avgRating: number;
  flaggedLessons: number;
}

/* ──────────────────────────────────────────────
     AdminLesson — the shape child components expect
     (AdminLessonCard, LessonDetailModal)
     ────────────────────────────────────────────── */

export interface AdminLesson {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  timezone?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: "trial" | "standard";
  status:
    | "upcoming"
    | "in_progress"
    | "completed"
    | "cancelled_student"
    | "cancelled_tutor"
    | "cancelled_admin"
    | "no_show";
  subject: string;
  topic?: string;
  amount: number;
  tutorEarnings: number;
  commission: number;
  paymentStatus: "paid" | "refunded" | "pending" | "free";
  rating?: number;
  reviewId?: string;
  notes?: string;
  flagged: boolean;
  flagReason?: string;
  cancelReason?: string;
  createdAt: string;
}
