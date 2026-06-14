/**
 * Lightweight i18n for the /join wizard — Function 2 To-Do 5.
 *
 * Lookup is `translations[lang][key]`. Missing keys fall back to English.
 * No heavy i18n library; we revisit this when sub-keying or pluralisation
 * becomes painful (likely around Function 6 placement screens).
 *
 * MVP languages (6) — full translations expected by the brief.
 * Extra languages (14) — registration-flow surface only; English strings
 * are placeholders for the linguist hand-off. The brief explicitly limits
 * the *recorded* l1_language to the 6 MVP options; the 20-strong UI
 * selector is for accessibility on the registration screens.
 *
 * `dir: "rtl"` flags are consumed by JoinWizard to set
 * <html dir> + <html lang>.
 */

import { createContext, useContext } from "react";

export type LangCode =
  // 6 MVP
  | "en"
  | "ar"
  | "so"
  | "fa-AF" // Dari
  | "ps" // Pashto
  | "yue" // Cantonese
  // 14 extras for registration flow only
  | "zh"
  | "es"
  | "fr"
  | "pt"
  | "ru"
  | "pl"
  | "ro"
  | "bn"
  | "ur"
  | "pa"
  | "tr"
  | "ti" // Tigrinya
  | "am"
  | "vi";

export type LangMeta = {
  code: LangCode;
  label: string; // Display in the language itself
  dir: "ltr" | "rtl";
  // Maps to backend l1_language enum (6 MVP only). Languages outside the
  // MVP set fall back to "english" — recorded value vs UI language are
  // separate concerns.
  l1?: "arabic" | "somali" | "dari" | "pashto" | "cantonese" | "english";
};

