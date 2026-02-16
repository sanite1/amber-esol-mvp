// ─── Interfaces ─────────────────────────────────────────────────────

export interface AdminLesson {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  date: string; // ISO date
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  duration: number; // minutes
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
  amount: number; // £ charged to student
  tutorEarnings: number; // £ tutor receives
  commission: number; // £ platform keeps
  paymentStatus: "paid" | "refunded" | "pending" | "free";
  rating?: number;
  reviewId?: string;
  notes?: string;
  flagged: boolean;
  flagReason?: string;
  cancelReason?: string;
  createdAt: string;
}

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

export interface AdminLessonsData {
  stats: AdminLessonsStats;
  lessons: AdminLesson[];
}

// ─── Sample Data ────────────────────────────────────────────────────

export const adminLessonsData: AdminLessonsData = {
  stats: {
    totalLessons: 1847,
    completedLessons: 1562,
    upcomingLessons: 134,
    cancelledLessons: 98,
    noShowLessons: 23,
    inProgressLessons: 6,
    trialLessons: 214,
    totalRevenue: 126400,
    totalCommission: 18960,
    completionRate: 96.4,
    avgRating: 4.8,
    flaggedLessons: 3,
  },
  lessons: [
    {
      id: "lesson-001",
      studentId: "student-001",
      studentName: "Yuki Tanaka",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      date: "2026-02-16",
      startTime: "09:00",
      endTime: "10:00",
      duration: 60,
      type: "standard",
      status: "in_progress",
      subject: "English",
      topic: "Business English – Presentations",
      amount: 15,
      tutorEarnings: 12.75,
      commission: 2.25,
      paymentStatus: "paid",
      flagged: false,
      createdAt: "2026-02-14T10:00:00Z",
    },
    {
      id: "lesson-002",
      studentId: "student-002",
      studentName: "Maria García",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      date: "2026-02-16",
      startTime: "11:00",
      endTime: "11:30",
      duration: 30,
      type: "trial",
      status: "upcoming",
      subject: "English",
      topic: "Level Assessment",
      amount: 0,
      tutorEarnings: 0,
      commission: 0,
      paymentStatus: "free",
      flagged: false,
      createdAt: "2026-02-15T08:30:00Z",
    },
    {
      id: "lesson-003",
      studentId: "student-003",
      studentName: "Ahmed Al-Rashid",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      date: "2026-02-15",
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      type: "standard",
      status: "completed",
      subject: "English",
      topic: "IELTS Writing Task 2",
      amount: 18,
      tutorEarnings: 15.3,
      commission: 2.7,
      paymentStatus: "paid",
      rating: 5,
      reviewId: "review-003",
      flagged: false,
      createdAt: "2026-02-12T09:00:00Z",
    },
    {
      id: "lesson-004",
      studentId: "student-004",
      studentName: "Chen Wei",
      tutorId: "tutor-003",
      tutorName: "David Mitchell",
      date: "2026-02-15",
      startTime: "10:00",
      endTime: "11:00",
      duration: 60,
      type: "standard",
      status: "cancelled_student",
      subject: "English",
      topic: "Conversation Practice",
      amount: 15,
      tutorEarnings: 0,
      commission: 0,
      paymentStatus: "refunded",
      cancelReason: "Student requested cancellation – scheduling conflict",
      flagged: false,
      createdAt: "2026-02-10T14:20:00Z",
    },
    {
      id: "lesson-005",
      studentId: "student-005",
      studentName: "Anna Kowalski",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      date: "2026-02-14",
      startTime: "16:00",
      endTime: "17:00",
      duration: 60,
      type: "standard",
      status: "no_show",
      subject: "English",
      topic: "Grammar – Conditionals",
      amount: 18,
      tutorEarnings: 18,
      commission: 0,
      paymentStatus: "paid",
      notes: "Student did not join. Tutor waited full session.",
      flagged: true,
      flagReason: "Repeated no-show – 3rd occurrence this month",
      createdAt: "2026-02-11T12:00:00Z",
    },
    {
      id: "lesson-006",
      studentId: "student-006",
      studentName: "Lucas Müller",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      date: "2026-02-17",
      startTime: "09:00",
      endTime: "10:00",
      duration: 60,
      type: "standard",
      status: "upcoming",
      subject: "English",
      topic: "Phrasal Verbs",
      amount: 12,
      tutorEarnings: 10.2,
      commission: 1.8,
      paymentStatus: "paid",
      flagged: false,
      createdAt: "2026-02-13T16:45:00Z",
    },
    {
      id: "lesson-007",
      studentId: "student-007",
      studentName: "Fatima Hassan",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      date: "2026-02-14",
      startTime: "13:00",
      endTime: "14:00",
      duration: 60,
      type: "standard",
      status: "completed",
      subject: "English",
      topic: "Academic Writing",
      amount: 15,
      tutorEarnings: 12.75,
      commission: 2.25,
      paymentStatus: "paid",
      rating: 4,
      flagged: false,
      createdAt: "2026-02-10T11:00:00Z",
    },
    {
      id: "lesson-008",
      studentId: "student-001",
      studentName: "Yuki Tanaka",
      tutorId: "tutor-003",
      tutorName: "David Mitchell",
      date: "2026-02-13",
      startTime: "15:00",
      endTime: "16:00",
      duration: 60,
      type: "standard",
      status: "cancelled_tutor",
      subject: "English",
      topic: "Pronunciation Clinic",
      amount: 15,
      tutorEarnings: 0,
      commission: 0,
      paymentStatus: "refunded",
      cancelReason: "Tutor unavailable – illness",
      flagged: false,
      createdAt: "2026-02-09T08:15:00Z",
    },
    {
      id: "lesson-009",
      studentId: "student-008",
      studentName: "Priya Sharma",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      date: "2026-02-18",
      startTime: "10:00",
      endTime: "10:30",
      duration: 30,
      type: "trial",
      status: "upcoming",
      subject: "English",
      topic: "Introduction & Assessment",
      amount: 0,
      tutorEarnings: 0,
      commission: 0,
      paymentStatus: "free",
      flagged: false,
      createdAt: "2026-02-15T20:00:00Z",
    },
    {
      id: "lesson-010",
      studentId: "student-009",
      studentName: "Tomasz Nowak",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      date: "2026-02-12",
      startTime: "11:00",
      endTime: "12:00",
      duration: 60,
      type: "standard",
      status: "completed",
      subject: "English",
      topic: "Job Interview Prep",
      amount: 12,
      tutorEarnings: 10.2,
      commission: 1.8,
      paymentStatus: "paid",
      rating: 5,
      reviewId: "review-010",
      flagged: false,
      createdAt: "2026-02-08T14:00:00Z",
    },
    {
      id: "lesson-011",
      studentId: "student-010",
      studentName: "Sofia Rossi",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      date: "2026-02-16",
      startTime: "15:00",
      endTime: "16:00",
      duration: 60,
      type: "standard",
      status: "upcoming",
      subject: "English",
      topic: "Advanced Vocabulary",
      amount: 15,
      tutorEarnings: 12.75,
      commission: 2.25,
      paymentStatus: "paid",
      flagged: false,
      createdAt: "2026-02-14T09:30:00Z",
    },
    {
      id: "lesson-012",
      studentId: "student-003",
      studentName: "Ahmed Al-Rashid",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      date: "2026-02-11",
      startTime: "14:00",
      endTime: "15:00",
      duration: 60,
      type: "standard",
      status: "completed",
      subject: "English",
      topic: "IELTS Speaking Mock",
      amount: 18,
      tutorEarnings: 15.3,
      commission: 2.7,
      paymentStatus: "paid",
      rating: 5,
      flagged: true,
      flagReason: "Student disputed charge – claims lesson was cut short",
      createdAt: "2026-02-07T10:00:00Z",
    },
  ],
};
