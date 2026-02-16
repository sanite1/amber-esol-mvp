// ─── Types ───────────────────────────────────────────────────────────────────

export type TutorLessonStatus =
  | "upcoming"
  | "completed"
  | "cancelled"
  | "no_show";
export type TutorLessonType = "trial" | "regular";

export interface TutorLesson {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentLevel: string;
  studentCountry: string;
  lessonType: TutorLessonType;
  status: TutorLessonStatus;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  notes?: string;
  earnings: number;
  feedback?: {
    rating: number;
    comment: string;
  };
  cancelledBy?: "student" | "tutor";
  cancellationReason?: string;
  materials?: string[];
}

export interface TutorLessonStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  noShows: number;
  hoursThisMonth: number;
  earningsThisMonth: number;
}

// ─── Dummy Data ──────────────────────────────────────────────────────────────

export const tutorLessonStats: TutorLessonStats = {
  total: 1247,
  upcoming: 14,
  completed: 1210,
  cancelled: 18,
  noShows: 5,
  hoursThisMonth: 42,
  earningsThisMonth: 630,
};

export const tutorLessons: TutorLesson[] = [
  {
    id: "tls-001",
    studentName: "Alex Thompson",
    studentAvatar: "",
    studentLevel: "B2",
    studentCountry: "United Kingdom",
    lessonType: "regular",
    status: "upcoming",
    specialty: "Business English",
    date: "2026-02-15T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    meetingUrl: "https://meet.amber-esol.com/abc123",
    notes: "Focus on presentation skills — student has a work pitch next week",
    earnings: 15,
    materials: ["Business_Vocab_Unit4.pdf"],
  },
  {
    id: "tls-002",
    studentName: "Yuki Tanaka",
    studentAvatar: "",
    studentLevel: "B1",
    studentCountry: "Japan",
    lessonType: "regular",
    status: "upcoming",
    specialty: "IELTS Preparation",
    date: "2026-02-15T00:00:00Z",
    startTime: "16:00",
    endTime: "17:00",
    meetingUrl: "https://meet.amber-esol.com/def456",
    earnings: 15,
    materials: ["IELTS_Writing_Task2.pdf", "Practice_Test_3.pdf"],
  },
  {
    id: "tls-003",
    studentName: "Marco Rossi",
    studentAvatar: "",
    studentLevel: "A2",
    studentCountry: "Italy",
    lessonType: "trial",
    status: "upcoming",
    specialty: "General English",
    date: "2026-02-15T00:00:00Z",
    startTime: "18:00",
    endTime: "18:30",
    earnings: 0,
  },
  {
    id: "tls-004",
    studentName: "Fatima Al-Rashid",
    studentAvatar: "",
    studentLevel: "C1",
    studentCountry: "Saudi Arabia",
    lessonType: "regular",
    status: "upcoming",
    specialty: "Academic Writing",
    date: "2026-02-16T00:00:00Z",
    startTime: "10:00",
    endTime: "11:00",
    meetingUrl: "https://meet.amber-esol.com/ghi789",
    earnings: 15,
  },
  {
    id: "tls-005",
    studentName: "Chen Wei",
    studentAvatar: "",
    studentLevel: "B2",
    studentCountry: "China",
    lessonType: "regular",
    status: "upcoming",
    specialty: "Conversation Practice",
    date: "2026-02-17T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    earnings: 15,
  },
  {
    id: "tls-006",
    studentName: "Alex Thompson",
    studentAvatar: "",
    studentLevel: "B2",
    studentCountry: "United Kingdom",
    lessonType: "regular",
    status: "completed",
    specialty: "Business English",
    date: "2026-02-13T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    earnings: 15,
    feedback: {
      rating: 5,
      comment: "Great lesson! Really helped with my presentation structure.",
    },
    materials: ["Meeting_Vocab.pdf"],
  },
  {
    id: "tls-007",
    studentName: "Yuki Tanaka",
    studentAvatar: "",
    studentLevel: "B1",
    studentCountry: "Japan",
    lessonType: "regular",
    status: "completed",
    specialty: "IELTS Preparation",
    date: "2026-02-12T00:00:00Z",
    startTime: "16:00",
    endTime: "17:00",
    earnings: 15,
    feedback: {
      rating: 5,
      comment: "Very well structured IELTS practice session.",
    },
  },
  {
    id: "tls-008",
    studentName: "Ana Silva",
    studentAvatar: "",
    studentLevel: "B1",
    studentCountry: "Brazil",
    lessonType: "trial",
    status: "completed",
    specialty: "Business English",
    date: "2026-02-11T00:00:00Z",
    startTime: "10:00",
    endTime: "10:30",
    earnings: 0,
  },
  {
    id: "tls-009",
    studentName: "Pavel Novak",
    studentAvatar: "",
    studentLevel: "A2",
    studentCountry: "Czech Republic",
    lessonType: "regular",
    status: "cancelled",
    specialty: "General English",
    date: "2026-02-10T00:00:00Z",
    startTime: "11:00",
    endTime: "12:00",
    earnings: 0,
    cancelledBy: "student",
    cancellationReason: "Schedule conflict — student requested reschedule",
  },
  {
    id: "tls-010",
    studentName: "Fatima Al-Rashid",
    studentAvatar: "",
    studentLevel: "C1",
    studentCountry: "Saudi Arabia",
    lessonType: "regular",
    status: "completed",
    specialty: "Academic Writing",
    date: "2026-02-09T00:00:00Z",
    startTime: "10:00",
    endTime: "11:00",
    earnings: 15,
    feedback: {
      rating: 4,
      comment: "Good session, would like more focus on citations next time.",
    },
  },
  {
    id: "tls-011",
    studentName: "Chen Wei",
    studentAvatar: "",
    studentLevel: "B2",
    studentCountry: "China",
    lessonType: "regular",
    status: "no_show",
    specialty: "Conversation Practice",
    date: "2026-02-08T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    earnings: 15,
  },
  {
    id: "tls-012",
    studentName: "Maria Garcia",
    studentAvatar: "",
    studentLevel: "B1",
    studentCountry: "Spain",
    lessonType: "regular",
    status: "completed",
    specialty: "General English",
    date: "2026-02-07T00:00:00Z",
    startTime: "09:00",
    endTime: "10:00",
    earnings: 15,
    feedback: {
      rating: 5,
      comment: "Always enjoy lessons with Sarah. Very professional.",
    },
  },
  {
    id: "tls-013",
    studentName: "Alex Thompson",
    studentAvatar: "",
    studentLevel: "B2",
    studentCountry: "United Kingdom",
    lessonType: "regular",
    status: "completed",
    specialty: "Business English",
    date: "2026-02-06T00:00:00Z",
    startTime: "14:00",
    endTime: "15:00",
    earnings: 15,
  },
  {
    id: "tls-014",
    studentName: "Yuki Tanaka",
    studentAvatar: "",
    studentLevel: "B1",
    studentCountry: "Japan",
    lessonType: "regular",
    status: "cancelled",
    specialty: "IELTS Preparation",
    date: "2026-02-05T00:00:00Z",
    startTime: "16:00",
    endTime: "17:00",
    earnings: 0,
    cancelledBy: "tutor",
    cancellationReason: "Tutor illness",
  },
];
