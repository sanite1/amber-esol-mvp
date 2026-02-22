// ── Types ──

export type LessonStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled_student"
  | "cancelled_tutor"
  | "no_show";

export type LessonType = "trial" | "regular";

export interface Lesson {
  id: string;
  tutorId?: string;
  tutorName: string;
  tutorAvatar: string;
  tutorSpecialty: string;
  tutorSlug?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: LessonType;
  status: LessonStatus;
  timezone?: string;
  price: number;
  meetingUrl: string | null;
  notes: string | null;
  cancelledBy: "student" | "tutor" | "admin" | null;
  cancelReason: string | null;
  hasReview: boolean;
  review: {
    rating: number;
    comment: string;
    date: string;
  } | null;
  materials: string[];
  createdAt: string;
}

export type LessonFilter =
  | "all"
  | "pending"
  | "upcoming"
  | "completed"
  | "cancelled";
export type LessonSort = "date_desc" | "date_asc" | "tutor" | "price";

export interface LessonStats {
  totalLessons: number;
  upcomingLessons: number;
  completedLessons: number;
  cancelledLessons: number;
  totalHours: number;
  totalSpent: number;
}

// ── Dummy Data ──

export const lessonStats: LessonStats = {
  totalLessons: 28,
  upcomingLessons: 3,
  completedLessons: 23,
  cancelledLessons: 2,
  totalHours: 26.5,
  totalSpent: 712,
};

