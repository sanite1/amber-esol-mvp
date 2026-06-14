/**
 * L1-language string tables for the Stage 5 learner self-assessment
 * screen — brief Function 17.
 *
 * Five L1s supported in MVP (matches the seed fixture): Arabic,
 * Somali, Dari, English, Cantonese. An unknown L1 falls back to
 * English; this is the brief's stated policy.
 *
 * Every emoji rating carries an `aria` string in the learner's L1.
 * The brief mandates screen-reader labels in L1 — these arrays are
 * the source of truth.
 *
 * The English column is ALSO shown visibly under each button — a
 * literate ESOL learner is, by definition, learning English, and
 * seeing the English label next to the L1 is itself pedagogical.
 */

export type L1Language = "arabic" | "somali" | "dari" | "english" | "cantonese";

export const SUPPORTED_L1S: ReadonlyArray<L1Language> = [
  "arabic",
  "somali",
  "dari",
  "english",
  "cantonese",
];

/**
 * Normalise an arbitrary user L1 string to one of the supported set.
 * Returns "english" for unknown/missing inputs.
 */
export const resolveL1 = (raw: string | null | undefined): L1Language => {
  if (!raw) return "english";
  const trimmed = raw.trim().toLowerCase();
  if ((SUPPORTED_L1S as readonly string[]).includes(trimmed)) {
    return trimmed as L1Language;
  }
  return "english";
};

// ─────────────────────────────────────────────────────────────────────
// Level labels (rendered in the encouraging banner)
// ─────────────────────────────────────────────────────────────────────

export const LEVEL_LABELS_EN: Record<string, string> = {
  e1: "Entry Level 1",
  e2: "Entry Level 2",
  e3: "Entry Level 3",
  l1: "Level 1",
  l2: "Level 2",
};

// ─────────────────────────────────────────────────────────────────────
// Translation tables
// ─────────────────────────────────────────────────────────────────────

interface Stage5Strings {
  /** Encouraging top banner. `%s` is replaced with the level label. */
  banner: string;
  page_title: string;
  intro: string;
  // Confidence rating block
  confidence_heading: string;
  confidence_low: string;
  confidence_medium: string;
  confidence_high: string;
  // Per-objective block
  objectives_heading: string;
  objective_struggling: string;
  objective_progressing: string;
  objective_confident: string;
  // Next-steps block
  next_steps_heading: string;
  next_steps_more_practice: string;
  next_steps_advance_level: string;
  next_steps_specific_focus: string;
  next_steps_unsure: string;
  // Submit + thank-you
  submit_button: string;
  submit_aria: string;
  thank_you_title: string;
  thank_you_message: string;
}

const EN: Stage5Strings = {
  banner: "Well done — you completed %s!",
  page_title: "Reflect on your progress",
  intro:
    "Take 5 minutes to tell us how you feel about your learning. There are no wrong answers.",
  confidence_heading: "How confident do you feel overall?",
  confidence_low: "Low",
  confidence_medium: "Medium",
  confidence_high: "High",
  objectives_heading: "For each goal you worked on, choose how you feel.",
  objective_struggling: "Struggling",
  objective_progressing: "Progressing",
  objective_confident: "Confident",
  next_steps_heading: "What would you like to do next?",
  next_steps_more_practice: "More practice at this level",
  next_steps_advance_level: "Move up to the next level",
  next_steps_specific_focus: "Focus on a specific skill",
  next_steps_unsure: "I'm not sure yet",
  submit_button: "Submit my reflection",
  submit_aria: "Submit Stage 5 self-assessment",
  thank_you_title: "Thank you!",
  thank_you_message:
    "We'll let you know when your tutor confirms your progress.",
};

// Translations below are MVP-quality placeholders authored alongside
// the seed fixture's L1 mix. Native-speaker review before any
// production rollout — flagged in the relevant Phase-18 polish task.

const ARABIC: Stage5Strings = {
  banner: "أحسنت — لقد أكملت %s!",
  page_title: "فكّر في تقدّمك",
  intro: "خذ ٥ دقائق لإخبارنا كيف تشعر تجاه تعلّمك. لا توجد إجابات خاطئة.",
  confidence_heading: "ما مدى ثقتك بشكل عام؟",
  confidence_low: "منخفضة",
  confidence_medium: "متوسطة",
  confidence_high: "عالية",
  objectives_heading: "لكل هدف عملت عليه، اختر كيف تشعر.",
  objective_struggling: "أجد صعوبة",
  objective_progressing: "أتقدّم",
  objective_confident: "واثق",
  next_steps_heading: "ماذا تريد أن تفعل بعد ذلك؟",
  next_steps_more_practice: "مزيد من التدريب في هذا المستوى",
  next_steps_advance_level: "الانتقال إلى المستوى التالي",
  next_steps_specific_focus: "التركيز على مهارة معيّنة",
  next_steps_unsure: "لست متأكّداً بعد",
  submit_button: "إرسال تأمّلي",
  submit_aria: "إرسال التقييم الذاتي للمرحلة الخامسة",
  thank_you_title: "شكراً لك!",
  thank_you_message: "سنعلمك عندما يؤكّد معلّمك تقدّمك.",
};

