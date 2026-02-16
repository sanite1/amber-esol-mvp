// ─── Types ───────────────────────────────────────────────────────────────────

export interface TutorUpcomingLesson {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentLevel: string;
  lessonType: "trial" | "regular";
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending";
  meetingUrl?: string;
  notes?: string;
}

export interface PendingBooking {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentLevel: string;
  hoursRequested: number;
  totalAmount: number;
  requestedDate: string;
  lessonType: "trial" | "regular";
  message?: string;
}

export interface TutorEarnings {
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  totalEarnings: number;
  pendingPayout: number;
  nextPayoutDate: string;
  completedLessonsThisMonth: number;
}

export interface TutorPerformance {
  rating: number;
  totalReviews: number;
  responseRate: number;
  completionRate: number;
  totalStudents: number;
  activeStudents: number;
  totalLessonsCompleted: number;
  totalHoursTaught: number;
}

export interface RecentStudentMessage {
  id: string;
  studentName: string;
  studentAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface TutorAvailabilityStatus {
  isOnline: boolean;
  totalSlotsThisWeek: number;
  bookedSlotsThisWeek: number;
  nextAvailableSlot: string;
}

export interface TutorDashboardData {
  upcomingLessons: TutorUpcomingLesson[];
  pendingBookings: PendingBooking[];
  earnings: TutorEarnings;
  performance: TutorPerformance;
  recentMessages: RecentStudentMessage[];
  availability: TutorAvailabilityStatus;
  stats: {
    todayLessons: number;
    weekLessons: number;
    newStudents: number;
    unreadMessages: number;
  };
}

// ─── Dummy Data ──────────────────────────────────────────────────────────────

export const tutorDashboardData: TutorDashboardData = {
  stats: {
    todayLessons: 3,
    weekLessons: 14,
    newStudents: 2,
    unreadMessages: 5,
  },

  earnings: {
    thisMonthEarnings: 840,
    lastMonthEarnings: 1120,
    totalEarnings: 12460,
    pendingPayout: 340,
    nextPayoutDate: "2026-02-28T00:00:00Z",
    completedLessonsThisMonth: 56,
  },

  performance: {
    rating: 4.9,
    totalReviews: 142,
    responseRate: 98,
    completionRate: 99,
    totalStudents: 186,
    activeStudents: 24,
    totalLessonsCompleted: 1247,
    totalHoursTaught: 1180,
  },

  availability: {
    isOnline: true,
    totalSlotsThisWeek: 30,
    bookedSlotsThisWeek: 14,
    nextAvailableSlot: "2026-02-14T15:00:00Z",
  },

  upcomingLessons: [
    {
      id: "tl-001",
      studentName: "Alex Thompson",
      studentAvatar: "",
      studentLevel: "B2",
      lessonType: "regular",
      specialty: "Business English",
      date: "2026-02-14T00:00:00Z",
      startTime: "14:00",
      endTime: "15:00",
      status: "confirmed",
      meetingUrl: "https://meet.amber-esol.com/abc123",
      notes:
        "Focus on presentation skills — student has a work pitch next week",
    },
    {
      id: "tl-002",
      studentName: "Yuki Tanaka",
      studentAvatar: "",
      studentLevel: "B1",
      lessonType: "regular",
      specialty: "IELTS Preparation",
      date: "2026-02-14T00:00:00Z",
      startTime: "16:00",
      endTime: "17:00",
      status: "confirmed",
      meetingUrl: "https://meet.amber-esol.com/def456",
    },
    {
      id: "tl-003",
      studentName: "Marco Rossi",
      studentAvatar: "",
      studentLevel: "A2",
      lessonType: "trial",
      specialty: "General English",
      date: "2026-02-14T00:00:00Z",
      startTime: "18:00",
      endTime: "18:30",
      status: "confirmed",
    },
    {
      id: "tl-004",
      studentName: "Fatima Al-Rashid",
      studentAvatar: "",
      studentLevel: "C1",
      lessonType: "regular",
      specialty: "Academic Writing",
      date: "2026-02-15T00:00:00Z",
      startTime: "10:00",
      endTime: "11:00",
      status: "confirmed",
      meetingUrl: "https://meet.amber-esol.com/ghi789",
    },
    {
      id: "tl-005",
      studentName: "Chen Wei",
      studentAvatar: "",
      studentLevel: "B2",
      lessonType: "regular",
      specialty: "Conversation Practice",
      date: "2026-02-15T00:00:00Z",
      startTime: "14:00",
      endTime: "15:00",
      status: "pending",
    },
  ],

  pendingBookings: [
    {
      id: "pb-001",
      studentName: "Ana Silva",
      studentAvatar: "",
      studentLevel: "B1",
      hoursRequested: 8,
      totalAmount: 120,
      requestedDate: "2026-02-13T09:00:00Z",
      lessonType: "regular",
      message:
        "Hi Sarah, I'd like to book 8 hours for Business English. I work in marketing and need to improve my presentation skills.",
    },
    {
      id: "pb-002",
      studentName: "Pavel Novak",
      studentAvatar: "",
      studentLevel: "A2",
      hoursRequested: 0,
      totalAmount: 0,
      requestedDate: "2026-02-14T07:30:00Z",
      lessonType: "trial",
      message:
        "Hello! I'm preparing for my IELTS exam in April and would love a trial lesson.",
    },
  ],

  recentMessages: [
    {
      id: "tm-001",
      studentName: "Alex Thompson",
      studentAvatar: "",
      lastMessage:
        "Thanks for the lesson! I'll review the phrasal verbs worksheet before next time.",
      timestamp: "2026-02-14T09:30:00Z",
      unread: true,
    },
    {
      id: "tm-002",
      studentName: "Yuki Tanaka",
      studentAvatar: "",
      lastMessage: "Could you send me the writing practice test we discussed?",
      timestamp: "2026-02-13T18:20:00Z",
      unread: true,
    },
    {
      id: "tm-003",
      studentName: "Fatima Al-Rashid",
      studentAvatar: "",
      lastMessage:
        "I've submitted my essay draft. Looking forward to your feedback!",
      timestamp: "2026-02-13T15:45:00Z",
      unread: false,
    },
    {
      id: "tm-004",
      studentName: "Chen Wei",
      studentAvatar: "",
      lastMessage: "See you tomorrow at 2pm!",
      timestamp: "2026-02-13T11:00:00Z",
      unread: false,
    },
  ],
};
