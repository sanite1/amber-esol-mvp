// ─── Types ───────────────────────────────────────────────────────────────────

export interface TutorReview {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  comment: string;
  date: string;
  lessonType: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AvailabilityDay {
  date: string;
  slots: TimeSlot[];
}

export interface TutorQualification {
  title: string;
  institution: string;
  year: number;
}

export interface TutorDetail {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  coverImage: string;
  headline: string;
  bio: string;
  country: string;
  timezone: string;
  languages: { language: string; level: string }[];
  specialties: string[];
  levels: string[];
  hourlyRate: number;
  trialDuration: number; // minutes
  responseTime: string;
  totalLessons: number;
  totalStudents: number;
  totalReviews: number;
  rating: number;
  yearsExperience: number;
  completionRate: number;
  isOnline: boolean;
  lastActive: string;
  qualifications: TutorQualification[];
  teachingStyle: string;
  badges: string[];
  hasTrialAvailable: boolean;
  hasStudentBookedTrial: boolean;
  reviews: TutorReview[];
  availability: AvailabilityDay[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateAvailability(): AvailabilityDay[] {
  const days: AvailabilityDay[] = [];
  const today = new Date();

  for (let d = 1; d <= 21; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);

    // Skip some days to simulate days off
    if (date.getDay() === 0) continue; // No Sundays

    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = date.getDay() === 6 ? 14 : 18; // Shorter Saturdays

    for (let h = startHour; h < endHour; h++) {
      slots.push({
        id: `slot-${d}-${h}`,
        startTime: `${String(h).padStart(2, "0")}:00`,
        endTime: `${String(h + 1).padStart(2, "0")}:00`,
        available: Math.random() > 0.3, // ~70% available
      });
    }

    days.push({
      date: date.toISOString().split("T")[0],
      slots,
    });
  }

  return days;
}

// ─── Dummy data ──────────────────────────────────────────────────────────────

export const tutorDetail: TutorDetail = {
  id: "tutor-001",
  slug: "sarah-mitchell",
  name: "Sarah Mitchell",
  avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  coverImage: "",
  headline:
    "CELTA-certified English tutor specialising in IELTS & Business English",
  bio: `I'm Sarah, a passionate English language teacher with over 8 years of experience helping students achieve their language goals. I hold a CELTA qualification from Cambridge and have taught students from over 30 different countries.
  
  My teaching approach is communicative and student-centred. I believe in creating a comfortable, encouraging environment where you feel confident to practise and make mistakes. Every lesson is tailored to your specific needs, whether that's preparing for IELTS, improving your business communication, or building general fluency.
  
  I specialise in IELTS preparation (I've helped over 200 students achieve their target band scores), Business English for professionals, and General English from intermediate to advanced levels. My students often tell me they appreciate my patience, clear explanations, and the structured approach I bring to each lesson.
  
  Outside of teaching, I love travelling and learning languages myself, I speak conversational Spanish and am currently learning Japanese. This gives me real empathy for what my students go through!`,
  country: "United Kingdom",
  timezone: "GMT+0 (London)",
  languages: [
    { language: "English", level: "Native" },
    { language: "Spanish", level: "Conversational" },
    { language: "Japanese", level: "Beginner" },
  ],
  specialties: [
    "IELTS Preparation",
    "Business English",
    "General English",
    "Conversation Practice",
    "Academic Writing",
  ],
  levels: [
    "B1 Intermediate",
    "B2 Upper-Intermediate",
    "C1 Advanced",
    "C2 Proficiency",
  ],
  hourlyRate: 15,
  trialDuration: 30,
  responseTime: "< 2 hours",
  totalLessons: 1247,
  totalStudents: 186,
  totalReviews: 142,
  rating: 4.9,
  yearsExperience: 8,
  completionRate: 98,
  isOnline: true,
  lastActive: "2026-02-14T10:30:00Z",
  qualifications: [
    { title: "CELTA", institution: "Cambridge Assessment English", year: 2018 },
    {
      title: "MA Applied Linguistics",
      institution: "University of Edinburgh",
      year: 2017,
    },
    {
      title: "BA English Literature",
      institution: "University of Leeds",
      year: 2015,
    },
  ],
  teachingStyle:
    "Communicative, student-centred approach. I use real-world materials, role-plays, and structured practice to help you build confidence and fluency. Every lesson has clear goals and you'll always leave knowing exactly what to practise next.",
  badges: ["Top Rated", "CELTA Certified", "Quick Responder", "1000+ Lessons"],
  hasTrialAvailable: true,
  hasStudentBookedTrial: false,
  reviews: [
    {
      id: "rev-001",
      studentName: "Yuki T.",
      studentAvatar: "",
      rating: 5,
      comment:
        "Sarah is an amazing teacher! She helped me improve my IELTS score from 6.0 to 7.5 in just two months. Her structured approach to each skill area and the homework she provides between lessons made a huge difference.",
      date: "2026-02-10",
      lessonType: "IELTS Preparation",
    },
    {
      id: "rev-002",
      studentName: "Marco R.",
      studentAvatar: "",
      rating: 5,
      comment:
        "I've been taking Business English lessons with Sarah for 3 months now and my confidence in meetings has improved dramatically. She understands professional contexts and tailors lessons to real situations I face at work.",
      date: "2026-02-05",
      lessonType: "Business English",
    },
    {
      id: "rev-003",
      studentName: "Ana S.",
      studentAvatar: "",
      rating: 4,
      comment:
        "Very patient and clear explanations. Sarah always makes me feel comfortable to try new things. The only reason for 4 stars is sometimes lessons run slightly over time, but honestly that's because she's generous with her time!",
      date: "2026-01-28",
      lessonType: "General English",
    },
    {
      id: "rev-004",
      studentName: "Chen W.",
      studentAvatar: "",
      rating: 5,
      comment:
        "Excellent tutor. Very well organised and always prepared. I appreciate that she sends me a summary after each lesson with key vocabulary and grammar points. Highly recommend for anyone serious about improving.",
      date: "2026-01-20",
      lessonType: "Academic Writing",
    },
    {
      id: "rev-005",
      studentName: "Fatima A.",
      studentAvatar: "",
      rating: 5,
      comment:
        "Sarah is the best English teacher I've ever had. She's encouraging, professional, and her lessons are always interesting. I've recommended her to three of my friends already!",
      date: "2026-01-15",
      lessonType: "Conversation Practice",
    },
    {
      id: "rev-006",
      studentName: "Pavel K.",
      studentAvatar: "",
      rating: 4,
      comment:
        "Good teacher with solid methods. She helped me prepare for a job interview in English and I got the position! Would definitely book again.",
      date: "2026-01-08",
      lessonType: "Business English",
    },
  ],
  availability: generateAvailability(),
};
