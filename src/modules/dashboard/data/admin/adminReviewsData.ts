// ─── Interfaces ─────────────────────────────────────────────────────

export interface ReviewReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterType: "student" | "tutor";
  reason: "inappropriate" | "fake" | "harassment" | "spam" | "other";
  description: string;
  createdAt: string;
  status: "pending" | "dismissed" | "action_taken";
}

export interface AdminReview {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  lessonId: string;
  lessonTopic: string;
  lessonDate: string;
  lessonType: "trial" | "standard";
  rating: number;
  comment: string;
  tutorReply?: string;
  tutorRepliedAt?: string;
  createdAt: string;
  status: "published" | "hidden" | "removed";
  reported: boolean;
  reports: ReviewReport[];
  helpfulCount: number;
}

export interface AdminReviewsStats {
  totalReviews: number;
  publishedReviews: number;
  hiddenReviews: number;
  removedReviews: number;
  averageRating: number;
  totalReports: number;
  pendingReports: number;
  dismissedReports: number;
  actionsTaken: number;
  reviewsThisMonth: number;
  reportsThisMonth: number;
}

export interface AdminReviewsData {
  stats: AdminReviewsStats;
  reviews: AdminReview[];
}

// ─── Sample Data ────────────────────────────────────────────────────

export const adminReviewsData: AdminReviewsData = {
  stats: {
    totalReviews: 482,
    publishedReviews: 461,
    hiddenReviews: 12,
    removedReviews: 9,
    averageRating: 4.8,
    totalReports: 18,
    pendingReports: 4,
    dismissedReports: 10,
    actionsTaken: 4,
    reviewsThisMonth: 38,
    reportsThisMonth: 3,
  },
  reviews: [
    {
      id: "review-001",
      studentId: "student-001",
      studentName: "Yuki Tanaka",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-001",
      lessonTopic: "Business English – Presentations",
      lessonDate: "2026-02-14",
      lessonType: "standard",
      rating: 5,
      comment:
        "Excellent lesson! James helped me prepare for my upcoming presentation at work. Very structured approach and great feedback on my pronunciation. I feel much more confident now.",
      tutorReply:
        "Thank you Yuki! You did great work during the lesson. Looking forward to our next session!",
      tutorRepliedAt: "2026-02-14T18:00:00Z",
      createdAt: "2026-02-14T16:30:00Z",
      status: "published",
      reported: false,
      reports: [],
      helpfulCount: 3,
    },
    {
      id: "review-002",
      studentId: "student-003",
      studentName: "Ahmed Al-Rashid",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      lessonId: "lesson-003",
      lessonTopic: "IELTS Writing Task 2",
      lessonDate: "2026-02-15",
      lessonType: "standard",
      rating: 5,
      comment:
        "Sophie is an amazing IELTS tutor. She helped me understand the task structure and gave detailed feedback on my essay. My writing has improved significantly since starting with her.",
      createdAt: "2026-02-15T17:00:00Z",
      status: "published",
      reported: false,
      reports: [],
      helpfulCount: 7,
    },
    {
      id: "review-003",
      studentId: "student-004",
      studentName: "Chen Wei",
      tutorId: "tutor-003",
      tutorName: "David Mitchell",
      lessonId: "lesson-014",
      lessonTopic: "Conversation Practice",
      lessonDate: "2026-02-10",
      lessonType: "standard",
      rating: 2,
      comment:
        "The tutor was unprepared and seemed distracted during the lesson. He kept checking his phone and didn't have any materials ready. Very disappointing experience for the price.",
      tutorReply:
        "I apologise for the experience Chen. I had an emergency that day. I'd like to make it up to you with an extra free session.",
      tutorRepliedAt: "2026-02-11T09:00:00Z",
      createdAt: "2026-02-10T15:00:00Z",
      status: "published",
      reported: true,
      reports: [
        {
          id: "report-001",
          reporterId: "tutor-003",
          reporterName: "David Mitchell",
          reporterType: "tutor",
          reason: "fake",
          description:
            "This review is misleading. I had a brief family emergency mid-lesson but resumed within 2 minutes. The student is exaggerating the situation.",
          createdAt: "2026-02-11T10:00:00Z",
          status: "pending",
        },
      ],
      helpfulCount: 1,
    },
    {
      id: "review-004",
      studentId: "student-005",
      studentName: "Anna Kowalski",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      lessonId: "lesson-005",
      lessonTopic: "Grammar – Conditionals",
      lessonDate: "2026-02-14",
      lessonType: "standard",
      rating: 4,
      comment:
        "Good lesson overall. Sophie explained conditionals clearly. I would have liked more practice exercises though. Will book again.",
      createdAt: "2026-02-14T18:30:00Z",
      status: "published",
      reported: false,
      reports: [],
      helpfulCount: 2,
    },
    {
      id: "review-005",
      studentId: "student-006",
      studentName: "Lucas Müller",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      lessonId: "lesson-015",
      lessonTopic: "Phrasal Verbs",
      lessonDate: "2026-02-12",
      lessonType: "standard",
      rating: 1,
      comment:
        "TERRIBLE. This so-called tutor cant even speak proper english herself LOL. Dont waste ur money!!!!! I want refund NOW.",
      createdAt: "2026-02-12T14:00:00Z",
      status: "published",
      reported: true,
      reports: [
        {
          id: "report-002",
          reporterId: "tutor-004",
          reporterName: "Emily Watson",
          reporterType: "tutor",
          reason: "harassment",
          description:
            "This review contains personal attacks and is not a fair assessment of the lesson. The student was uncooperative throughout and refused to participate in exercises.",
          createdAt: "2026-02-12T16:00:00Z",
          status: "pending",
        },
        {
          id: "report-003",
          reporterId: "student-009",
          reporterName: "Tomasz Nowak",
          reporterType: "student",
          reason: "inappropriate",
          description:
            "This review is rude and unhelpful. Emily is a great tutor and this doesn't reflect reality.",
          createdAt: "2026-02-13T09:00:00Z",
          status: "pending",
        },
      ],
      helpfulCount: 0,
    },
    {
      id: "review-006",
      studentId: "student-007",
      studentName: "Fatima Hassan",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-007",
      lessonTopic: "Academic Writing",
      lessonDate: "2026-02-14",
      lessonType: "standard",
      rating: 4,
      comment:
        "James is a patient and knowledgeable tutor. He helped me improve my academic writing skills. The only downside is that the lesson felt a bit rushed towards the end.",
      createdAt: "2026-02-14T15:00:00Z",
      status: "published",
      reported: false,
      reports: [],
      helpfulCount: 4,
    },
    {
      id: "review-007",
      studentId: "student-002",
      studentName: "Maria García",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-016",
      lessonTopic: "Level Assessment",
      lessonDate: "2026-02-13",
      lessonType: "trial",
      rating: 5,
      comment:
        "Great trial lesson! James was friendly and professional. He assessed my level accurately and suggested a clear learning plan. Definitely booking more lessons.",
      createdAt: "2026-02-13T11:00:00Z",
      status: "published",
      reported: false,
      reports: [],
      helpfulCount: 5,
    },
    {
      id: "review-008",
      studentId: "student-010",
      studentName: "Sofia Rossi",
      tutorId: "tutor-002",
      tutorName: "Sophie Laurent",
      lessonId: "lesson-017",
      lessonTopic: "Reading Comprehension",
      lessonDate: "2026-02-11",
      lessonType: "standard",
      rating: 3,
      comment:
        "Buy my crypto course at www.scam-link.com! Use code SOFIA50 for discount! Also the lesson was okay I guess.",
      createdAt: "2026-02-11T17:00:00Z",
      status: "hidden",
      reported: true,
      reports: [
        {
          id: "report-004",
          reporterId: "tutor-002",
          reporterName: "Sophie Laurent",
          reporterType: "tutor",
          reason: "spam",
          description: "This review contains spam and promotional links.",
          createdAt: "2026-02-11T18:00:00Z",
          status: "action_taken",
        },
      ],
      helpfulCount: 0,
    },
    {
      id: "review-009",
      studentId: "student-009",
      studentName: "Tomasz Nowak",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      lessonId: "lesson-010",
      lessonTopic: "Job Interview Prep",
      lessonDate: "2026-02-12",
      lessonType: "standard",
      rating: 5,
      comment:
        "Emily helped me prepare for my job interview at a British company. We practised common questions, polite phrasing, and she gave me great tips on body language over video calls. I got the job!",
      tutorReply: "Congratulations Tomasz! So proud of you! 🎉",
      tutorRepliedAt: "2026-02-13T08:00:00Z",
      createdAt: "2026-02-12T16:00:00Z",
      status: "published",
      reported: false,
      reports: [],
      helpfulCount: 12,
    },
    {
      id: "review-010",
      studentId: "student-008",
      studentName: "Priya Sharma",
      tutorId: "tutor-003",
      tutorName: "David Mitchell",
      lessonId: "lesson-018",
      lessonTopic: "Travel English",
      lessonDate: "2026-02-09",
      lessonType: "standard",
      rating: 3,
      comment:
        "Average lesson. The content was okay but David seemed tired and kept yawning. For the price, I expected more energy and better materials.",
      createdAt: "2026-02-09T14:00:00Z",
      status: "published",
      reported: false,
      reports: [],
      helpfulCount: 1,
    },
    {
      id: "review-011",
      studentId: "student-001",
      studentName: "Yuki Tanaka",
      tutorId: "tutor-004",
      tutorName: "Emily Watson",
      lessonId: "lesson-019",
      lessonTopic: "Listening Practice",
      lessonDate: "2026-02-08",
      lessonType: "standard",
      rating: 5,
      comment:
        "Emily uses really creative methods for listening practice. We listened to podcast clips and discussed them. Much better than textbook exercises!",
      createdAt: "2026-02-08T15:30:00Z",
      status: "published",
      reported: false,
      reports: [],
      helpfulCount: 6,
    },
    {
      id: "review-012",
      studentId: "student-003",
      studentName: "Ahmed Al-Rashid",
      tutorId: "tutor-001",
      tutorName: "James Hartwell",
      lessonId: "lesson-020",
      lessonTopic: "Formal Letter Writing",
      lessonDate: "2026-02-07",
      lessonType: "standard",
      rating: 1,
      comment: "Worst tutor ever. Completely useless. Rip off.",
      createdAt: "2026-02-07T18:00:00Z",
      status: "removed",
      reported: true,
      reports: [
        {
          id: "report-005",
          reporterId: "tutor-001",
          reporterName: "James Hartwell",
          reporterType: "tutor",
          reason: "fake",
          description:
            "This student did not attend this lesson. It was a no-show. The review is fraudulent.",
          createdAt: "2026-02-07T19:00:00Z",
          status: "action_taken",
        },
      ],
      helpfulCount: 0,
    },
  ],
};
