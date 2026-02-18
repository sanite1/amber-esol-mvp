// src/data/student/dashboardTutorsData.ts

/* ── Types ── */

export interface TutorFilterOptions {
  specialties: string[];
  levels: string[];
  languages: string[];
  priceRanges: { label: string; min: number; max: number | null }[];
  sortOptions: { label: string; value: string }[];
}

/* ── Filter Options ── */

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
  levels: [
    "beginner",
    "elementary",
    "intermediate",
    "upper-intermediate",
    "advanced",
  ],
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
    { label: "Price: Low to High", value: "price_low" },
    { label: "Price: High to Low", value: "price_high" },
    { label: "Most Experience", value: "experience" },
    { label: "Newest", value: "newest" },
  ],
};

/* ── Level label helper ── */

export const levelLabels: Record<string, string> = {
  beginner: "A1 – Beginner",
  elementary: "A2 – Elementary",
  intermediate: "B1 – Intermediate",
  "upper-intermediate": "B2 – Upper Intermediate",
  advanced: "C1 – Advanced",
};
