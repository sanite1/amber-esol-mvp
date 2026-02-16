// ── Types ──

export interface DashboardTutor {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  avatar: string;
  headline: string;
  bio: string;
  specialty: string[];
  languages: { language: string; proficiency: string }[];
  levels: string[];
  hourlyRate: number;
  trialRate: number;
  rating: number;
  totalReviews: number;
  totalLessons: number;
  yearsExperience: number;
  responseTime: string;
  timezone: string;
  isOnline: boolean;
  nextAvailable: string;
  badges: string[];
  country: string;
}

export interface TutorFilterOptions {
  specialties: string[];
  levels: string[];
  languages: string[];
  priceRanges: { label: string; min: number; max: number | null }[];
  sortOptions: { label: string; value: string }[];
}

// ── Filter Options ──

export const tutorFilterOptions: TutorFilterOptions = {
  specialties: [
    "General English",
    "Business English",
    "IELTS Preparation",
    "Conversational English",
    "Academic English",
    "Pronunciation",
    "Grammar & Writing",
    "English for Kids",
    "Interview Preparation",
    "Cambridge Exams",
  ],
  levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  languages: [
    "English",
    "Spanish",
    "French",
    "Arabic",
    "Mandarin",
    "Portuguese",
    "Turkish",
    "Polish",
    "Russian",
    "Hindi",
  ],
  priceRanges: [
    { label: "Under £20", min: 0, max: 20 },
    { label: "£20 – £30", min: 20, max: 30 },
    { label: "£30 – £45", min: 30, max: 45 },
    { label: "£45+", min: 45, max: null },
  ],
  sortOptions: [
    { label: "Recommended", value: "recommended" },
    { label: "Highest Rated", value: "rating" },
    { label: "Most Lessons", value: "lessons" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Newest", value: "newest" },
  ],
};

// ── Dummy Tutors ──

export const dashboardTutors: DashboardTutor[] = [
  {
    id: "t-001",
    slug: "sarah-mitchell",
    firstName: "Sarah",
    lastName: "Mitchell",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    headline: "Experienced Business English Specialist",
    bio: "With 8 years of teaching experience, I help professionals gain confidence in workplace communication, presentations, and negotiations.",
    specialty: ["Business English", "Interview Preparation"],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "French", proficiency: "Fluent" },
    ],
    levels: ["B1", "B2", "C1", "C2"],
    hourlyRate: 32,
    trialRate: 0,
    rating: 4.9,
    totalReviews: 127,
    totalLessons: 1843,
    yearsExperience: 8,
    responseTime: "< 1 hour",
    timezone: "GMT+0",
    isOnline: true,
    nextAvailable: "Today, 3:00 PM",
    badges: ["Top Rated", "Quick Responder"],
    country: "United Kingdom",
  },
  {
    id: "t-002",
    slug: "james-okonkwo",
    firstName: "James",
    lastName: "Okonkwo",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    headline: "IELTS Expert — Band 8+ Guaranteed Strategy",
    bio: "Specialising in IELTS preparation with a proven track record. My students consistently achieve Band 7+ scores with focused exam strategies.",
    specialty: ["IELTS Preparation", "Academic English"],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Advanced" },
    ],
    levels: ["B1", "B2", "C1"],
    hourlyRate: 28,
    trialRate: 0,
    rating: 4.8,
    totalReviews: 93,
    totalLessons: 1256,
    yearsExperience: 6,
    responseTime: "< 2 hours",
    timezone: "GMT+1",
    isOnline: false,
    nextAvailable: "Tomorrow, 10:00 AM",
    badges: ["IELTS Expert"],
    country: "Nigeria",
  },
  {
    id: "t-003",
    slug: "elena-popova",
    firstName: "Elena",
    lastName: "Popova",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    headline: "Fun & Engaging Conversational English",
    bio: "I believe the best way to learn English is through natural conversation. My lessons are relaxed, fun, and tailored to your interests.",
    specialty: ["Conversational English", "General English"],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Russian", proficiency: "Native" },
      { language: "Polish", proficiency: "Fluent" },
    ],
    levels: ["A2", "B1", "B2"],
    hourlyRate: 22,
    trialRate: 0,
    rating: 5.0,
    totalReviews: 68,
    totalLessons: 892,
    yearsExperience: 4,
    responseTime: "< 30 min",
    timezone: "GMT+2",
    isOnline: true,
    nextAvailable: "Today, 6:00 PM",
    badges: ["Top Rated", "Quick Responder", "Rising Star"],
    country: "Poland",
  },
  {
    id: "t-004",
    slug: "anna-kowalski",
    firstName: "Anna",
    lastName: "Kowalski",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    headline: "Academic English & University Prep Specialist",
    bio: "I help students prepare for university-level English, including essay writing, presentations, and academic discussions.",
    specialty: ["Academic English", "Grammar & Writing"],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Polish", proficiency: "Native" },
      { language: "German", proficiency: "Advanced" },
    ],
    levels: ["B2", "C1", "C2"],
    hourlyRate: 28,
    trialRate: 0,
    rating: 4.9,
    totalReviews: 87,
    totalLessons: 1104,
    yearsExperience: 7,
    responseTime: "< 1 hour",
    timezone: "GMT+1",
    isOnline: false,
    nextAvailable: "Feb 16, 9:00 AM",
    badges: ["Top Rated"],
    country: "Germany",
  },
  {
    id: "t-005",
    slug: "david-chen",
    firstName: "David",
    lastName: "Chen",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    headline: "Pronunciation Coach — Speak Clearly & Confidently",
    bio: "Focused on helping learners improve their pronunciation, accent reduction, and speaking fluency through targeted exercises.",
    specialty: ["Pronunciation", "Conversational English"],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Mandarin", proficiency: "Native" },
    ],
    levels: ["A2", "B1", "B2", "C1"],
    hourlyRate: 24,
    trialRate: 0,
    rating: 4.8,
    totalReviews: 64,
    totalLessons: 780,
    yearsExperience: 5,
    responseTime: "< 3 hours",
    timezone: "GMT+8",
    isOnline: true,
    nextAvailable: "Today, 11:00 PM",
    badges: ["Pronunciation Pro"],
    country: "Canada",
  },
  {
    id: "t-006",
    slug: "fatima-hassan",
    firstName: "Fatima",
    lastName: "Hassan",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    headline: "Patient Grammar Expert for All Levels",
    bio: "I specialise in making grammar simple and understandable. Perfect for beginners who want a solid foundation in English.",
    specialty: ["Grammar & Writing", "General English"],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Arabic", proficiency: "Native" },
      { language: "French", proficiency: "Advanced" },
    ],
    levels: ["A1", "A2", "B1", "B2"],
    hourlyRate: 30,
    trialRate: 0,
    rating: 5.0,
    totalReviews: 42,
    totalLessons: 534,
    yearsExperience: 3,
    responseTime: "< 1 hour",
    timezone: "GMT+0",
    isOnline: true,
    nextAvailable: "Tomorrow, 2:00 PM",
    badges: ["Quick Responder", "Rising Star"],
    country: "Morocco",
  },
  {
    id: "t-007",
    slug: "mark-thompson",
    firstName: "Mark",
    lastName: "Thompson",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    headline: "Cambridge Exam Preparation Specialist",
    bio: "Over a decade of experience preparing students for FCE, CAE, and CPE exams. Structured approach with real exam practice.",
    specialty: ["Cambridge Exams", "Academic English"],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Fluent" },
    ],
    levels: ["B1", "B2", "C1", "C2"],
    hourlyRate: 38,
    trialRate: 0,
    rating: 4.7,
    totalReviews: 156,
    totalLessons: 2340,
    yearsExperience: 12,
    responseTime: "< 4 hours",
    timezone: "GMT+0",
    isOnline: false,
    nextAvailable: "Feb 17, 10:00 AM",
    badges: ["Top Rated", "Veteran Tutor"],
    country: "United Kingdom",
  },
  {
    id: "t-008",
    slug: "yuki-tanaka",
    firstName: "Yuki",
    lastName: "Tanaka",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    headline: "English for Kids — Fun & Interactive Lessons",
    bio: "I make learning English fun for children aged 6-14 with games, songs, and interactive activities. Certified in teaching young learners.",
    specialty: ["English for Kids", "General English"],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Hindi", proficiency: "Native" },
    ],
    levels: ["A1", "A2", "B1"],
    hourlyRate: 18,
    trialRate: 0,
    rating: 4.9,
    totalReviews: 51,
    totalLessons: 620,
    yearsExperience: 4,
    responseTime: "< 2 hours",
    timezone: "GMT+5:30",
    isOnline: true,
    nextAvailable: "Today, 4:00 PM",
    badges: ["Kids Specialist", "Rising Star"],
    country: "India",
  },
];
