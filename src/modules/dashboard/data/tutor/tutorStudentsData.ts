export interface StudentLesson {
  id: string;
  date: string;
  type: "trial" | "regular";
  status: "completed" | "upcoming" | "cancelled" | "no_show";
  duration: number; // minutes
  topic?: string;
}

export interface TutorStudent {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  country: string;
  countryCode: string;
  level: string;
  languages: string[];
  joinedDate: string;
  lastLessonDate: string;
  nextLessonDate?: string;
  totalLessons: number;
  completedLessons: number;
  cancelledLessons: number;
  noShows: number;
  totalHours: number;
  totalSpent: number;
  averageRating?: number;
  status: "active" | "inactive" | "trial";
  notes?: string;
  recentLessons: StudentLesson[];
  goals?: string[];
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

export interface TutorStudentsData {
  stats: TutorStudentsStats;
  students: TutorStudent[];
}

const recentLessonsPool: StudentLesson[][] = [
  [
    {
      id: "sl-1a",
      date: "2026-02-14T10:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Business English – Presentations",
    },
    {
      id: "sl-1b",
      date: "2026-02-12T10:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Email Writing",
    },
    {
      id: "sl-1c",
      date: "2026-02-10T10:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Phone Conversations",
    },
    {
      id: "sl-1d",
      date: "2026-02-19T10:00:00Z",
      type: "regular",
      status: "upcoming",
      duration: 60,
      topic: "Negotiations Vocabulary",
    },
  ],
  [
    {
      id: "sl-2a",
      date: "2026-02-13T14:00:00Z",
      type: "regular",
      status: "completed",
      duration: 45,
      topic: "IELTS Speaking Part 2",
    },
    {
      id: "sl-2b",
      date: "2026-02-11T14:00:00Z",
      type: "regular",
      status: "cancelled",
      duration: 45,
    },
    {
      id: "sl-2c",
      date: "2026-02-09T14:00:00Z",
      type: "regular",
      status: "completed",
      duration: 45,
      topic: "IELTS Writing Task 1",
    },
    {
      id: "sl-2d",
      date: "2026-02-18T14:00:00Z",
      type: "regular",
      status: "upcoming",
      duration: 45,
      topic: "IELTS Listening Practice",
    },
  ],
  [
    {
      id: "sl-3a",
      date: "2026-02-14T16:00:00Z",
      type: "trial",
      status: "completed",
      duration: 30,
      topic: "Introduction & Level Assessment",
    },
  ],
  [
    {
      id: "sl-4a",
      date: "2026-02-13T09:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Conversational English",
    },
    {
      id: "sl-4b",
      date: "2026-02-06T09:00:00Z",
      type: "regular",
      status: "no_show",
      duration: 60,
    },
    {
      id: "sl-4c",
      date: "2026-02-20T09:00:00Z",
      type: "regular",
      status: "upcoming",
      duration: 60,
      topic: "Travel English",
    },
  ],
  [
    {
      id: "sl-5a",
      date: "2026-01-28T11:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Grammar Review",
    },
    {
      id: "sl-5b",
      date: "2026-01-21T11:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Vocabulary Building",
    },
  ],
  [
    {
      id: "sl-6a",
      date: "2026-02-12T15:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Pronunciation Practice",
    },
    {
      id: "sl-6b",
      date: "2026-02-14T15:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Phrasal Verbs",
    },
    {
      id: "sl-6c",
      date: "2026-02-17T15:00:00Z",
      type: "regular",
      status: "upcoming",
      duration: 60,
      topic: "Idioms & Expressions",
    },
  ],
  [
    {
      id: "sl-7a",
      date: "2026-02-10T13:00:00Z",
      type: "trial",
      status: "completed",
      duration: 30,
      topic: "Trial – Level Check",
    },
  ],
  [
    {
      id: "sl-8a",
      date: "2025-12-15T10:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Past Tenses Review",
    },
    {
      id: "sl-8b",
      date: "2025-12-08T10:00:00Z",
      type: "regular",
      status: "completed",
      duration: 60,
      topic: "Conditionals",
    },
  ],
];

export const tutorStudentsData: TutorStudentsData = {
  stats: {
    totalStudents: 24,
    activeStudents: 16,
    trialStudents: 3,
    inactiveStudents: 5,
    avgLessonsPerStudent: 12.4,
    totalRevenue: 4280,
    retentionRate: 82,
  },
  students: [
    {
      id: "stu-001",
      name: "Amara Okonkwo",
      email: "amara.o@email.com",
      country: "Nigeria",
      countryCode: "NG",
      level: "B2",
      languages: ["English", "Yoruba"],
      joinedDate: "2025-09-15",
      lastLessonDate: "2026-02-14",
      nextLessonDate: "2026-02-19",
      totalLessons: 38,
      completedLessons: 36,
      cancelledLessons: 1,
      noShows: 1,
      totalHours: 38,
      totalSpent: 570,
      averageRating: 4.9,
      status: "active",
      notes: "Preparing for job interviews. Prefers business English focus.",
      recentLessons: recentLessonsPool[0],
      goals: ["Pass B2 Cambridge exam", "Improve presentation skills"],
    },
    {
      id: "stu-002",
      name: "Kenji Tanaka",
      email: "kenji.t@email.com",
      country: "Japan",
      countryCode: "JP",
      level: "B1",
      languages: ["Japanese", "English"],
      joinedDate: "2025-11-02",
      lastLessonDate: "2026-02-13",
      nextLessonDate: "2026-02-18",
      totalLessons: 22,
      completedLessons: 20,
      cancelledLessons: 2,
      noShows: 0,
      totalHours: 16.5,
      totalSpent: 330,
      averageRating: 5.0,
      status: "active",
      notes: "IELTS preparation – target band 7.",
      recentLessons: recentLessonsPool[1],
      goals: ["IELTS Band 7", "Academic writing fluency"],
    },
    {
      id: "stu-003",
      name: "Sofia Reyes",
      avatar: "",
      email: "sofia.r@email.com",
      country: "Colombia",
      countryCode: "CO",
      level: "A2",
      languages: ["Spanish", "English"],
      joinedDate: "2026-02-12",
      lastLessonDate: "2026-02-14",
      totalLessons: 1,
      completedLessons: 1,
      cancelledLessons: 0,
      noShows: 0,
      totalHours: 0.5,
      totalSpent: 0,
      status: "trial",
      recentLessons: recentLessonsPool[2],
      goals: ["Basic conversational English"],
    },
    {
      id: "stu-004",
      name: "Lucas Müller",
      email: "lucas.m@email.com",
      country: "Germany",
      countryCode: "DE",
      level: "C1",
      languages: ["German", "English", "French"],
      joinedDate: "2025-08-20",
      lastLessonDate: "2026-02-13",
      nextLessonDate: "2026-02-20",
      totalLessons: 42,
      completedLessons: 39,
      cancelledLessons: 2,
      noShows: 1,
      totalHours: 42,
      totalSpent: 630,
      averageRating: 4.7,
      status: "active",
      notes: "Advanced conversational. Likes topic-based discussions.",
      recentLessons: recentLessonsPool[3],
      goals: ["C2 proficiency", "Reduce German accent"],
    },
    {
      id: "stu-005",
      name: "Fatima Al-Hassan",
      email: "fatima.h@email.com",
      country: "Saudi Arabia",
      countryCode: "SA",
      level: "A2",
      languages: ["Arabic", "English"],
      joinedDate: "2025-10-10",
      lastLessonDate: "2026-01-28",
      totalLessons: 14,
      completedLessons: 14,
      cancelledLessons: 0,
      noShows: 0,
      totalHours: 14,
      totalSpent: 210,
      averageRating: 4.8,
      status: "inactive",
      notes: "On break. Said she'll return in March.",
      recentLessons: recentLessonsPool[4],
      goals: ["Travel English", "Daily conversations"],
    },
    {
      id: "stu-006",
      name: "Pierre Dubois",
      email: "pierre.d@email.com",
      country: "France",
      countryCode: "FR",
      level: "B2",
      languages: ["French", "English"],
      joinedDate: "2025-12-01",
      lastLessonDate: "2026-02-14",
      nextLessonDate: "2026-02-17",
      totalLessons: 18,
      completedLessons: 17,
      cancelledLessons: 1,
      noShows: 0,
      totalHours: 18,
      totalSpent: 270,
      averageRating: 4.9,
      status: "active",
      recentLessons: recentLessonsPool[5],
      goals: ["Fluency for work meetings"],
    },
    {
      id: "stu-007",
      name: "Yuki Sato",
      email: "yuki.s@email.com",
      country: "Japan",
      countryCode: "JP",
      level: "A1",
      languages: ["Japanese"],
      joinedDate: "2026-02-08",
      lastLessonDate: "2026-02-10",
      totalLessons: 1,
      completedLessons: 1,
      cancelledLessons: 0,
      noShows: 0,
      totalHours: 0.5,
      totalSpent: 0,
      status: "trial",
      recentLessons: recentLessonsPool[6],
    },
    {
      id: "stu-008",
      name: "Maria Santos",
      email: "maria.s@email.com",
      country: "Brazil",
      countryCode: "BR",
      level: "B1",
      languages: ["Portuguese", "English"],
      joinedDate: "2025-07-14",
      lastLessonDate: "2025-12-15",
      totalLessons: 20,
      completedLessons: 19,
      cancelledLessons: 1,
      noShows: 0,
      totalHours: 20,
      totalSpent: 300,
      averageRating: 4.6,
      status: "inactive",
      notes: "Hasn't booked since December.",
      recentLessons: recentLessonsPool[7],
    },
  ],
};
