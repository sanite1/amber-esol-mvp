# Project Silk — AI Tutor Layer: Audit & Phased Build Plan

_Audited 2026-06-17 against eight new artefacts. Repos: `amber-esol-backend` (Express/TS/Mongo) + `amber-esol-mvp` (React/TS). This plan covers the **AI tutor layer (F22–F31)** plus the curriculum, evidence-mapping and advice-guardrail specs — it sits on top of the F18–F21 teacher-multiplier work already audited in `ADDENDUM_AUDIT_AND_TEST_PLAN.md`._

## Source artefacts (the spec)

| File                                      | What it locks down                                                                                                                                       |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Project_Silk_AI_Tutor_Brief.docx`        | Learner, SDT/Flow/i+1 framework, 8 MVP scenarios, three-beat arc, journey, multimodal balance, six-layer prompt, per-turn JSON, voice, build sequence    |
| `Project_Silk_ESOL_Framework.docx`        | Pedagogy + funding (ASF/RARPA/ILR) + Ofsted (Nov-2025 framework) foundation; Bridge Method; RARPA Stage 3 bank; honesty flag; 11 expert-review questions |
| `Project_Silk_Technical_Build_Brief.docx` | **The build spec — F22–F31**, data models, build order, two overriding constraints                                                                       |
| `system_prompt_spec.json`                 | Exact Layer 2 (hard rules) + Layer 3 (per-level calibration) prompt text                                                                                 |
| `esol_curriculum.json`                    | Per-level can-do, grammar, vocab sizes, L1 ratios, mode triggers, retention, RARPA objective bank, scenario library plan (~40)                           |
| `evidence_mapping.json`                   | Per-beat data-point → ILR field → RARPA stage map, with `human_confirm` flags                                                                            |
| `Silk Advice Guardrail Addendum.pdf`      | **New constraint:** Amber rehearses the _language_ of an interaction, never gives medical/legal/housing/financial/immigration advice                     |
| `Silk_Engagement_Flows.pptx`              | Multimodal balance (voice-led, text-anchored, visual-context, sound-accent); journey; asks for an emotional-attunement signal alongside `turn_score`     |

## Two constraints that override everything (Build Brief §0)

1. **Safeguarding is binary and existential.** Independent of the AI, never lost in a malformed response, every flag reaches a named DSL with an immutable log. Build first, build to never silently fail.
2. **Hours are not the basis of the funding claim.** No national rule maps AI time → GLH. Store the three hour components separately; never sum AI time into a claim-driving GLH value until the GLA funding-assurance opinion confirms it.

---

# Part A — Audit (current build vs the spec)

Headline: the platform already has strong bones — a layered Gemini prompt, a mode system, an _independent_ safeguarding detector, a 20-question adaptive placement, a vocab ledger, RARPA/ILR/evidence plumbing, and the whole F18–F21 teacher layer. But it diverges from the new specs in structure and is **missing whole subsystems** (three-beat engine, voice, journey map, advice guardrail, curriculum data model). Three findings are **stop-the-line**.

### 🔴 Stop-the-line findings

1. **Honesty gate not enforced at the funding boundary (F29).** ILR export sets `Outcome=1` (achieved) off the AI-driven `session.passed` flag with **no human-confirmation check** — `teacherConfirmed` doesn't exist; the export never queries `Stage5Review.org_admin_confirmed_at`. The spec's central audit-defensibility rule ("no AI record exports as achieved until a human sets it true") is **violated in live code**. Evidence: `ilrExport.service.ts:569–592`.
2. **Safeguarding patterns only seeded for English (F22).** The keyword file holds 23 English patterns; **Turkish and Cantonese — both named MVP languages — have zero patterns**, and a `tr`/`yue` learner silently falls back to English detection. For a binary inspection judgement this is a real exposure. Evidence: `safeguarding-keywords.json`, `safeguardingDetector.service.ts:127`.
3. **Safeguarding failures degrade silently (F22).** If the alert enqueue or log write fails (Redis down / quota), the code `.catch → logger.error → continues` and the learner still gets a reply — a _dropped_ safeguarding event with no loud escalation. Spec: a dropped event is an inspection failure. Evidence: `aiSession.service.ts:386–390, 459–464`.

### Per-subsystem status

**F22 Safeguarding — mostly DONE, 3 gaps**

- ✅ Detection runs on raw input _before_ Gemini, independent (`aiSession.service.ts:551–606`); named-DSL email via queue with a 5s SLA; `safeguarding_flag` correctly not leaked to the learner UI.
- ⚠️ Languages: only `en` keyword patterns seeded — **`tr`/`yue` missing** (message bank has en/ar/so/fa/zh; keyword bank has en only).
- ⚠️ `SafeguardingAlert` is mutable (status/reviewedAt updatable) — not append-only; `TurnLog` _is_ append-only but stores raw disclosure text **in plaintext** (spec wants encrypted-at-rest).
- ⚠️ No loud escalation on alert/log write failure.

**F23/F24 System prompt + per-turn contract — PARTIAL drift**

- ✅ Six-layer builder exists (`promptAssembly.service.ts`), layers 1–4,6 cached + Layer 5 fresh; recast rule present; retry-once on transient error.
- ⚠️ Layer 2/3 text is hand-authored `.md` with TODOs — **not sourced from the provided `system_prompt_spec.json`** (spec: use the exact text, don't paraphrase).
- ⚠️ Per-turn JSON has `reply, mode, skill_codes_used, turn_score, vocabulary_items_used, session_complete, session_summary` **+ `safeguarding_flag`** (spec: remove it). **Missing `replyLang`, `microStageComplete`, `recastApplied`**.
- ⚠️ On final parse/validate failure it throws a 502 — **no safe ANCHOR fallback reply** (spec: never show a broken turn).
- ⚠️ "Intelligibility not nativeness" + developmental-forms tolerance (3SG-s, articles, inversion) absent from prompt text.
- 🔴 **Advice guardrail entirely missing** (new PDF addendum) — no refusal/redirect for medical/legal/housing/financial/immigration questions.

**F25/F26 Scenario engine + Bridge mode — big gaps**

- ✅ ANCHOR/BRIDGE/IMMERSION mode concept exists and is tested.
- 🔴 **No three-beat arc** (PREPARE/ROLEPLAY/COMPLETE) — flat chat loop.
- 🔴 **No four micro-stages / four-dot UI.**
- ⚠️ Mode is decided _inside_ Gemini via prompt text; no external observable-signal controller; thresholds hard-coded (0.40/0.80/3-turn) not `ComplianceConfig`.
- ⚠️ Only **5 scenarios** (spec MVP = 8); missing _introducing yourself, register child at school, open bank account_; one extra (_pay-rise negotiation_) not in MVP. **All non-English translations are empty strings.**
- ⚠️ Scenario schema lacks `functionalArea, coreCurriculumCodes, isMvp, microStages`; `passThreshold` uniform 0.7 (spec: 0.70 E1–E3 / 0.75 L1–L2); title langs are en/ar/so/fa/zh not en/ar/yue/tr.

**F27/F30 Curriculum + vocab + placement — mixed**

- 🔴 **No `CurriculumLevel` collection** — curriculum lives as `.md` prose with TODOs; the provided `esol_curriculum.json` is exactly what should seed it.
- ⚠️ Vocab ledger has the right fields but retention threshold is hard-coded 5 (spec: per-level 8–14); `getReinforcementTargets()` is correct **but not called** — the session uses a legacy stub sorted by `introducedAt` (wrong "due-ness"). Real bug — reinforcement isn't actually feeding the prompt correctly.
- ✅ Placement: 20-question adaptive, Gemini-scored, confidence-downshift for zero over-assignment — **spec-compliant**.
- ⚠️ Stage 3 objectives are auto-assigned from **template strings**, not the curriculum bank, and **never negotiated** with the learner as a recorded interaction (RARPA requires evidenced negotiation).
- 🔴 Long-horizon (developmentally-late) form handling absent.

**F29 Evidence + honesty gate + hours — critical**

- ⚠️ Per-turn evidence is captured (`turn_scores`, `teaching_mode_sequence`, `stage3_objective_ids`, full Gemini output) but the **beat→RARPA→ILR mapping is implicit/report-time**, not structured per `evidence_mapping.json`.
- 🔴 **Honesty gate not enforced** (see stop-the-line #1).
- ⚠️ Hours: three components stored separately, but the row builder **double-counts** `teacher_contact_glh` across a learner's sessions and sums into the claim-driving `AddHours` (known Phase-14.1 issue + contradicts "never sum into claim").
- ✅ Skill codes map to Core Curriculum element codes (no level suffix — cosmetic); learner self-assessment captured; ILR rules read from `ComplianceConfig` (RARPA thresholds not yet).

**F28/F31 Frontend + voice + languages — large gaps**

- Screens: ✅ Welcome/lang-select, ✅ live transcript, ✅ Complete panel (score/vocab/emoji — **no chime**), ✅ Teacher message. 🔴 **No journey map** (no visible destination), **no PREPARE screen**, **no four-dot ROLEPLAY**, **no scenario image**, **no tap-to-speak mic**.
- 🔴 **Voice 0%** — no TTS out, no STT in, no endpoints.
- 🔴 **Language mismatch:** current build targets `ar/so/fa(Dari)/ps/yue/zh/bn/ur`; spec MVP is `ar/yue/tr/en`. **Turkish absent from the session copy bank** (would break a `tr` session); Cantonese maps to a generic `zh` bank.
- ✅ No-blue brand, font-size toggle, RTL, no points/streaks/XP. ⚠️ Session length caps display-only (not enforced); 375px/axe not formally tested.

### Strategic mismatch to resolve first — the language set

The current build invested in the **resettlement** language set (Arabic, Somali, Dari, Pashto, later Bengali/Urdu). The new AI Tutor Brief §3 locks MVP to **Arabic · Cantonese · Turkish · English** — Turkish because the launch territory is Enfield/Haringey — and explicitly **defers** Somali/Dari/Pashto (no premium neural TTS) and Bengali (revenue-triggered, needs a Sylheti test). This isn't a bug, it's a product decision that changes scope across safeguarding patterns, scenario translations, the copy bank and voice. **It must be decided before Phase 0.**

---

# Part B — Phased build plan

Sequenced by the Build Brief's dependency order (safeguarding first; data models before features; engine before frontend), with the frontend able to run in parallel from Phase 4. Every phase is **config-driven** so the DELTA / funding / safeguarding sign-offs can land in parallel without blocking the build (Build Brief §8.4).

### Phase 0 — Decisions, data foundation & language realignment

**Goal:** unblock everything; make the curriculum and scenarios _data_, not prose.

- **Decide the language set** (see above) — this scopes every later phase.
- Build `CurriculumLevel` collection + seeder from `esol_curriculum.json` (read-only, versioned); one doc per level with can-do, grammar (+`longHorizon`), vocab sizes, `bridgeL1Ratio`, mode, `retention_encounters`, full RARPA objective bank.
- Extend `Scenario` schema/collection (or seeded JSON) to spec: `functionalArea, title{en,ar,yue,tr}, coreCurriculumCodes, isMvp, vocabularySet[{word,lemma,l1Gloss{…}}], microStages[1..4], passThreshold(level-aware), culturalNotes, version`.
- Realign language config (`copy.ts` `BankLang`, `LANG_TO_BANK`, scenario title/translation keys, safeguarding banks) to the chosen set; add **Turkish**; quarantine deferred languages behind a flag rather than deleting (revenue-triggered revival).
- Drop `system_prompt_spec.json` into the repo as the **source of truth** for Layers 2 & 3.

### Phase 1 — Safeguarding hardening (F22) — _do first, it's existential_

**Goal:** close the three stop-the-line safeguarding gaps.

- Author + seed **Turkish and Cantonese** keyword/regex patterns (DELTA/community-speaker review); make the per-language bank a config collection the safeguarding lead can edit (the CMS shipped earlier can be extended).
- **Loud escalation:** on alert-enqueue or log-write failure, enqueue an `admin_job_failure` (priority 1) and surface on the admin channel — never silent-continue.
- Make `SafeguardingAlert` append-only (status transitions as new linked records, or a separate immutable audit row) and **encrypt the raw disclosure at rest** (the codebase already has `cryptr` for MIS creds).
- Safeguarding-lead sign-off on pattern list, SLA, referral-log standard (Build Brief §2 flag).

### Phase 2 — AI core: prompt builder, contract & the advice guardrail (F23/F24 + PDF addendum)

**Goal:** make the per-turn brain match the spec exactly and add the new guardrail.

- Re-point Layers 2 & 3 to the **exact text** of `system_prompt_spec.json` (no paraphrase); add intelligibility + developmental-forms rules.
- Add the **advice guardrail** to the top of Layer 2 (core principle + redirect-in-L1 behaviour) and as a per-turn behaviour in F24; add the allowed/not-allowed authoring gate to scenario authoring; extend DELTA review to content accuracy (PDF "definition of done").
- Update the per-turn JSON contract: add `replyLang`, `microStageComplete`, `recastApplied`; **remove `safeguarding_flag`** (detection is F22); keep snake/camel consistent with the codebase.
- Defensive parse → retry once → **safe ANCHOR fallback reply** + log; never surface a broken turn.
- (Engagement deck ask) add an **emotional-attunement signal** alongside `turn_score` in the schema for the re-engagement layer.

### Phase 3 — Scenario engine + mode controller (F25/F26)

**Goal:** the three-beat arc and the real Bridge controller.

- Implement the **three-beat state machine** (PREPARE → ROLEPLAY[4 micro-stages] → COMPLETE) in the session service; drive `microStageComplete` from the AI contract; **no gating** (hybrid-adaptive: weak attempt → recast + advance; no attempt → ANCHOR).
- Externalise the **mode controller**: observable-signal driven, ratios from `CurriculumLevel.bridgeL1Ratio`, thresholds in `ComplianceConfig` (not hard-coded); L1 always available for distress, overriding the ratio.
- Backfill scenario content to the **8 MVP scenarios** with `microStages` and level-aware `passThreshold`.

### Phase 4 — Curriculum-driven vocab, placement negotiation, long-horizon forms (F27/F30)

**Goal:** wire the curriculum data into learning + fix the reinforcement bug.

- Call `getReinforcementTargets()` (the correct 6-most-due selector) from Layer 5; retire the legacy `introducedAt` stub; read `retention_encounters` per level from `CurriculumLevel`.
- Draw Stage 3 objectives from the **curriculum bank** (not templates); add a **recorded negotiation interaction** (in L1) on placement, audited as RARPA Stage 3 evidence.
- Flag developmentally-late forms `longHorizon` and exclude them from "failed learning" counting.

### Phase 5 — Evidence chain + honesty gate + hours (F29) — _the compliance core_

**Goal:** make the evidence audit-defensible. **Highest funding priority.**

- **Enforce the honesty gate in code:** add `teacherConfirmed` (default false); the ILR export must refuse `Outcome=1`/achieved unless the human sign-off (`Stage5Review.org_admin_confirmed_at` / F21 path) is set. This is the stop-the-line fix.
- Write **structured per-beat evidence records** mapping data-point → RARPA stage → ILR field per `evidence_mapping.json` (capture-time, not report-time), carrying the `human_confirm` flag.
- Fix the **hours double-count**; keep the three components separate; keep AI time out of any claim-driving sum until the GLA opinion lands; read RARPA thresholds from `ComplianceConfig`.

### Phase 6 — Learner frontend experience (F31) — _parallelisable from Phase 3_

**Goal:** the six screens at launch.

- **Journey map** with a curated 3–4 level-appropriate scenario set and a visible destination ("B2-ready in ~14 weeks").
- **PREPARE** screen; **ROLEPLAY** with four dot indicators + real scenario image + live transcript; **COMPLETE** with a warm chime (Web Audio).
- Turkish copy bank; RTL parity check; 375px + axe pass; enforce session-length caps by level.

### Phase 7 — Voice (F28)

**Goal:** voice-led delivery.

- **TTS out (universal):** Google Cloud TTS Neural2/WaveNet per language, server-side, streamed, cached for recurring phrases (Beat-1 primers, completion lines).
- **STT in (opt-in, default OFF):** Google Cloud STT Chirp 2, forgiving config, tap-to-type fallback always present, never pass/fail.
- Confirm audio data-residency in europe-west4 against the EU commitment before production.

### Phase 8 — Content, calibration & expert sign-offs (runs alongside)

- Author 8 MVP scenarios × 3 languages (Claude Code) → one ESOL-practitioner review pass; apply the advice-guardrail authoring gate.
- **Placement calibration:** 18/20 or one-below, **zero over-assignments** before any real learner.
- Land the parallel sign-offs that gate _go-live_ (not build): **DELTA practitioner** (curriculum, ratios, recast balance, long-horizon forms, content accuracy), **funding-assurance specialist** (the 11 ILR/RARPA/GLA questions incl. the Category-B Z-code + 2026/27 Hours Record HRSType codes — both currently UNVERIFIED), **safeguarding lead** (patterns/SLA/referral standard).

---

## Sequencing at a glance

```
Phase 0 (decisions + data) ─┬─> Phase 1 (safeguarding) ─> Phase 2 (AI core+guardrail) ─> Phase 3 (engine) ─┐
                            │                                                                              ├─> Phase 5 (evidence/honesty/hours)
                            └─> Phase 4 (curriculum/vocab/placement) ───────────────────────────────────────┘
Phase 6 (frontend) parallel from Phase 3 · Phase 7 (voice) after Phase 6 · Phase 8 (content+sign-offs) throughout
```

## Open decisions for the user

1. **Language set** — adopt the new MVP (Arabic/Cantonese/Turkish/English) and shelve Somali/Dari/Pashto/Bengali/Urdu behind a flag? (Scopes everything.)
2. **Honesty gate** — fix now as a hotfix (it's a live funding-compliance exposure), or fold into Phase 5?
3. **Build vs. author split** — Claude Code authors all 8 scenarios × 3 languages, then a single ESOL-practitioner review pass?
4. **Governance files** (separate email) — set up `CLAUDE.md` working-standards + `MEMORY.md` in both repos (with the r.jina.ai rule scoped to public URLs only)?
