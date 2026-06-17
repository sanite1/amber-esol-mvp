# Phase 8 — Go-Live Sign-offs, Content & Calibration Gate

_Project Silk / Amber ESOL — AI Tutor Build Brief F-series. Authored 2026-06-17._

Phases 0–7 built the system. **Phase 8 is the gate between "built" and
"live."** Most of it is not code — it is three expert sign-offs, one
content-authoring pass with native review, and a placement-calibration
exercise. This document is the single checklist for clearing that gate.

> **Rule:** nothing in the "Go-live blockers" section below may be
> assumed. Every item is either confirmed by a named human or it blocks
> go-live. The platform is built to **fail safe** while these are open
> (voice off, AI achievement withheld, AI hours excluded from claims),
> so the system can ship _dark_ and light up per sign-off.

---

## 1. The three expert sign-offs

### 1.1 DELTA / ESOL practitioner — _pedagogy & content_

Owns: the teaching is sound and the content is accurate.

- [ ] **Curriculum calibration** — the per-level CEFR mapping, can-do
      statements and grammar targets in `esol_curriculum.json`
      (seeded into `CurriculumLevel`) are correct for E1–L2.
- [ ] **Bridge-Method L1 ratios** — the `bridgeL1Ratio` bands per level
      (E1 0.6–0.7 → L2 0.0–0.1) match intended practice.
- [ ] **Recast balance** — recast-by-default, intelligibility-not-
      nativeness reads correctly in the assembled system prompt
      (Layers 2/3 from `system_prompt_spec.json`).
- [ ] **Long-horizon forms** — the developmentally-late set
      (`CurriculumLevel.longHorizonForms`: 3SG-s, articles, inversion…)
      is right, and "recycle, never fail" is the correct treatment
      (now injected into Layer 5).
- [ ] **Scenario content accuracy** — all 8 scenarios (see §3) reviewed
      for level-appropriateness, UK-context accuracy and the
      advice-guardrail authoring gate (rehearse the _language_, never
      give the substantive advice).
