/**
 * Display labels for teaching-profile codes — shared by the org-admin
 * matching surfaces (Teacher Assignment table, Suggested-teachers
 * panel). The teacher-side editor keeps its own richer copy (labels +
 * hints) in teacher/pages/TeachingProfile.tsx.
 */
export const LEVEL_LABELS: Record<string, string> = {
  e1: "Entry 1",
  e2: "Entry 2",
  e3: "Entry 3",
  l1: "Level 1",
  l2: "Level 2",
};

export const SPECIALISM_LABELS: Record<string, string> = {
  exam_preparation: "Exam prep",
  employability: "Employability",
  everyday_english: "Everyday English",
  family_learning: "Family learning",
  send_support: "SEND support",
  digital_skills: "Digital skills",
};

export const levelLabel = (code: string): string =>
  LEVEL_LABELS[code?.toLowerCase?.() ?? ""] ?? code;

export const specialismLabel = (key: string): string =>
  SPECIALISM_LABELS[key] ?? key;
