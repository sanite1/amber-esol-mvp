/* ── Types matching the backend response ── */

export interface AdminTutor {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  city: string;
  joinedDate: string;
  lastActive: string;
  status: "active" | "inactive" | "pending_approval" | "rejected" | "banned";
  bio: string;
  specialties: string[];
  qualifications: { title: string; institution: string; year: number }[];
  languages: { language: string; level: string }[];
  cefrLevels: string[];
  hourlyRate: number;
  totalLessons: number;
  completedLessons: number;
  totalStudents: number;
  totalEarned: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  responseRate: number;
  applicationNote?: string;
}

export interface AdminTutorsStats {
  total: number;
  active: number;
  inactive: number;
  pendingApproval: number;
  rejected: number;
  banned: number;
  newThisMonth: number;
}

export interface AdminTutorsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

export interface AdminTutorsResponse {
  stats: AdminTutorsStats;
  tutors: AdminTutor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminUpdateTutorStatusRequest {
  status: AdminTutor["status"];
  reason?: string;
}

export interface AdminUpdateTutorStatusResponse {
  id: string;
  status: AdminTutor["status"];
}
