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

/**
 * The first languages a LEARNER may pick during onboarding (AI Tutor
 * Brief §3 MVP): Arabic, Cantonese, Turkish — the three with full
 * session + safeguarding support today — plus "Other" so a learner
 * whose L1 isn't covered can still enrol (their session chrome falls
 * back to English). Deferred L1s (Somali, Dari, Pashto, Bengali, Urdu,
 * etc.) revive by widening this list once their support ships.
 *
 * NB: this is the LEARNER L1 gate only. ESOL_L1_LANGUAGES (full list)
 * stays the source for the teacher teaching-profile "languages spoken"
 * picker — a teacher may legitimately speak any of them.
 */
export const MVP_LEARNER_LANGUAGES = [
  "Arabic",
  "Cantonese",
  "Turkish",
  "Other",
] as const;
