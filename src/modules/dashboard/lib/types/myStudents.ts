/* ══════════════════════════════════════════════
   My Students Types
   ══════════════════════════════════════════════ */

export type StudentStatusFilter = "all" | "active" | "trial" | "inactive";
export type StudentSortOption = "recent" | "name" | "lessons" | "joined";

export interface StudentLesson {
  id: string;
  date: string;
  type: "trial" | "regular";
  status: "completed" | "upcoming" | "cancelled" | "no_show";
  duration: number;
  topic?: string;
}

export interface TutorStudent {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
  country: string;
  countryCode: string;
  level: string;
  languages: string[];
  joinedDate: string;
  lastLessonDate: string;
  nextLessonDate: string | null;
  totalLessons: number;
  completedLessons: number;
  cancelledLessons: number;
  noShows: number;
  totalHours: number;
  totalSpent: number;
  averageRating: number | null;
  status: "active" | "inactive" | "trial";
  notes: string | null;
  recentLessons: StudentLesson[];
  goals: string[];
}

export interface TutorStudentsStats {
  totalStudents: number;
  activeStudents: number;
  trialStudents: number;
  inactiveStudents: number;
  avgLessonsPerStudent: number;
  totalRevenue: number;
  retentionRate: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyStudentsQuery {
  page?: number;
  limit?: number;
  search?: string;
  filter?: StudentStatusFilter;
  sort?: StudentSortOption;
}

export interface ListMyStudentsResponse {
  stats: TutorStudentsStats;
  students: TutorStudent[];
  pagination: PaginationMeta;
}

export interface UpdateNotesResponse {
  notes: string;
}
