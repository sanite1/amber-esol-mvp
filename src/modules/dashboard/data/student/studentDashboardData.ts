// ─── Types ───────────────────────────────────────────────────────────────────

export interface UpcomingLesson {
  id: string;
  tutorName: string;
  tutorAvatar: string;
  tutorSpecialty: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "trial" | "regular";
  status: "confirmed" | "pending";
  meetingUrl?: string;
}

export interface RecentMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderRole: "tutor" | "student";
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface RecommendedTutor {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  nextAvailable: string;
}

export interface LearningProgress {
  currentLevel: string;
  targetLevel: string;
  lessonsCompleted: number;
  totalLessonsNeeded: number;
  streak: number;
  longestStreak: number;
  hoursLearned: number;
}

export interface SpendingSummary {
  totalSpent: number;
  thisMonthSpent: number;
  upcomingLessonsValue: number;
  totalHoursBooked: number;
}

export interface StudentDashboardData {
  upcomingLessons: UpcomingLesson[];
  recentMessages: RecentMessage[];
  spendingSummary: SpendingSummary;
  recommendedTutors: RecommendedTutor[];
  learningProgress: LearningProgress;
  stats: {
    totalLessons: number;
    completedLessons: number;
    cancelledLessons: number;
    activeTutors: number;
  };
}

// ─── Dummy Data ──────────────────────────────────────────────────────────────

export const studentDashboardData: StudentDashboardData = {
  stats: {
    totalLessons: 24,
    completedLessons: 21,
    cancelledLessons: 1,
    activeTutors: 2,
  },

  spendingSummary: {
    totalSpent: 473,
    thisMonthSpent: 168,
    upcomingLessonsValue: 260,
    totalHoursBooked: 33,
  },

  learningProgress: {
    currentLevel: "B1",
    targetLevel: "B2",
    lessonsCompleted: 21,
    totalLessonsNeeded: 40,
    streak: 4,
    longestStreak: 12,
    hoursLearned: 31.5,
  },

  upcomingLessons: [
    {
      id: "bk-001",
      tutorName: "Sarah Mitchell",
      tutorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      tutorSpecialty: "Business English",
      date: "2026-02-15T00:00:00Z",
      startTime: "14:00",
      endTime: "15:00",
      type: "regular",
      status: "confirmed",
      meetingUrl: "https://meet.amber-esol.com/abc123",
    },
    {
      id: "bk-002",
      tutorName: "James Okonkwo",
      tutorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      tutorSpecialty: "IELTS Preparation",
      date: "2026-02-17T00:00:00Z",
      startTime: "10:00",
      endTime: "11:00",
      type: "regular",
      status: "confirmed",
      meetingUrl: "https://meet.amber-esol.com/def456",
    },
    {
      id: "bk-003",
      tutorName: "Elena Popova",
      tutorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
      tutorSpecialty: "Conversational English",
      date: "2026-02-19T00:00:00Z",
      startTime: "16:00",
      endTime: "17:00",
      type: "trial",
      status: "pending",
    },
  ],

  recentMessages: [
    {
      id: "msg-001",
      senderName: "Sarah Mitchell",
      senderAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
      senderRole: "tutor",
      lastMessage:
        "Great progress today! Don't forget to review the phrasal verbs worksheet before our next session.",
      timestamp: "2026-02-14T09:30:00Z",
      unread: true,
    },
    {
      id: "msg-002",
      senderName: "James Okonkwo",
      senderAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      senderRole: "tutor",
      lastMessage:
        "I've uploaded the practice test to your materials. Let me know if you have questions.",
      timestamp: "2026-02-13T16:45:00Z",
      unread: false,
    },
    {
      id: "msg-003",
      senderName: "Elena Popova",
      senderAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
      senderRole: "tutor",
      lastMessage:
        "Looking forward to our trial lesson! I'll prepare some conversation topics.",
      timestamp: "2026-02-13T11:20:00Z",
      unread: false,
    },
  ],

  recommendedTutors: [
    {
      id: "t-004",
      slug: "anna-kowalski",
      name: "Anna Kowalski",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      specialty: "Academic English",
      rating: 4.9,
      totalReviews: 87,
      hourlyRate: 28,
      nextAvailable: "Tomorrow, 9:00 AM",
    },
    {
      id: "t-005",
      slug: "david-chen",
      name: "David Chen",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      specialty: "Pronunciation",
      rating: 4.8,
      totalReviews: 64,
      hourlyRate: 24,
      nextAvailable: "Today, 6:00 PM",
    },
    {
      id: "t-006",
      slug: "fatima-hassan",
      name: "Fatima Hassan",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      specialty: "Grammar & Writing",
      rating: 5.0,
      totalReviews: 42,
      hourlyRate: 30,
      nextAvailable: "Feb 16, 11:00 AM",
    },
  ],
};
