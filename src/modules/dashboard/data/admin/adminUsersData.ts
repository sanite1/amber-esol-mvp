export interface AdminStudent {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  country: string;
  countryCode: string;
  level: string;
  joinedDate: string;
  lastActive: string;
  status: "active" | "inactive" | "banned";
  totalLessons: number;
  completedLessons: number;
  totalSpent: number;
  activeTutor?: string;
  trialUsed: boolean;
}

export interface AdminTutor {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  city: string;
  joinedDate: string;
  lastActive: string;
  status: "active" | "inactive" | "pending_approval" | "rejected" | "banned";
  bio: string;
  specialties: string[];
  qualifications: { title: string; institution: string; year: number }[];
  languages: { language: string; level: string }[];
  cefrLevels: string[];
  hourlyRate: number;
  totalLessons: number;
  completedLessons: number;
  totalStudents: number;
  totalEarned: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
  responseRate: number;
  applicationNote?: string;
}

export interface AdminStudentsStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  newThisMonth: number;
}

export interface AdminTutorsStats {
  total: number;
  active: number;
  inactive: number;
  pendingApproval: number;
  rejected: number;
  banned: number;
  newThisMonth: number;
}

export const adminStudentsData: {
  stats: AdminStudentsStats;
  students: AdminStudent[];
} = {
  stats: { total: 342, active: 280, inactive: 58, banned: 4, newThisMonth: 23 },
  students: [
    {
      id: "stu-001",
      name: "Amara Okonkwo",
      email: "amara.o@email.com",
      country: "Nigeria",
      countryCode: "NG",
      level: "B2",
      joinedDate: "2025-09-15",
      lastActive: "2026-02-16",
      status: "active",
      totalLessons: 38,
      completedLessons: 36,
      totalSpent: 570,
      activeTutor: "James Hartwell",
      trialUsed: true,
    },
    {
      id: "stu-002",
      name: "Kenji Tanaka",
      email: "kenji.t@email.com",
      country: "Japan",
      countryCode: "JP",
      level: "B1",
      joinedDate: "2025-11-02",
      lastActive: "2026-02-15",
      status: "active",
      totalLessons: 22,
      completedLessons: 20,
      totalSpent: 330,
      activeTutor: "James Hartwell",
      trialUsed: true,
    },
    {
      id: "stu-003",
      name: "Sofia Reyes",
      email: "sofia.r@email.com",
      country: "Colombia",
      countryCode: "CO",
      level: "A2",
      joinedDate: "2026-02-12",
      lastActive: "2026-02-14",
      status: "active",
      totalLessons: 1,
      completedLessons: 1,
      totalSpent: 0,
      trialUsed: true,
    },
    {
      id: "stu-004",
      name: "Lucas Müller",
      email: "lucas.m@email.com",
      country: "Germany",
      countryCode: "DE",
      level: "C1",
      joinedDate: "2025-08-20",
      lastActive: "2026-02-13",
      status: "active",
      totalLessons: 42,
      completedLessons: 39,
      totalSpent: 630,
      activeTutor: "James Hartwell",
      trialUsed: true,
    },
    {
      id: "stu-005",
      name: "Fatima Al-Hassan",
      email: "fatima.h@email.com",
      country: "Saudi Arabia",
      countryCode: "SA",
      level: "A2",
      joinedDate: "2025-10-10",
      lastActive: "2026-01-28",
      status: "inactive",
      totalLessons: 14,
      completedLessons: 14,
      totalSpent: 210,
      trialUsed: true,
    },
    {
      id: "stu-006",
      name: "Pierre Dubois",
      email: "pierre.d@email.com",
      country: "France",
      countryCode: "FR",
      level: "B2",
      joinedDate: "2025-12-01",
      lastActive: "2026-02-14",
      status: "active",
      totalLessons: 18,
      completedLessons: 17,
      totalSpent: 270,
      activeTutor: "Emily Clarke",
      trialUsed: true,
    },
    {
      id: "stu-007",
      name: "Maria Santos",
      email: "maria.s@email.com",
      country: "Brazil",
      countryCode: "BR",
      level: "B1",
      joinedDate: "2025-07-14",
      lastActive: "2025-12-15",
      status: "inactive",
      totalLessons: 20,
      completedLessons: 19,
      totalSpent: 300,
      trialUsed: true,
    },
    {
      id: "stu-008",
      name: "Carlos Mendez",
      email: "carlos.m@email.com",
      country: "Mexico",
      countryCode: "MX",
      level: "A1",
      joinedDate: "2025-11-20",
      lastActive: "2026-01-05",
      status: "banned",
      totalLessons: 5,
      completedLessons: 3,
      totalSpent: 45,
      trialUsed: true,
    },
    {
      id: "stu-009",
      name: "Yuki Sato",
      email: "yuki.s@email.com",
      country: "Japan",
      countryCode: "JP",
      level: "A1",
      joinedDate: "2026-02-08",
      lastActive: "2026-02-10",
      status: "active",
      totalLessons: 1,
      completedLessons: 1,
      totalSpent: 0,
      trialUsed: true,
    },
    {
      id: "stu-010",
      name: "Isabella Martinez",
      email: "isabella.m@email.com",
      country: "Spain",
      countryCode: "ES",
      level: "B1",
      joinedDate: "2026-02-16",
      lastActive: "2026-02-16",
      status: "active",
      totalLessons: 0,
      completedLessons: 0,
      totalSpent: 0,
      trialUsed: false,
    },
  ],
};

