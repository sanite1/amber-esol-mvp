export interface ReviewReply {
  id: string;
  text: string;
  date: string;
}

export interface TutorReview {
  id: string;
  studentName: string;
  studentAvatar?: string;
  studentCountry?: string; // ← now optional
  studentCountryCode?: string; // ← now optional
  rating: number;
  text: string;
  date: string;
  lessonType: "trial" | "regular";
  lessonTopic?: string;
  helpful: number;
  reported: boolean;
  reply?: ReviewReply;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  responseRate: number;
  recentTrend: "up" | "down" | "stable";
  recentTrendValue: number;
}

export interface TutorReviewsData {
  stats: ReviewStats;
  reviews: TutorReview[];
}

export const tutorReviewsData: TutorReviewsData = {
  stats: {
    averageRating: 4.9,
    totalReviews: 47,
    ratingBreakdown: {
      5: 38,
      4: 6,
      3: 2,
      2: 1,
      1: 0,
    },
    responseRate: 85,
    recentTrend: "up",
    recentTrendValue: 0.2,
  },
  reviews: [
    {
      id: "rev-001",
      studentName: "Amara Okonkwo",
      studentCountry: "Nigeria",
      studentCountryCode: "NG",
      rating: 5,
      text: "James is an incredible tutor! He made my IELTS preparation so much easier. His lessons are well-structured and he always provides detailed feedback. I improved my speaking score from 6.0 to 7.5 in just two months. Highly recommend!",
      date: "2026-02-13",
      lessonType: "regular",
      lessonTopic: "IELTS Speaking",
      helpful: 12,
      reported: false,
      reply: {
        id: "rpl-001",
        text: "Thank you so much, Amara! It's been wonderful watching your progress. Your dedication to practice between lessons really made the difference. Keep up the great work!",
        date: "2026-02-13",
      },
    },
    {
      id: "rev-002",
      studentName: "Kenji Tanaka",
      studentCountry: "Japan",
      studentCountryCode: "JP",
      rating: 5,
      text: "Very patient and knowledgeable teacher. He explains grammar concepts clearly and always uses practical examples. I feel much more confident in business meetings now.",
      date: "2026-02-11",
      lessonType: "regular",
      lessonTopic: "Business English",
      helpful: 8,
      reported: false,
    },
    {
      id: "rev-003",
      studentName: "Sofia Reyes",
      studentCountry: "Colombia",
      studentCountryCode: "CO",
      rating: 5,
      text: "Had a wonderful trial lesson! James was very friendly and made me feel comfortable right away. He quickly assessed my level and gave me a clear plan for improvement. Looking forward to continuing!",
      date: "2026-02-10",
      lessonType: "trial",
      helpful: 5,
      reported: false,
    },
    {
      id: "rev-004",
      studentName: "Lucas Müller",
      studentCountry: "Germany",
      studentCountryCode: "DE",
      rating: 4,
      text: "Good tutor overall. Lessons are well prepared and James is very professional. Sometimes I feel like we spend too much time on grammar and not enough on conversation, but when I mentioned it he adjusted quickly.",
      date: "2026-02-08",
      lessonType: "regular",
      lessonTopic: "Conversational English",
      helpful: 3,
      reported: false,
      reply: {
        id: "rpl-004",
        text: "Thanks for the honest feedback, Lucas! I appreciate you letting me know about the balance. I've adjusted our upcoming lessons to include more free conversation time. See you Thursday!",
        date: "2026-02-08",
      },
    },
    {
      id: "rev-005",
      studentName: "Fatima Al-Hassan",
      studentCountry: "Saudi Arabia",
      studentCountryCode: "SA",
      rating: 5,
      text: "James is the best English tutor I've ever had. He is very respectful and understanding of cultural differences. His teaching style is perfect for beginners, he never makes you feel embarrassed about mistakes.",
      date: "2026-02-04",
      lessonType: "regular",
      lessonTopic: "General English",
      helpful: 15,
      reported: false,
    },
    {
      id: "rev-006",
      studentName: "Pierre Dubois",
      studentCountry: "France",
      studentCountryCode: "FR",
      rating: 5,
      text: "Excellent preparation for my job interview. James did mock interviews with me, corrected my pronunciation, and taught me useful phrases. I got the job! Merci James!",
      date: "2026-01-29",
      lessonType: "regular",
      lessonTopic: "Job Interview Prep",
      helpful: 20,
      reported: false,
      reply: {
        id: "rpl-006",
        text: "Congratulations on the job, Pierre! You put in the work and it paid off. So happy for you! 🎉",
        date: "2026-01-29",
      },
    },
    {
      id: "rev-007",
      studentName: "Maria Santos",
      studentCountry: "Brazil",
      studentCountryCode: "BR",
      rating: 3,
      text: "Lessons were okay. James is nice but I felt the pace was a bit slow for my level. The materials were good though and I did learn useful vocabulary.",
      date: "2026-01-20",
      lessonType: "regular",
      lessonTopic: "Vocabulary Building",
      helpful: 1,
      reported: false,
    },
    {
      id: "rev-008",
      studentName: "Yuki Sato",
      studentCountry: "Japan",
      studentCountryCode: "JP",
      rating: 5,
      text: "Great trial lesson! James was very encouraging and I felt comfortable speaking English even though my level is very low. He gave me simple homework to practice before our next lesson.",
      date: "2026-01-15",
      lessonType: "trial",
      helpful: 4,
      reported: false,
    },
    {
      id: "rev-009",
      studentName: "Ahmed Hassan",
      studentCountry: "Egypt",
      studentCountryCode: "EG",
      rating: 5,
      text: "James helped me prepare for my Cambridge B2 exam. His knowledge of the exam format is excellent. Very organized lessons with clear targets each week.",
      date: "2026-01-10",
      lessonType: "regular",
      lessonTopic: "Cambridge B2 Prep",
      helpful: 7,
      reported: false,
    },
    {
      id: "rev-010",
      studentName: "Elena Petrova",
      studentCountry: "Russia",
      studentCountryCode: "RU",
      rating: 4,
      text: "Very professional tutor. Good at explaining complex grammar. I would prefer more homework between lessons, but overall a great experience.",
      date: "2026-01-05",
      lessonType: "regular",
      lessonTopic: "Grammar",
      helpful: 2,
      reported: false,
    },
    {
      id: "rev-011",
      studentName: "Carlos Mendez",
      studentCountry: "Mexico",
      studentCountryCode: "MX",
      rating: 2,
      text: "The tutor was late twice and didn't seem very prepared for our lessons. The content was fine but the experience was disappointing.",
      date: "2025-12-18",
      lessonType: "regular",
      helpful: 0,
      reported: false,
    },
    {
      id: "rev-012",
      studentName: "Anna Kowalski",
      studentCountry: "Poland",
      studentCountryCode: "PL",
      rating: 5,
      text: "Fantastic teacher! I've been learning with James for 4 months now and my English has improved dramatically. He always finds interesting topics for our conversations.",
      date: "2025-12-10",
      lessonType: "regular",
      lessonTopic: "Conversational English",
      helpful: 11,
      reported: false,
    },
  ],
};
