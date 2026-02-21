/* ──────────────────────────────────────────────
   Admin Review Stats (from GET /api/reviews/admin/stats)
   ────────────────────────────────────────────── */

export interface AdminReviewsStats {
  totalReviews: number;
  publishedReviews: number;
  hiddenReviews: number;
  removedReviews: number;
  averageRating: number;
  totalReports: number;
  pendingReports: number;
  dismissedReports: number;
  actionsTaken: number;
  reviewsThisMonth: number;
  reportsThisMonth: number;
}

/* ──────────────────────────────────────────────
     AdminReview — the shape child components expect
     (AdminReviewCard, ReviewDetailModal)
     ────────────────────────────────────────────── */

export interface AdminReviewReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterType: "student" | "tutor";
  reason: "inappropriate" | "fake" | "harassment" | "spam" | "other";
  description: string;
  createdAt: string;
  status: "pending" | "dismissed" | "action_taken";
}

export interface AdminReview {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  lessonId: string;
  lessonTopic: string;
  lessonDate: string;
  lessonType: "trial" | "standard";
  rating: number;
  comment: string;
  tutorReply?: string;
  tutorRepliedAt?: string;
  createdAt: string;
  status: "published" | "hidden" | "removed";
  reported: boolean;
  reports: AdminReviewReport[];
  helpfulCount: number;
}
