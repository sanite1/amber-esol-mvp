/* ──────────────────────────────────────────────
   Enums / Unions
   ────────────────────────────────────────────── */

export type ReviewStatus = "published" | "hidden" | "removed";
export type ReportStatus = "pending" | "reviewed" | "dismissed";

/* ──────────────────────────────────────────────
      Populated snapshots
      (what comes back from .populate() on the backend)
      ────────────────────────────────────────────── */

export interface ReviewStudent {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  email?: string;
  address?: {
    country?: string;
  };
}

export interface ReviewTutor {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: string;
  email?: string;
  specializations?: string[];
}

export interface ReviewBooking {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  specialty?: string;
}

export interface ReviewReporter {
  _id: string;
  firstname: string;
  lastname: string;
  email?: string;
}

/* ──────────────────────────────────────────────
      Sub-documents
      ────────────────────────────────────────────── */

export interface ReviewReply {
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewReport {
  _id: string;
  reporterId: string | ReviewReporter;
  reason: string;
  status: ReportStatus;
  reviewedAt?: string;
  createdAt: string;
}

/* ──────────────────────────────────────────────
      Main Review type (what the backend returns)
      ────────────────────────────────────────────── */

export interface Review {
  _id: string;
  bookingId: string | ReviewBooking;
  studentId: string | ReviewStudent;
  tutorId: string | ReviewTutor;

  rating: number;
  comment: string;

  lessonTopic?: string;
  lessonType?: "trial" | "regular";

  reply?: ReviewReply;

  reported: boolean;
  reports: ReviewReport[];

  status: ReviewStatus;

  helpfulCount: number;
  helpfulBy: string[];

  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
      Request payloads
      ────────────────────────────────────────────── */

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReplyPayload {
  text: string;
}

export interface ReportReviewPayload {
  reason: string;
}

export interface AdminReviewActionPayload {
  reason?: string;
}

export interface AdminReportActionPayload {
  status: "reviewed" | "dismissed";
}

/* ──────────────────────────────────────────────
      Query params
      ────────────────────────────────────────────── */

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: 1 | 2 | 3 | 4 | 5;
  sort?: "newest" | "oldest" | "rating_high" | "rating_low" | "most_helpful";
}

export interface AdminReviewFilters {
  page?: number;
  limit?: number;
  status?: ReviewStatus;
  reported?: boolean;
  sort?: "newest" | "oldest" | "rating_high" | "rating_low" | "most_reported";
  search?: string;
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

export interface ListReviewsResponse {
  reviews: Review[];
  pagination: PaginationMeta;
}

export interface ReviewStatsResponse {
  averageRating: number;
  totalReviews: number;
  totalHelpful: number;
  ratingDistribution: Record<number, number>;
}

export interface ToggleHelpfulResponse {
  helpfulCount: number;
  isHelpful: boolean;
}