const SOMALI: Stage5Strings = {
  banner: "Si fiican baad u dhammaysay %s!",
  page_title: "Ka fakar horumarkaaga",
  intro:
    "Qaado 5 daqiiqo aad noogu sheegtid sida aad u dareemayso barashadaada. Ma jiraan jawaabo qaldan.",
  confidence_heading: "Sidee u kalsoon tahay guud ahaan?",
  confidence_low: "Hoose",
  confidence_medium: "Dhexdhexaad",
  confidence_high: "Sare",
  objectives_heading:
    "Hadaf kasta oo aad ka shaqeysay, dooro sida aad u dareemeyso.",
  objective_struggling: "Waan ku adkaystaa",
  objective_progressing: "Waan horumarayaa",
  objective_confident: "Waan kalsoonahay",
  next_steps_heading: "Maxaad rabtaa inaad samayso xiga?",
  next_steps_more_practice: "Dhaqan-celin badan oo heerkaan ah",
  next_steps_advance_level: "U gudub heerka xiga",
  next_steps_specific_focus: "Diirad u saar xirfad gaar ah",
  next_steps_unsure: "Wali ma hubo",
  submit_button: "Soo gudbi qiimayntayda",
  submit_aria: "Soo gudbi qiimaynta nafta ee Heerka 5aad",
  thank_you_title: "Mahadsanid!",
  thank_you_message:
    "Waxaan kuu sheegi doonnaa marka macallinkaagu xaqiijiyo horumarkaaga.",
};

const DARI: Stage5Strings = {
  banner: "آفرین — شما %s را تکمیل کردید!",
  page_title: "در باره پیشرفت خود فکر کنید",
  intro:
    "۵ دقیقه وقت بگذارید تا به ما بگویید در باره یادگیری خود چه احساسی دارید. هیچ پاسخ نادرستی وجود ندارد.",
  confidence_heading: "به طور کلی چقدر اعتماد به نفس دارید؟",
  confidence_low: "کم",
  confidence_medium: "متوسط",
  confidence_high: "زیاد",
  objectives_heading:
    "برای هر هدفی که روی آن کار کردید، احساس خود را انتخاب کنید.",
  objective_struggling: "در حال تلاش هستم",
  objective_progressing: "در حال پیشرفت هستم",
  objective_confident: "مطمئن هستم",
  next_steps_heading: "بعد از این می‌خواهید چه کار کنید؟",
  next_steps_more_practice: "تمرین بیشتر در همین سطح",
  next_steps_advance_level: "رفتن به سطح بعدی",
  next_steps_specific_focus: "تمرکز روی یک مهارت خاص",
  next_steps_unsure: "هنوز مطمئن نیستم",
  submit_button: "ارسال تأمل من",
  submit_aria: "ارسال خودارزیابی مرحله ۵",
  thank_you_title: "تشکر از شما!",
  thank_you_message:
    "وقتی مربی شما پیشرفت‌تان را تأیید کند به شما اطلاع می‌دهیم.",
};

const CANTONESE: Stage5Strings = {
  banner: "做得好 — 你完成咗 %s!",
  page_title: "回顧你嘅進步",
  intro: "用 5 分鐘話畀我哋知你對學習嘅感受。冇任何答案係錯㗎。",
  confidence_heading: "你整體上有幾大信心?",
  confidence_low: "低",
  confidence_medium: "中等",
  confidence_high: "高",
  objectives_heading: "對每個你做過嘅目標,揀返你嘅感受。",
  objective_struggling: "我覺得難",
  objective_progressing: "我喺度進步",
  objective_confident: "我有信心",
  next_steps_heading: "你之後想做啲乜?",
  next_steps_more_practice: "喺呢個程度多啲練習",
  next_steps_advance_level: "升上下一個程度",
  next_steps_specific_focus: "專注於某個技能",
  next_steps_unsure: "我未決定",
  submit_button: "提交我嘅反思",
  submit_aria: "提交第五階段自我評估",
  thank_you_title: "多謝!",
  thank_you_message: "當你嘅導師確認你嘅進度,我哋會通知你。",
};

const TABLE: Record<L1Language, Stage5Strings> = {
  english: EN,
  arabic: ARABIC,
  somali: SOMALI,
  dari: DARI,
  cantonese: CANTONESE,
};

/** Languages we render right-to-left. */
export const RTL_L1S: ReadonlySet<L1Language> = new Set([
  "arabic" as L1Language,
  "dari" as L1Language,
]);

export const isRtl = (l1: L1Language): boolean => RTL_L1S.has(l1);

export const t = (l1: L1Language): Stage5Strings => TABLE[l1];

export const levelLabel = (level: string): string =>
  LEVEL_LABELS_EN[level.toLowerCase()] ?? level.toUpperCase();
