/* ── Types matching the backend response ── */

export interface AdminStudent {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  country: string;
  countryCode: string;
  level: string;
  joinedDate: string;
  lastActive: string;
  status: "active" | "inactive" | "banned";
  totalLessons: number;
  completedLessons: number;
  totalSpent: number;
  activeTutor?: string;
  trialUsed: boolean;
}

export interface AdminStudentsStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  newThisMonth: number;
}

export interface AdminStudentsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

export interface AdminStudentsResponse {
  stats: AdminStudentsStats;
  students: AdminStudent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUpdateStudentStatusRequest {
  status: "active" | "inactive" | "banned";
  reason?: string;
}

export interface AdminUpdateStudentStatusResponse {
  id: string;
  status: "active" | "inactive" | "banned";
}
