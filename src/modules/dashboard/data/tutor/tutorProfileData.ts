export interface TutorQualification {
  id: string;
  title: string;
  institution: string;
  year: number;
}

export interface TutorLanguage {
  language: string;
  level: "Native" | "Fluent" | "Advanced" | "Intermediate";
}

export interface TutorProfileStats {
  totalLessons: number;
  totalStudents: number;
  totalHours: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  responseRate: number;
  responseTime: string;
}

export interface TutorProfileData {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  city: string;
  timezone: string;
  bio: string;
  shortBio: string;
  teachingStyle: string;
  hourlyRate: number;
  trialRate: number;
  currency: string;
  joined: string;
  isVerified: boolean;
  isOnline: boolean;
  profileSlug: string;
  specialties: string[];
  cefrLevels: string[];
  ageGroups: string[];
  lessonTypes: string[];
  languages: TutorLanguage[];
  qualifications: TutorQualification[];
  stats: TutorProfileStats;
  videoIntroUrl?: string;
  socialLinks?: {
    linkedin?: string;
    website?: string;
  };
}

export const tutorProfileData: TutorProfileData = {
  id: "tutor-001",
  name: "James Hartwell",
  email: "james.hartwell@email.com",
  phone: "+44 7911 123456",
  country: "United Kingdom",
  countryCode: "GB",
  city: "Manchester",
  timezone: "Europe/London (GMT+0)",
  bio: "I'm a CELTA-qualified English teacher with over 8 years of experience teaching students from all over the world. I specialise in Business English, IELTS preparation, and conversational fluency. My lessons are structured yet flexible — I adapt to each student's needs and learning pace. I believe in creating a relaxed, supportive environment where students feel confident to make mistakes and learn from them. Outside of teaching, I enjoy hiking, reading, and exploring new coffee shops around Manchester.",
  shortBio:
    "CELTA-qualified tutor with 8+ years experience. Specialising in Business English & IELTS.",
  teachingStyle:
    "Communicative and student-centred. I use a mix of real-world materials, role-plays, and structured exercises. I focus on practical language skills that students can use immediately in their daily lives and work.",
  hourlyRate: 15,
  trialRate: 0,
  currency: "GBP",
  joined: "2024-03-10",
  isVerified: true,
  isOnline: true,
  profileSlug: "james-hartwell",
  specialties: [
    "Business English",
    "IELTS Preparation",
    "Conversational English",
    "Job Interview Prep",
    "Academic Writing",
    "Pronunciation",
  ],
  cefrLevels: ["A2", "B1", "B2", "C1", "C2"],
  ageGroups: ["Teens (13-17)", "Adults (18-60)", "Seniors (60+)"],
  lessonTypes: ["1-on-1", "Conversation Practice", "Exam Prep", "Business"],
  languages: [
    { language: "English", level: "Native" },
    { language: "Spanish", level: "Advanced" },
    { language: "French", level: "Intermediate" },
  ],
  qualifications: [
    {
      id: "q-1",
      title: "CELTA",
      institution: "Cambridge University",
      year: 2017,
    },
    {
      id: "q-2",
      title: "BA English Literature",
      institution: "University of Manchester",
      year: 2015,
    },
    {
      id: "q-3",
      title: "IELTS Examiner Training",
      institution: "British Council",
      year: 2019,
    },
    {
      id: "q-4",
      title: "DELTA Module 1",
      institution: "Cambridge University",
      year: 2021,
    },
  ],

  stats: {
    totalLessons: 1247,
    totalStudents: 89,
    totalHours: 1180,
    averageRating: 4.9,
    totalReviews: 142,
    completionRate: 99,
    responseRate: 98,
    responseTime: "< 1 hour",
  },
  videoIntroUrl: "https://youtube.com/watch?v=example",
  socialLinks: {
    linkedin: "https://linkedin.com/in/jameshartwell",
    website: "https://jameshartwell.com",
  },
};