export const myLessons: Lesson[] = [
  {
    id: "ls-001",
    tutorId: "t-001",
    tutorName: "Sarah Mitchell",
    tutorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    tutorSpecialty: "Business English",
    tutorSlug: "sarah-mitchell",
    date: "2026-02-15T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    type: "regular",
    status: "confirmed",
    price: 32,
    meetingUrl: "https://meet.amber-esol.com/abc123",
    notes: "Focus on presentation skills and professional vocabulary",
    cancelledBy: null,
    cancelReason: null,
    hasReview: false,
    review: null,
    materials: [],
    createdAt: "2026-02-10T09:00:00Z",
  },
  {
    id: "ls-002",
    tutorId: "t-002",
    tutorName: "James Okonkwo",
    tutorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    tutorSpecialty: "IELTS Preparation",
    tutorSlug: "james-okonkwo",
    date: "2026-02-17T00:00:00Z",
    startTime: "10:00",
    endTime: "11:00",
    type: "regular",
    status: "confirmed",
    price: 28,
    meetingUrl: "https://meet.amber-esol.com/def456",
    notes: "Speaking practice test, Part 2 and 3",
    cancelledBy: null,
    cancelReason: null,
    hasReview: false,
    review: null,
    materials: [],
    createdAt: "2026-02-08T14:30:00Z",
  },
  {
    id: "ls-003",
    tutorId: "t-003",
    tutorName: "Elena Popova",
    tutorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    tutorSpecialty: "Conversational English",
    tutorSlug: "elena-popova",
    date: "2026-02-19T00:00:00Z",
    startTime: "16:00",
    endTime: "17:00",
    type: "trial",
    status: "pending",
    price: 0,
    meetingUrl: null,
    notes: null,
    cancelledBy: null,
    cancelReason: null,
    hasReview: false,
    review: null,
    materials: [],
    createdAt: "2026-02-13T11:00:00Z",
  },
  {
    id: "ls-004",
    tutorId: "t-001",
    tutorName: "Sarah Mitchell",
    tutorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    tutorSpecialty: "Business English",
    tutorSlug: "sarah-mitchell",
    date: "2026-02-12T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    type: "regular",
    status: "completed",
    price: 32,
    meetingUrl: null,
    notes: "Reviewed negotiation language and role-play scenarios",
    cancelledBy: null,
    cancelReason: null,
    hasReview: true,
    review: {
      rating: 5,
      comment: "Excellent session on negotiation vocabulary. Very practical!",
      date: "2026-02-12T16:00:00Z",
    },
    materials: ["Negotiation Phrases PDF", "Role-Play Scenarios"],
    createdAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "ls-005",
    tutorId: "t-002",
    tutorName: "James Okonkwo",
    tutorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    tutorSpecialty: "IELTS Preparation",
    tutorSlug: "james-okonkwo",
    date: "2026-02-10T00:00:00Z",
    startTime: "10:00",
    endTime: "11:00",
    type: "regular",
    status: "completed",
    price: 28,
    meetingUrl: null,
    notes: "Writing Task 2 practice, agree/disagree essay",
    cancelledBy: null,
    cancelReason: null,
    hasReview: true,
    review: {
      rating: 5,
      comment: "James gave incredibly detailed feedback on my essay structure.",
      date: "2026-02-10T12:30:00Z",
    },
    materials: ["Writing Task 2 Template", "Band 9 Sample Essays"],
    createdAt: "2026-02-03T15:00:00Z",
  },
  {
    id: "ls-006",
    tutorId: "t-001",
    tutorName: "Sarah Mitchell",
    tutorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    tutorSpecialty: "Business English",
    tutorSlug: "sarah-mitchell",
    date: "2026-02-08T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    type: "regular",
    status: "completed",
    price: 32,
    meetingUrl: null,
    notes: "Email writing best practices",
    cancelledBy: null,
    cancelReason: null,
    hasReview: false,
    review: null,
    materials: ["Email Templates Pack"],
    createdAt: "2026-02-01T11:00:00Z",
  },
  {
    id: "ls-007",
    tutorId: "t-004",
    tutorName: "Anna Kowalski",
    tutorAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
    tutorSpecialty: "Academic English",
    tutorSlug: "anna-kowalski",
    date: "2026-02-05T00:00:00Z",
    startTime: "11:00",
    endTime: "12:00",
    type: "regular",
    status: "completed",
    price: 28,
    meetingUrl: null,
    notes: "Academic essay review and feedback",
    cancelledBy: null,
    cancelReason: null,
    hasReview: true,
    review: {
      rating: 4,
      comment:
        "Great feedback. Could have been a bit more focused on citations.",
      date: "2026-02-05T14:00:00Z",
    },
    materials: ["Academic Writing Guide"],
    createdAt: "2026-01-28T09:00:00Z",
  },
  {
    id: "ls-008",
    tutorId: "t-005",
    tutorName: "David Chen",
    tutorAvatar: "https://randomuser.me/api/portraits/men/52.jpg",
    tutorSpecialty: "Pronunciation",
    tutorSlug: "david-chen",
    date: "2026-02-03T00:00:00Z",
    startTime: "19:00",
    endTime: "20:00",
    type: "regular",
    status: "cancelled_student",
    price: 24,
    meetingUrl: null,
    notes: null,
    cancelledBy: "student",
    cancelReason: "Schedule conflict",
    hasReview: false,
    review: null,
    materials: [],
    createdAt: "2026-01-25T10:00:00Z",
  },
  {
    id: "ls-009",
    tutorId: "t-001",
    tutorName: "Sarah Mitchell",
    tutorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    tutorSpecialty: "Business English",
    tutorSlug: "sarah-mitchell",
    date: "2026-01-29T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    type: "regular",
    status: "cancelled_tutor",
    price: 32,
    meetingUrl: null,
    notes: null,
    cancelledBy: "tutor",
    cancelReason: "Tutor was unwell",
    hasReview: false,
    review: null,
    materials: [],
    createdAt: "2026-01-22T08:00:00Z",
  },
  {
    id: "ls-010",
    tutorId: "t-002",
    tutorName: "James Okonkwo",
    tutorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    tutorSpecialty: "IELTS Preparation",
    tutorSlug: "james-okonkwo",
    date: "2026-01-27T00:00:00Z",
    startTime: "10:00",
    endTime: "11:00",
    type: "regular",
    status: "completed",
    price: 28,
    meetingUrl: null,
    notes: "Listening practice, Section 3 and 4",
    cancelledBy: null,
    cancelReason: null,
    hasReview: true,
    review: {
      rating: 5,
      comment: "Great listening strategies. I feel much more confident now.",
      date: "2026-01-27T13:00:00Z",
    },
    materials: ["IELTS Listening Tips PDF"],
    createdAt: "2026-01-20T10:00:00Z",
  },
];
