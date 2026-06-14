/**
 * Canonical L1 / spoken-language option list.
 *
 * SINGLE SOURCE OF TRUTH for two surfaces that must stay in lockstep:
 *   - learner onboarding "first language" step (EsolOnboardingWizard)
 *   - teacher teaching-profile "languages spoken" multi-select
 *
 * Teacher↔learner matching compares the two case-insensitively but
 * otherwise verbatim, so keeping both pickers on one list is what
 * makes "Speaks Arabic" matches possible. The top entries mirror the
 * most common ESOL learner L1s in the UK.
 */
export const ESOL_L1_LANGUAGES = [
  "Arabic",
  "Bengali",
  "Cantonese",
  "Dari",
  "Farsi",
  "French",
  "Gujarati",
  "Hindi",
  "Mandarin",
  "Pashto",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Somali",
  "Spanish",
  "Tamil",
  "Turkish",
  "Urdu",
  "Vietnamese",
  "Other",
] as const;