export const adminTutorsData: {
  stats: AdminTutorsStats;
  tutors: AdminTutor[];
} = {
  stats: {
    total: 28,
    active: 22,
    inactive: 1,
    pendingApproval: 3,
    rejected: 1,
    banned: 1,
    newThisMonth: 4,
  },
  tutors: [
    {
      id: "tut-001",
      name: "James Hartwell",
      email: "james.h@email.com",
      phone: "+44 7911 123456",
      country: "United Kingdom",
      countryCode: "GB",
      city: "Manchester",
      joinedDate: "2024-03-10",
      lastActive: "2026-02-16",
      status: "active",
      bio: "CELTA-qualified English teacher with over 8 years of experience. Specialising in Business English & IELTS.",
      specialties: [
        "Business English",
        "IELTS Preparation",
        "Conversational English",
      ],
      qualifications: [
        { title: "CELTA", institution: "Cambridge University", year: 2017 },
        {
          title: "BA English Literature",
          institution: "University of Manchester",
          year: 2015,
        },
      ],
      languages: [
        { language: "English", level: "Native" },
        { language: "Spanish", level: "Advanced" },
      ],
      cefrLevels: ["A2", "B1", "B2", "C1", "C2"],
      hourlyRate: 15,
      totalLessons: 1247,
      completedLessons: 1210,
      totalStudents: 89,
      totalEarned: 4280,
      averageRating: 4.9,
      totalReviews: 142,
      completionRate: 99,
      responseRate: 98,
    },
    {
      id: "tut-002",
      name: "Emily Clarke",
      email: "emily.c@email.com",
      phone: "+44 7822 654321",
      country: "United Kingdom",
      countryCode: "GB",
      city: "London",
      joinedDate: "2024-06-15",
      lastActive: "2026-02-15",
      status: "active",
      bio: "Experienced TEFL teacher passionate about helping students build confidence in spoken English.",
      specialties: [
        "Conversational English",
        "Pronunciation",
        "General English",
      ],
      qualifications: [
        { title: "TEFL Level 5", institution: "TEFL Org", year: 2018 },
      ],
      languages: [
        { language: "English", level: "Native" },
        { language: "French", level: "Intermediate" },
      ],
      cefrLevels: ["A1", "A2", "B1", "B2"],
      hourlyRate: 12,
      totalLessons: 856,
      completedLessons: 840,
      totalStudents: 62,
      totalEarned: 2980,
      averageRating: 4.7,
      totalReviews: 98,
      completionRate: 98,
      responseRate: 95,
    },
    {
      id: "tut-003",
      name: "David Chen",
      email: "david.c@email.com",
      phone: "+1 416 555 0199",
      country: "Canada",
      countryCode: "CA",
      city: "Toronto",
      joinedDate: "2026-02-16",
      lastActive: "2026-02-16",
      status: "pending_approval",
      bio: "Former university lecturer with 12 years experience teaching ESL. Specialize in academic writing and TOEFL prep.",
      specialties: ["Academic Writing", "TOEFL Preparation", "Grammar"],
      qualifications: [
        {
          title: "MA Applied Linguistics",
          institution: "University of Toronto",
          year: 2012,
        },
        { title: "CELTA", institution: "International House", year: 2014 },
      ],
      languages: [
        { language: "English", level: "Native" },
        { language: "Mandarin", level: "Native" },
      ],
      cefrLevels: ["B1", "B2", "C1", "C2"],
      hourlyRate: 20,
      totalLessons: 0,
      completedLessons: 0,
      totalStudents: 0,
      totalEarned: 0,
      averageRating: 0,
      totalReviews: 0,
      completionRate: 0,
      responseRate: 0,
      applicationNote:
        "Strong academic background. References from two universities provided.",
    },
    {
      id: "tut-004",
      name: "Thomas Weber",
      email: "thomas.w@email.com",
      phone: "+43 660 1234567",
      country: "Austria",
      countryCode: "AT",
      city: "Vienna",
      joinedDate: "2026-02-15",
      lastActive: "2026-02-15",
      status: "pending_approval",
      bio: "Bilingual English/German teacher. 5 years private tutoring experience. Focus on business communication.",
      specialties: ["Business English", "German to English", "Email Writing"],
      qualifications: [
        { title: "TEFL Certificate", institution: "Premier TEFL", year: 2020 },
      ],
      languages: [
        { language: "German", level: "Native" },
        { language: "English", level: "Fluent" },
      ],
      cefrLevels: ["A2", "B1", "B2"],
      hourlyRate: 14,
      totalLessons: 0,
      completedLessons: 0,
      totalStudents: 0,
      totalEarned: 0,
      averageRating: 0,
      totalReviews: 0,
      completionRate: 0,
      responseRate: 0,
      applicationNote:
        "Decent profile. No formal teaching degree but has TEFL cert.",
    },
    {
      id: "tut-005",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 212 555 0147",
      country: "United States",
      countryCode: "US",
      city: "New York",
      joinedDate: "2026-02-14",
      lastActive: "2026-02-14",
      status: "pending_approval",
      bio: "Passionate ESL teacher with a focus on conversational English and cultural exchange. 3 years teaching abroad in South Korea.",
      specialties: [
        "Conversational English",
        "Cultural English",
        "Beginner English",
      ],
      qualifications: [
        { title: "BA Education", institution: "NYU", year: 2019 },
        {
          title: "TESOL Certificate",
          institution: "Arizona State University",
          year: 2020,
        },
      ],
      languages: [
        { language: "English", level: "Native" },
        { language: "Korean", level: "Intermediate" },
      ],
      cefrLevels: ["A1", "A2", "B1"],
      hourlyRate: 16,
      totalLessons: 0,
      completedLessons: 0,
      totalStudents: 0,
      totalEarned: 0,
      averageRating: 0,
      totalReviews: 0,
      completionRate: 0,
      responseRate: 0,
      applicationNote:
        "Education degree + TESOL + overseas experience. Strong candidate.",
    },
    {
      id: "tut-006",
      name: "Mark Thompson",
      email: "mark.t@email.com",
      phone: "+44 7900 000000",
      country: "United Kingdom",
      countryCode: "GB",
      city: "Birmingham",
      joinedDate: "2025-06-01",
      lastActive: "2025-12-20",
      status: "inactive",
      bio: "English teacher taking a break from online tutoring.",
      specialties: ["General English"],
      qualifications: [],
      languages: [{ language: "English", level: "Native" }],
      cefrLevels: ["A1", "A2", "B1"],
      hourlyRate: 10,
      totalLessons: 120,
      completedLessons: 110,
      totalStudents: 18,
      totalEarned: 1100,
      averageRating: 4.2,
      totalReviews: 34,
      completionRate: 92,
      responseRate: 80,
    },
    {
      id: "tut-007",
      name: "Fake Tutor",
      email: "fake@spam.com",
      phone: "+00 000 000",
      country: "Unknown",
      countryCode: "XX",
      city: "N/A",
      joinedDate: "2025-11-10",
      lastActive: "2025-11-10",
      status: "banned",
      bio: "Spam account.",
      specialties: [],
      qualifications: [],
      languages: [],
      cefrLevels: [],
      hourlyRate: 0,
      totalLessons: 0,
      completedLessons: 0,
      totalStudents: 0,
      totalEarned: 0,
      averageRating: 0,
      totalReviews: 0,
      completionRate: 0,
      responseRate: 0,
    },
  ],
};