export const LANGUAGES: LangMeta[] = [
  { code: "en", label: "English", dir: "ltr", l1: "english" },
  { code: "ar", label: "العربية", dir: "rtl", l1: "arabic" },
  { code: "so", label: "Soomaali", dir: "ltr", l1: "somali" },
  { code: "fa-AF", label: "دری", dir: "rtl", l1: "dari" },
  { code: "ps", label: "پښتو", dir: "rtl", l1: "pashto" },
  { code: "yue", label: "粵語", dir: "ltr", l1: "cantonese" },
  // Extras — UI translation only
  { code: "zh", label: "中文", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "pt", label: "Português", dir: "ltr" },
  { code: "ru", label: "Русский", dir: "ltr" },
  { code: "pl", label: "Polski", dir: "ltr" },
  { code: "ro", label: "Română", dir: "ltr" },
  { code: "bn", label: "বাংলা", dir: "ltr" },
  { code: "ur", label: "اردو", dir: "rtl" },
  { code: "pa", label: "ਪੰਜਾਬੀ", dir: "ltr" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
  { code: "ti", label: "ትግርኛ", dir: "ltr" },
  { code: "am", label: "አማርኛ", dir: "ltr" },
  { code: "vi", label: "Tiếng Việt", dir: "ltr" },
];

// Translation keys used across the wizard. Adding a new key here without
// updating each language object is fine — fallback is English.
export type TKey =
  | "welcome.title"
  | "welcome.lead"
  | "welcome.choose_language"
  | "welcome.cta"
  | "step.personal.title"
  | "step.personal.firstname"
  | "step.personal.lastname"
  | "step.personal.dob"
  | "step.personal.nationality"
  | "step.personal.postcode"
  | "step.personal.postcode_help"
  | "step.personal.sex"
  | "step.personal.sex_male"
  | "step.personal.sex_female"
  | "step.eligibility.title"
  | "step.eligibility.declaration"
  | "step.eligibility.confirm"
  | "step.uln.title"
  | "step.uln.help"
  | "step.uln.label"
  | "step.uln.skip"
  | "step.uln.gov_link_text"
  | "step.complete.title"
  | "step.complete.body"
  | "step.complete.cta"
  | "common.back"
  | "common.continue"
  | "common.required"
  | "common.loading"
  | "common.error_generic";

type Dict = Partial<Record<TKey, string>>;

const en: Dict = {
  "welcome.title": "Welcome to {orgName}",
  "welcome.lead":
    "You have been invited to join an English learning programme. This will only take a few minutes.",
  "welcome.choose_language": "Choose your language",
  "welcome.cta": "Continue",
  "step.personal.title": "Tell us about yourself",
  "step.personal.firstname": "First name",
  "step.personal.lastname": "Last name",
  "step.personal.dob": "Date of birth",
  "step.personal.nationality": "Nationality",
  "step.personal.postcode": "Your home postcode before joining this programme",
  "step.personal.postcode_help":
    "We use this to confirm funding rules — not to check your address.",
  "step.personal.sex": "Sex (as recorded on official documents)",
  "step.personal.sex_male": "Male",
  "step.personal.sex_female": "Female",
  "step.eligibility.title": "Confirm your eligibility",
  "step.eligibility.declaration":
    "I confirm that I am legally entitled to live and study in England. My organisation has verified my right to access this programme.",
  "step.eligibility.confirm": "I confirm",
  "step.uln.title": "Do you have a Unique Learner Number (ULN)?",
  "step.uln.help":
    "Your ULN is a 10-digit number used in UK education. If you do not have one, you can skip this step.",
  "step.uln.label": "ULN — 10 digits",
  "step.uln.skip": "I do not have my ULN — skip this step",
  "step.uln.gov_link_text":
    "Find out more at the Learning Records Service (gov.uk)",
  "step.complete.title": "You are all set, {firstName}",
  "step.complete.body":
    "Next, we will ask a few short questions to find the right level for you.",
  "step.complete.cta": "Continue to placement assessment",
  "common.back": "Back",
  "common.continue": "Continue",
  "common.required": "This field is required",
  "common.loading": "Loading…",
  "common.error_generic":
    "Something went wrong. Please check your connection and try again.",
};

// Arabic — RTL. Hand-translated for the MVP set is expected before launch.
const ar: Dict = {
  "welcome.title": "مرحباً بك في {orgName}",
  "welcome.lead":
    "لقد تمت دعوتك للانضمام إلى برنامج لتعلم اللغة الإنجليزية. لن يستغرق هذا سوى بضع دقائق.",
  "welcome.choose_language": "اختر لغتك",
  "welcome.cta": "متابعة",
  "step.personal.title": "أخبرنا عن نفسك",
  "step.personal.firstname": "الاسم الأول",
  "step.personal.lastname": "اسم العائلة",
  "step.personal.dob": "تاريخ الميلاد",
  "step.personal.nationality": "الجنسية",
  "step.personal.postcode":
    "الرمز البريدي لمنزلك قبل الانضمام إلى هذا البرنامج",
  "step.personal.postcode_help":
    "نستخدم هذا للتحقق من قواعد التمويل — وليس للتحقق من عنوانك.",
  "step.personal.sex": "الجنس (كما هو مسجل في الوثائق الرسمية)",
  "step.personal.sex_male": "ذكر",
  "step.personal.sex_female": "أنثى",
  "step.eligibility.title": "تأكيد الأهلية",
  "step.eligibility.declaration":
    "أؤكد أنني مؤهل قانونياً للعيش والدراسة في إنجلترا. وقد تحققت منظمتي من حقي في الوصول إلى هذا البرنامج.",
  "step.eligibility.confirm": "أؤكد",
  "step.uln.title": "هل لديك رقم متعلم فريد (ULN)؟",
  "step.uln.help":
    "رقم ULN هو رقم مكون من 10 أرقام يستخدم في التعليم في المملكة المتحدة. إذا لم يكن لديك، يمكنك تخطي هذه الخطوة.",
  "step.uln.label": "رقم ULN — 10 أرقام",
  "step.uln.skip": "ليس لدي رقم ULN — تخطي هذه الخطوة",
  "step.uln.gov_link_text": "اعرف المزيد على خدمة سجلات التعلم (gov.uk)",
  "step.complete.title": "تم كل شيء، {firstName}",
  "step.complete.body":
    "بعد ذلك، سنطرح بعض الأسئلة القصيرة للعثور على المستوى المناسب لك.",
  "step.complete.cta": "متابعة إلى تقييم التحديد",
  "common.back": "رجوع",
  "common.continue": "متابعة",
  "common.required": "هذا الحقل مطلوب",
  "common.loading": "جارٍ التحميل…",
  "common.error_generic":
    "حدث خطأ ما. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
};

// Somali, Dari, Pashto, Cantonese — strings TBD by translators. Falling
// back to English at runtime keeps the surface usable in the meantime.
const so: Dict = {};
const faAF: Dict = {};
const ps: Dict = {};
const yue: Dict = {};

// 14 extras — left empty; the language selector switches dir/lang only,
// and the UI strings show in English until translations land.
const empty: Dict = {};

const TRANSLATIONS: Record<LangCode, Dict> = {
  en,
  ar,
  so,
  "fa-AF": faAF,
  ps,
  yue,
  zh: empty,
  es: empty,
  fr: empty,
  pt: empty,
  ru: empty,
  pl: empty,
  ro: empty,
  bn: empty,
  ur: empty,
  pa: empty,
  tr: empty,
  ti: empty,
  am: empty,
  vi: empty,
};

export const translate = (
  lang: LangCode,
  key: TKey,
  vars?: Record<string, string>,
): string => {
  const raw = TRANSLATIONS[lang]?.[key] ?? en[key] ?? key;
  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, "g"), v),
    raw,
  );
};

// React context — every step pulls `t` and the current LangMeta from here.
export type I18nContextValue = {
  lang: LangCode;
  meta: LangMeta;
  setLang: (next: LangCode) => void;
  t: (key: TKey, vars?: Record<string, string>) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nContext.Provider");
  }
  return ctx;
};
