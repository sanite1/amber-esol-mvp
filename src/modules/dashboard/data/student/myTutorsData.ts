// ── Types ──

export interface MyTutor {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  headline: string;
  specialty: string;
  languages: string[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  trialRate: number;
  responseTime: string;
  timezone: string;
  totalLessonsWithMe: number;
  completedLessons: number;
  nextLesson: {
    date: string;
    startTime: string;
    endTime: string;
    status: "confirmed" | "pending";
  } | null;
  lastLessonDate: string | null;
  hasUnreadMessage: boolean;
  myReview: {
    rating: number;
    comment: string;
    date: string;
  } | null;
  isFavourite: boolean;
  badges: string[];
}

export type TutorFilter = "all" | "active" | "past" | "favourites";
export type TutorSort = "recent" | "name" | "lessons" | "rating";

// ── Dummy Data ──

export const myTutors: MyTutor[] = [
  {
    id: "t-001",
    slug: "sarah-mitchell",
    name: "Sarah Mitchell",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    headline: "Business English specialist with 10+ years of experience",
    specialty: "Business English",
    languages: ["English (Native)", "French (B2)"],
    rating: 4.9,
    totalReviews: 156,
    hourlyRate: 32,
    trialRate: 0,
    responseTime: "< 1 hour",
    timezone: "GMT+0 (London)",
    totalLessonsWithMe: 14,
    completedLessons: 13,
    nextLesson: {
      date: "2026-02-15T00:00:00Z",
      startTime: "14:00",
      endTime: "15:00",
      status: "confirmed",
    },
    lastLessonDate: "2026-02-12T00:00:00Z",
    hasUnreadMessage: true,
    myReview: {
      rating: 5,
      comment:
        "Sarah is an excellent tutor. She really helped me improve my business presentation skills and email writing.",
      date: "2026-02-10T00:00:00Z",
    },
    isFavourite: true,
    badges: ["Top Rated", "Quick Responder"],
  },
  {
    id: "t-002",
    slug: "james-okonkwo",
    name: "James Okonkwo",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    headline: "IELTS expert, 95% of students improve by 1+ band",
    specialty: "IELTS Preparation",
    languages: ["English (Native)", "Yoruba (Native)"],
    rating: 4.8,
    totalReviews: 203,
    hourlyRate: 28,
    trialRate: 0,
    responseTime: "< 24 hours",
    timezone: "GMT+1 (Lagos)",
    totalLessonsWithMe: 8,
    completedLessons: 8,
    nextLesson: {
      date: "2026-02-17T00:00:00Z",
      startTime: "10:00",
      endTime: "11:00",
      status: "confirmed",
    },
    lastLessonDate: "2026-02-11T00:00:00Z",
    hasUnreadMessage: false,
    myReview: {
      rating: 5,
      comment:
        "James helped me go from band 6 to 7.5. His strategies for the speaking section are incredibly effective.",
      date: "2026-01-28T00:00:00Z",
    },
    isFavourite: true,
    badges: ["IELTS Expert", "200+ Lessons"],
  },
  {
    id: "t-003",
    slug: "elena-popova",
    name: "Elena Popova",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    headline: "Conversational English for everyday confidence",
    specialty: "Conversational English",
    languages: ["English (C2)", "Russian (Native)", "German (B1)"],
    rating: 4.7,
    totalReviews: 89,
    hourlyRate: 22,
    trialRate: 0,
    responseTime: "< 30 min",
    timezone: "GMT+3 (Moscow)",
    totalLessonsWithMe: 1,
    completedLessons: 0,
    nextLesson: {
      date: "2026-02-19T00:00:00Z",
      startTime: "16:00",
      endTime: "17:00",
      status: "pending",
    },
    lastLessonDate: null,
    hasUnreadMessage: false,
    myReview: null,
    isFavourite: false,
    badges: ["Fast Responder"],
  },
  {
    id: "t-004",
    slug: "anna-kowalski",
    name: "Anna Kowalski",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    headline: "Academic English & essay writing for university students",
    specialty: "Academic English",
    languages: ["English (C2)", "Polish (Native)"],
    rating: 4.9,
    totalReviews: 87,
    hourlyRate: 28,
    trialRate: 0,
    responseTime: "< 1 hour",
    timezone: "GMT+1 (Warsaw)",
    totalLessonsWithMe: 6,
    completedLessons: 6,
    nextLesson: null,
    lastLessonDate: "2026-01-15T00:00:00Z",
    hasUnreadMessage: false,
    myReview: {
      rating: 4,
      comment:
        "Anna gave great feedback on my essays. Would recommend for academic writing preparation.",
      date: "2026-01-16T00:00:00Z",
    },
    isFavourite: false,
    badges: ["Academic Specialist"],
  },
  {
    id: "t-005",
    slug: "david-chen",
    name: "David Chen",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    headline: "Pronunciation coach, sound more natural and confident",
    specialty: "Pronunciation",
    languages: ["English (Native)", "Mandarin (Native)"],
    rating: 4.8,
    totalReviews: 64,
    hourlyRate: 24,
    trialRate: 0,
    responseTime: "< 3 hours",
    timezone: "GMT+8 (Singapore)",
    totalLessonsWithMe: 3,
    completedLessons: 3,
    nextLesson: null,
    lastLessonDate: "2025-12-20T00:00:00Z",
    hasUnreadMessage: false,
    myReview: null,
    isFavourite: false,
    badges: ["Pronunciation Expert"],
  },
];
