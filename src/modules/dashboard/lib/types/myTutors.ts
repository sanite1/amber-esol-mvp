/* ══════════════════════════════════════════════
   My Tutors Types
   ══════════════════════════════════════════════ */

export type TutorFilter = "all" | "active" | "past" | "favourites";
export type TutorSort = "recent" | "name" | "lessons" | "rating";

export interface NextLesson {
  bookingId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed";
}

export interface MyReview {
  reviewId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface MyTutor {
  id: string;
  slug: string;
  name: string;
  avatar: string | null;
  headline: string;
  specialty: string;
  languages: { name: string; fluency: string }[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  trialRate: number;
  responseTime: string;
  timezone: string;
  totalLessonsWithMe: number;
  completedLessons: number;
  nextLesson: NextLesson | null;
  lastLessonDate: string | null;
  hasUnreadMessage: boolean;
  myReview: MyReview | null;
  isFavourite: boolean;
  badges: string[];
}

export interface MyTutorsSummary {
  totalTutors: number;
  activeTutors: number;
  totalLessons: number;
  favourites: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyTutorsQuery {
  page?: number;
  limit?: number;
  search?: string;
  filter?: TutorFilter;
  sort?: TutorSort;
}

export interface ListMyTutorsResponse {
  summary: MyTutorsSummary;
  tutors: MyTutor[];
  pagination: PaginationMeta;
}

export interface ToggleFavouriteResponse {
  isFavourite: boolean;
}
