export interface Tutor {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  specialty: string;
  levels: string[];
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  bio: string;
  badges: string[];
  languages: string[];
  lessonsCompleted: number;
  available: boolean;
  nextSlot: string;
  country: string;
  // ── new fields ──
  coverImage?: string;
  introVideo?: string;
  fullBio?: string;
  education?: { institution: string; degree: string; year: string }[];
  certifications?: { name: string; issuer: string }[];
  teachingStyle?: string[];
  responseTime?: string;
  timezone?: string;
  memberSince?: string;
  availability?: { day: string; slots: string[] }[];
  reviewsList?: {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    text: string;
    level: string;
  }[];
}

export const tutors: Tutor[] = [
  {
    id: "1",
    slug: "sarah-mitchell",
    name: "Sarah Mitchell",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    specialty: "General English",
    levels: ["A2", "B1", "B2"],
    rating: 4.9,
    reviews: 127,
    price: 25,
    currency: "£",
    bio: "CELTA-certified with 8 years helping adult learners gain confidence in everyday English.",
    badges: ["CELTA", "Top Rated"],
    languages: ["English", "Spanish"],
    lessonsCompleted: 980,
    available: true,
    nextSlot: "Today, 3:00 PM",
    country: "UK",
    introVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    fullBio:
      "I'm Sarah, a CELTA-certified English teacher based in London with over 8 years of experience teaching adults from all over the world. I specialise in helping learners at the A2–B2 level build real confidence in everyday conversation, workplace English, and social situations.\n\nMy lessons are structured but relaxed, I use real-life scenarios, role-plays, and current topics to keep things interesting. I believe the best way to learn is by speaking, so expect lots of practice!\n\nBefore teaching, I worked in hospitality management, which gives me a practical understanding of the English learners actually need. Whether you're preparing for a job interview, settling into life in the UK, or just want to feel more comfortable chatting with neighbours, I'd love to help.",
    education: [
      {
        institution: "University of Leeds",
        degree: "BA English Language",
        year: "2014",
      },
      {
        institution: "International House London",
        degree: "CELTA",
        year: "2015",
      },
    ],
    certifications: [
      { name: "CELTA", issuer: "Cambridge Assessment" },
      { name: "TKT Modules 1-3", issuer: "Cambridge Assessment" },
    ],
    teachingStyle: [
      "Conversational",
      "Role-play focused",
      "Real-world scenarios",
      "Patient & encouraging",
    ],
    responseTime: "Under 1 hour",
    timezone: "GMT (London)",
    memberSince: "March 2024",
    availability: [
      { day: "Mon", slots: ["9:00 AM", "10:30 AM", "1:00 PM", "3:00 PM"] },
      { day: "Tue", slots: ["10:00 AM", "2:00 PM", "4:30 PM"] },
      { day: "Wed", slots: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"] },
      { day: "Thu", slots: ["10:00 AM", "1:00 PM"] },
      { day: "Fri", slots: ["9:00 AM", "11:30 AM", "2:00 PM"] },
    ],
    reviewsList: [
      {
        id: "r1",
        author: "Maria G.",
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
        rating: 5,
        date: "Jan 2026",
        text: "Sarah is amazing! She makes me feel comfortable even when I make mistakes. My confidence has improved so much in just 4 lessons.",
        level: "B1",
      },
      {
        id: "r2",
        author: "Ahmed H.",
        avatar: "https://randomuser.me/api/portraits/men/18.jpg",
        rating: 5,
        date: "Dec 2025",
        text: "Very professional and well-prepared. Every lesson has a clear structure and I always learn something new.",
        level: "A2",
      },
      {
        id: "r3",
        author: "Yuki T.",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        rating: 5,
        date: "Dec 2025",
        text: "Best tutor I've had. She adapts the lesson to exactly what I need and is always so patient.",
        level: "B2",
      },
      {
        id: "r4",
        author: "Carlos P.",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        rating: 4,
        date: "Nov 2025",
        text: "Great lessons with good balance of speaking and grammar. Would recommend to anyone looking to improve.",
        level: "B1",
      },
    ],
  },
  {
    id: "2",
    slug: "james-okonkwo",
    name: "James Okonkwo",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    specialty: "IELTS Preparation",
    levels: ["B1", "B2", "C1"],
    rating: 4.8,
    reviews: 94,
    price: 30,
    currency: "£",
    bio: "Former IELTS examiner specialising in band 7+ strategies for academic and general modules.",
    badges: ["DELTA", "IELTS Expert"],
    languages: ["English", "Yoruba"],
    lessonsCompleted: 720,
    available: true,
    nextSlot: "Tomorrow, 10:00 AM",
    country: "UK",
    fullBio:
      "I'm James, a DELTA-qualified English teacher and former IELTS examiner with 10 years of experience helping students achieve band 7 and above. I've taught in Nigeria, the UAE, and the UK, giving me a deep understanding of the challenges multilingual learners face.\n\nMy IELTS lessons are strategic and results-driven. I break down each section of the exam, teach proven techniques, and run timed practice sessions so you feel fully prepared on test day.\n\nOutside of IELTS, I also teach general and academic English at the B1–C1 level. I'm passionate about helping people unlock opportunities through language.",
    education: [
      {
        institution: "University of Lagos",
        degree: "BA Linguistics",
        year: "2012",
      },
      { institution: "University of Cambridge", degree: "DELTA", year: "2017" },
    ],
    certifications: [
      { name: "DELTA", issuer: "Cambridge Assessment" },
      { name: "IELTS Examiner", issuer: "British Council" },
    ],
    teachingStyle: [
      "Exam strategies",
      "Timed practice",
      "Structured feedback",
      "Results-driven",
    ],
    responseTime: "Under 2 hours",
    timezone: "GMT (London)",
    memberSince: "June 2024",
    availability: [
      { day: "Mon", slots: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { day: "Tue", slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
      { day: "Wed", slots: ["10:00 AM", "1:00 PM", "5:00 PM"] },
      { day: "Thu", slots: ["9:00 AM", "11:30 AM", "2:00 PM", "4:00 PM"] },
      { day: "Fri", slots: ["10:00 AM", "12:00 PM"] },
    ],
    reviewsList: [
      {
        id: "r1",
        author: "Li W.",
        avatar: "https://randomuser.me/api/portraits/men/55.jpg",
        rating: 5,
        date: "Jan 2026",
        text: "James helped me go from band 5.5 to 7.0 in 8 weeks. His strategies for the writing section are brilliant.",
        level: "B2",
      },
      {
        id: "r2",
        author: "Fatima A.",
        avatar: "https://randomuser.me/api/portraits/women/37.jpg",
        rating: 5,
        date: "Dec 2025",
        text: "Very knowledgeable and structured. I felt so much more confident walking into my exam.",
        level: "C1",
      },
      {
        id: "r3",
        author: "Dmitry K.",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
        rating: 4,
        date: "Nov 2025",
        text: "Solid lessons with great mock tests. James gives honest feedback which really helps.",
        level: "B1",
      },
    ],
  },
  {
    id: "4",
    slug: "david-rossi",
    name: "David Rossi",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    specialty: "Conversational English",
    levels: ["A1", "A2", "B1"],
    rating: 4.7,
    reviews: 58,
    price: 20,
    currency: "£",
    bio: "Patient and encouraging, perfect for beginners looking to build speaking confidence from scratch.",
    badges: ["CELTA", "Beginner Friendly"],
    languages: ["English", "Italian"],
    lessonsCompleted: 340,
    available: true,
    nextSlot: "Today, 5:30 PM",
    country: "Italy",
  },
  {
    id: "5",
    slug: "amara-diallo",
    name: "Amara Diallo",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    specialty: "Academic English",
    levels: ["B2", "C1"],
    rating: 4.9,
    reviews: 81,
    price: 28,
    currency: "£",
    bio: "Supports university students with essays, dissertations, and academic speaking skills.",
    badges: ["DELTA", "Academic"],
    languages: ["English", "French"],
    lessonsCompleted: 560,
    available: true,
    nextSlot: "Today, 1:00 PM",
    country: "UK",
  },
  {
    id: "6",
    slug: "tomasz-nowak",
    name: "Tomasz Nowak",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    specialty: "Exam Preparation",
    levels: ["A2", "B1", "B2"],
    rating: 4.6,
    reviews: 42,
    price: 22,
    currency: "£",
    bio: "Focused on Cambridge and Trinity exam prep. Structured lesson plans with mock tests included.",
    badges: ["TEFL", "Exam Prep"],
    languages: ["English", "Polish"],
    lessonsCompleted: 290,
    available: true,
    nextSlot: "Tomorrow, 2:00 PM",
    country: "Poland",
  },
  {
    id: "7",
    slug: "priya-sharma",
    name: "Priya Sharma",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    specialty: "Pronunciation",
    levels: ["A1", "A2", "B1", "B2"],
    rating: 4.8,
    reviews: 73,
    price: 24,
    currency: "£",
    bio: "Phonetics specialist who helps learners sound natural and improve listening comprehension.",
    badges: ["CELTA", "Pronunciation"],
    languages: ["English", "Hindi"],
    lessonsCompleted: 510,
    available: false,
    nextSlot: "Thu, 11:00 AM",
    country: "UK",
  },
  {
    id: "8",
    slug: "marcus-thompson",
    name: "Marcus Thompson",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    specialty: "General English",
    levels: ["B1", "B2", "C1"],
    rating: 4.7,
    reviews: 39,
    price: 26,
    currency: "£",
    bio: "Energetic lessons mixing grammar, vocabulary, and real-world scenarios. Great for intermediate learners.",
    badges: ["TEFL", "Top Rated"],
    languages: ["English"],
    lessonsCompleted: 215,
    available: true,
    nextSlot: "Today, 6:00 PM",
    country: "UK",
  },
];

export const specialties = [
  "General English",
  "IELTS Preparation",
  "Business English",
  "Conversational English",
  "Academic English",
  "Exam Preparation",
  "Pronunciation",
];

export const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const priceRanges = [
  { label: "Under £20", min: 0, max: 20 },
  { label: "£20 – £25", min: 20, max: 25 },
  { label: "£25 – £30", min: 25, max: 30 },
  { label: "£30+", min: 30, max: 999 },
];

export const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Highest Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];