- [ ] **Formative data points genuinely evidence progress**
      (`evidence_mapping.json` open-flag #3).

### 1.2 Funding-assurance specialist — _ILR / RARPA / GLA_

Owns: the claims are audit-defensible. **Highest-risk sign-off.**

The 11 questions (consolidated from the brief + `evidence_mapping.json`
open-flags + the hours work in Phase 5):

- [ ] **Funding model** — 11 (Tailored Learning) vs 38 (Adult Skills
      Fund) is correct for each org.
- [ ] **Category-B Z-code** — the exact non-regulated ESOL `LearnAimRef`
      Z-code. **[UNVERIFIED — CONFIRM BEFORE BUILD]** per
      `evidence_mapping.json` meta.
- [ ] **2026/27 Hours Record HRSType codes** — hours move to the
      `HRSRecord` entity in 2026/27; exact HRSType codes.
      **[UNVERIFIED]**.
- [ ] **AI session logs as attendance evidence** — are they accepted as
      evidence behind `PlanLearnHours`? (`evidence_mapping.json`
      open-flag #2).
- [ ] **AI time in the claim** — Phase 5 **excludes** `ai_tutor` minutes
      from `AddHours` and adds a `claimable_glh` (= pre_platform +
      teacher_contact). Confirm AI time stays out until the GLA opinion,
      or supply the rule for when it counts. The code flips cleanly.
- [ ] **Hours double-count fix** — confirm the teacher-contact-once-per-
      learner attribution (Phase 5.3) is the correct accounting; sign
      off the eventual one-row-per-learner-aim restructure.
- [ ] **The honesty gate** — no ILR `Outcome=1`/achieved without a human
      `Stage5Review.org_admin_confirmed_at`. Confirm this satisfies the
      "reliable / consistent / comparable assessment" bar (the
      Ofsted-flagged risk; `evidence_mapping.json` open-flag #1).
- [ ] **Assessment moderation** — the sampling/moderation process for AI
      formative judgements (turn_score carries `human_confirm=true`).
- [ ] **RARPA Stage 3 negotiation** — the L1 negotiation evidence record
      (`rarpa_stage3_negotiated` AuditLog, Phase 4.2) is accepted as
      Stage 3 evidence.
- [ ] **RARPA achievement threshold** — the configurable 75–80%-of-
      objectives bar (incl. ≥1 individual objective) is set in
      `ComplianceConfig`.
- [ ] **GLA ASF Assurance Framework** — the full evidence chain
      satisfies it (`evidence_mapping.json` open-flag #1).

### 1.3 Safeguarding lead (DSL) — _existential_

Owns: every disclosure reaches a human, fast, in the right language.

- [ ] **Keyword banks complete** — the ar/tr/yue patterns in
      `safeguarding-keywords.json` are STARTER sets; a native speaker +
      the DSL must complete and review them. (Phase 1.1)
- [ ] **Crisis-message translations** — `safeguarding-messages.json` has
      authored ar/tr/yue for self_harm / domestic_abuse /
      mental_health_crisis; the rest fall back to English and need
      authoring + review. (Phase 1.1)
- [ ] **Referral SLA** — confirm the DSL-notification p95 < 5s SLA and
      the referral standard.
- [ ] **Decrypted-disclosure access control** — confirm who may decrypt
      `SafeguardingAlert.rawInputEncrypted` and that the access path is
      logged. (Phase 1.3)
- [ ] **AI secondary safeguarding net** — the AI-flag defence-in-depth
      check is retained until the keyword banks are complete; confirm
      the keep/remove decision. (Phase 2.3 note)

---

## 2. Consolidated UNVERIFIED / ops register (phases 1–7)

| #   | Item                                                                            | Phase | Owner        | Type         |
| --- | ------------------------------------------------------------------------------- | ----- | ------------ | ------------ |
| 1   | Complete ar/tr/yue safeguarding keyword banks                                   | 1.1   | DSL + native | content      |
| 2   | Author crisis-message translations (ar/tr/yue)                                  | 1.1   | DSL + native | content      |
| 3   | `SAFEGUARDING_ENCRYPTION_KEY` in `.env` + Vercel                                | 1.3   | ops          | config       |
| 4   | Decrypted-disclosure access-control review                                      | 1.3   | DSL          | governance   |
| 5   | Advice-guardrail authoring gate on scenarios                                    | 2.1   | DELTA        | content      |
| 6   | Category-B Z-code (LearnAimRef)                                                 | 5     | funding      | UNVERIFIED   |
| 7   | 2026/27 HRSType codes                                                           | 5     | funding      | UNVERIFIED   |
| 8   | AI logs as attendance evidence?                                                 | 5     | funding      | UNVERIFIED   |
| 9   | AI time claimable? (claimable_glh decision)                                     | 5     | funding      | UNVERIFIED   |
| 10  | GLA ASF Assurance Framework conformance                                         | 5     | funding      | UNVERIFIED   |
| 11  | `VOICE_TTS_ENABLED` / `VOICE_STT_ENABLED` env                                   | 7     | ops          | config       |
| 12  | GCP credentials with TTS/STT enabled                                            | 7     | ops          | config       |
| 13  | europe-west4 audio data-residency vs EU commitment                              | 7     | governance   | UNVERIFIED   |
| 14  | Placement calibration 18/20, zero over-assignments                              | 8     | DELTA        | QA           |
| 15  | Scenario schema language set still on old MVP (so/fa/zh) — realign to ar/yue/tr | 8     | dev          | content/code |

---

## 3. Scenario authoring spec

**Target: 8 MVP scenarios × English + 3 L1s (ar / yue / tr).** English is
authoritative; L1s are for vocab glosses, cultural notes and the warm
opener/closer.

> ⚠ **Language-set mismatch (register #15):** the scenario JSON schema
> (`scenario.interface.ts`) and validator still require the OLD MVP set
> `ar / so / fa / zh`. Phase 0 realigned the platform to `ar / yue / tr`.
> Before authoring translations, realign the scenario schema +
> validator + `adaptScenario` + `scenarioLoader` to `ar / yue / tr` so
> the authored content targets the right languages. (Code task, ~½ day.)

Per-scenario authoring checklist (each must clear the validator):

- [ ] `title` in all MVP languages, non-empty
- [ ] `vocabulary_set` ≥ 20 items, each with all L1 translations + an
      English definition + example sentence + `reinforcement_weight`
- [ ] `grammar_targets` (3–5), level-appropriate
- [ ] `roleplay_prompt_en` (2–4 sentences)
- [ ] `micro_stages` — exactly 4 (F25; already drafted for s1–s4)
- [ ] `cultural_notes` in all MVP languages
- [ ] `pass_threshold` ∈ [0.6, 0.9]
- [ ] `authoring` block stamped with translator + ESOL reviewer + date

Current state:

| Scenario                | English      | micro_stages | Translations | Vocab ≥20 |
| ----------------------- | ------------ | ------------ | ------------ | --------- |
| s1_gp_appointment       | stub (TODOs) | ✅           | ✗            | ✗ (2)     |
| s2_payslip              | partial      | ✅           | ✗            | ✗         |
| s3_housing_rights       | partial      | ✅           | ✗            | ✗         |
| s4_pay_rise_negotiation | ✅ (L2)      | ✅           | ✗            | ~20 (en)  |
| s5–s8 (new)             | ✗            | ✗            | ✗            | ✗         |

The 4 new scenarios (s5–s8) should cover the remaining high-frequency
UK-life domains, e.g.: registering with a school / parents' evening;
a job interview; a benefits / Universal Credit conversation; calling
111 / pharmacy. Final selection is the DELTA practitioner's call.

**Do not fabricate L1 translations.** They are the native-review pass —
fabricated Arabic/Cantonese/Turkish would defeat the sign-off.

---

## 4. Placement calibration protocol

**Acceptance bar (brief):** **18/20** correct level assignments, or
**one-below** (never over-assign), and **ZERO over-assignments** before
any real learner is placed.

Placement is Gemini-scored, so calibration is a **staging exercise**, not
a unit test:

1. The DELTA practitioner authors **20 labelled personas** — answer-sets
   spanning E1–L2 with an expert-assigned true level.
2. Run each through `POST /esol/placement/*` in staging.
3. Record assigned vs true level. Pass requires:
   - ≥ 18/20 exactly correct, AND
   - every miss is **one level BELOW** the true level (conservative),
   - **0** assignments ABOVE true level (an over-placement sets a
     learner up to fail and mis-claims funding).
4. If it fails: tune `placement-questions.json` weights /
   `system_prompt_spec` placement calibration, re-run. Do not soften the
   bar.

Over-placement is the cardinal sin: a learner placed too high churns and
the org claims hours against an aim the learner can't achieve.

---

## 5. Go-live decision

Ship is permitted when:

- [ ] All §1 sign-offs signed by the named humans.
- [ ] Register §2 items 1–5, 14 closed; 6–10, 13 confirmed by funding /
      governance.
- [ ] §3: 8 scenarios authored + ESOL-reviewed + validator-clean.
- [ ] §4: calibration passed (18/20, zero over-assignments).
- [ ] Voice (§2 items 11–13) — optional at launch; safe to stay dark.

Until then the platform runs **fail-safe**: AI achievement withheld from
the ILR, AI hours out of claims, voice off, safeguarding independent of
the AI. Nothing in the open list can produce an unsafe or
over-claiming state — it only gates _enabling_ more.
