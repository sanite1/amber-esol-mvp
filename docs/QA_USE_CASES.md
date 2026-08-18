# Amber ESOL — Use-Case & Test Guide (AI Tutor build, F22–F31)

How to create a test learner, what to click, and how to verify every
change made in the phased build (Phases 0–8) plus the three frontend
gap-closures (claimable GLH, evidence chain, learner goals).

Conventions: **UI** = click-through test · **API** = curl/Postman · **DB**
= Mongo query. Backend base URL assumed `http://localhost:8080/api`,
frontend `http://localhost:3000`.

---

## 0. One-time setup

```bash
# 1. Backend (terminal A) — API + BullMQ workers run IN THE SAME PROCESS in dev
cd amber-esol-backend
npm install
npm run seed:curriculum     # REQUIRED — seeds CurriculumLevel (levels, L1 ratios,
                            # retention encounters, long-horizon forms, RARPA objectives)
npm run seed:qa             # creates one account per role + a demo AI session
npm run dev                 # API on :4000 — ALSO attaches all 9 workers in-process

# 2. Frontend (terminal B)
cd amber-esol-mvp
npm install
npm start                   # app on :3000
```

**Only two terminals.** `npm run dev` already runs the queue workers
inline (see `src/index.ts` "Inline BullMQ workers in dev"). `npm run
workers:dev` is the PRODUCTION shape (standalone worker process) — do NOT
also run it locally, or you double-attach workers and double Redis usage.

Needs **MongoDB** + **Redis** running. If Redis is unavailable the API
still serves (degraded mode), but queue jobs no-op — and the
**evidence-chain capture won't run**. For full local testing point at a
local Redis in `.env`: `REDIS_URL=redis://127.0.0.1:6379` (`brew install
redis && redis-server`).

### Accounts from `npm run seed:qa` (password for all: `TestPass1!`)

| Role            | Email                          |
| --------------- | ------------------------------ |
| Amber admin     | `seed-qa-admin@example.com`    |
| **Org admin**   | `seed-qa-orgadmin@example.com` |
| Teacher (tutor) | `seed-qa-teacher@example.com`  |
| **Learner**     | `seed-qa-learner@example.com`  |

You'll mostly use **Org admin** (compliance/funding views) and **Learner**
(the tutor experience).

### Faster / cleaner learner provisioning

```bash
cd amber-esol-backend
# Placed learner at E2 (default): testlearner@example.org / TestLearner123!
npx ts-node src/scripts/createTestLearner.ts

# FRESH learner (no level → forced through placement; wipes prior attempts):
TEST_LEARNER_EMAIL=fresh@example.org TEST_LEARNER_LEVEL=fresh \
  npx ts-node src/scripts/createTestLearner.ts

# A learner at a specific level (e1|e2|e3|l1|l2):
TEST_LEARNER_EMAIL=ar@example.org TEST_LEARNER_LEVEL=e1 \
  npx ts-node src/scripts/createTestLearner.ts
```

### The "real" learner-creation chain (for testing onboarding itself)

1. Log in as **Org admin** → **Invitations** → create an invite (generates a
   referral token / link).
2. Open the join link `/join?token=…` (incognito) → **Join wizard**:
   Welcome → Personal details (**pick L1 language here**) → Eligibility →
   ULN → Complete.
3. First login → **Placement assessment** (`/esol/placement`) → sets
   `esolLevel` + Stage 3 objectives.

---

## 1. MVP languages — Arabic / Cantonese / Turkish / English (Phase 0)

**Use case:** a Cantonese speaker joins and only the 4 MVP languages are offered.

- **UI:** open `/join?token=…` → Personal details step → open the language
  selector. **Expect exactly four options:** English, العربية (Arabic),
  粵語 (Cantonese), Türkçe (Turkish). The old set (Somali/Dari/Pashto) must
  NOT appear. Pick 粵語 → finish wizard.
- Switch UI language any time: the picker writes `localStorage.esol_lang`.
  Pick Arabic → the session/placement screens flip to **RTL**.
- **DB check:** `db.users.findOne({email:…},{l1Language:1})` → `"cantonese"`.
- **Why:** the realignment (en/ar/yue/tr; Cantonese canonical code `yue`)
  drives copy banks, voice locales, and safeguarding language mapping.

---

## 2. The three-beat session — PREPARE → ROLEPLAY → COMPLETE (Phases 3 + 6)

This is the headline learner experience. Log in as the **learner**.

### 2a. Journey map + PREPARE screen

- Sidebar → **AI Tutor** (`/esol/scenarios`).
- **Journey map** (top): scenarios shown as a numbered path ending in a dark
  **destination card** ("B2-ready · CEFR B2 · about 14 weeks"). The
  destination changes with the learner's level.
- Click a scenario (journey step or picker card) → lands on **PREPARE**
  (`/esol/prepare/s1_gp_appointment`), NOT straight into chat. Shows the
  situation, UK context, ~minutes, and the **4 micro-stages**.
- Press **Begin roleplay** → enters the live session.

### 2b. ROLEPLAY — 4-dot progress + soft cap

- Under the header, four **progress dots**; the current one pulses. Type a
  reply, press **Send** (or Enter). As the tutor advances micro-stages, dots
  fill left→right. Label reads "Step n of 4".
- Keep chatting past the level's cap (E1 15 min … L2 30 min) → a gentle
  **wrap-up banner** appears with "End & review" + a dismiss (×). It never
  blocks typing.
- **API (drive a turn directly):**
  ```bash
  curl -s -X POST localhost:8080/api/esol/session/turn \
    -H "Authorization: Bearer <LEARNER_JWT>" -H "Content-Type: application/json" \
    -d '{"session_id":"<ID>","message":"Hello, I would like to book an appointment"}'
  ```
  Response now includes `beat`, `micro_stage_index`, `micro_stages_completed`,
  `mode`.

### 2c. COMPLETE — chime

- Finish the scenario (tutor sets `session_complete`, or press **End &
  review session →**). You land on the **celebration panel** (score, words
  learned, tutor's note) and hear a **warm 3-note chime** (unless your OS has
  _reduce motion_ on, or audio is blocked — then it's silent by design).

> Note: the 4-dot indicator only fills if the AI returns `microStageComplete`
> per turn. With a real Gemini key the model drives it; without one the turn
> serves the safe ANCHOR fallback and dots stay put — that's expected.

---

## 3. Bridge-Method mode controller — ANCHOR / BRIDGE / IMMERSION (Phase 3, F26)

**Use case:** the platform (not the AI) drops to ANCHOR when a learner struggles.

- **Trigger ANCHOR:** in a session, send a very short reply (`"yes ok"`,
  < 5 words) OR a confusion phrase (`"I don't understand"`, `"لا أفهم"`,
  `"我唔明"`, `"anlamıyorum"`). The next turn operates in **anchor** (more L1,
  lower demand); confusion also unlocks full L1 ("distress override").
- **Trigger IMMERSION:** send 3 consecutive strong, on-topic answers (no
  anchor triggered) → mode steps up to **immersion**.
- **How to test the decision (no Gemini needed) — backend unit:**
  ```bash
  cd amber-esol-backend && npx jest --runInBand src/__tests__/modeController.test.ts
  ```
- **DB check after a live session:**
  `db.aisessions.findOne({_id:…},{teaching_mode_sequence:1,sessionMode:1})`
  → the recorded mode is the **more-supportive** of the controller's and the
  AI's (anchor wins ties).
- Thresholds are config-driven: seed a `bridge-mode` ComplianceConfig to
  override; otherwise the brief defaults apply.

---

## 4. Vocabulary reinforcement + long-horizon forms (Phase 4, F27)

**Use case:** the tutor re-surfaces the words a learner is most due to revisit.

- Complete a few sessions as the learner so vocab accrues (workers must be
  running for the ledger to fill).
- **UI:** sidebar → **Vocabulary** (`/esol/vocab`) → see retained vs
  in-progress words.
- **What changed:** Layer 5 now feeds the AI the 6 **most-due** un-retained
  words (least-encountered, oldest-seen) — not the most-recent. Retention
  flips after the level's `retentionEncounters.min` (from CurriculumLevel),
  not a hard-coded 5.
- **Long-horizon forms** (3SG-s, articles, inversion) are recycled, never
  failed — they're injected into the prompt as "recast, don't penalise".
- **DB check:** `db.vocabledgers.find({learnerId:…}).sort({times_encountered:1})`
  — the in-progress words shown match the reinforcement order.
- **Unit:** `npx jest --runInBand src/__tests__/vocabLedger.test.ts`

---

## 5. Stage 3 goals — curriculum objectives + L1 negotiation + "My Goals" (Phase 4 + gap 3, F30)

**Use case:** a learner reviews and agrees their goals in their own language.

1. Create a **fresh** learner (`TEST_LEARNER_LEVEL=fresh`) and complete
   placement → objectives are written from the **curriculum bank** (level
   can-do statements), and a system negotiation record is logged.
2. Log in as that learner → sidebar → **My Goals** (`/esol/goals`).
   - Top card: the warm **"these are your goals — do you agree?"** message in
     the learner's L1 (Arabic shows RTL).
   - The objectives are listed 1..n.
   - Optionally type a note → press **"These goals look right"**.
   - The card flips to a green **"You've agreed these goals"** confirmation.

- **API:**
  ```bash
  curl -s localhost:8080/api/esol/session/goals -H "Authorization: Bearer <LEARNER_JWT>"
  # → { objectives, negotiation_script, l1_language, agreed_at }
  curl -s -X POST localhost:8080/api/esol/session/goals/agree \
    -H "Authorization: Bearer <LEARNER_JWT>" -H "Content-Type: application/json" \
    -d '{"note":"I also want phone calls"}'
  ```
- **DB / evidence:** `db.auditlogs.find({learner_id:…, action:"rarpa_stage3_negotiated"})`
  — you'll see the system-presented record (placement) AND the learner's
  `actor_type:"learner"` agreement.
- **Unit:** `npx jest --runInBand src/__tests__/stage3Objectives.test.ts`

---

## 6. Evidence chain + Evidence Chain tab (Phase 5 + gap 2, F29)

**Use case:** an org admin sees what evidence exists and what still needs human sign-off.

1. As the learner, complete at least one AI session (workers running, so the
   `capture-evidence` job writes records).
2. Log in as **Org admin** → **Learners** → click the learner → **Evidence
   Chain** tab.
   - Records grouped by beat (Beat 2 — Roleplay, Beat 3 — Complete…), each row
     shows the **RARPA stage**, **ILR fields**, **count**, and a status:
     **Formative** / **Confirmed** / **Needs sign-off (x/y)**.
   - Header badges: "_N captured_" and "_N awaiting human sign-off_".
   - `turn_score` rows carry **Needs sign-off** (the honesty gate — AI
     self-scores are formative until a human confirms at Stage 5).

- **DB check:** `db.evidence_records.find({learnerId:…}).pretty()` — append-only;
  `human_confirm`/`human_confirmed` flags present.
- **Unit:** `npx jest --runInBand src/__tests__/evidenceChain.test.ts src/__tests__/evidenceMapping.test.ts`

---

## 7. Honesty gate — AI pass never auto-exports as achieved (Phase 5.1)

**Use case:** an AI-passed L2 learner is NOT exported as "achieved" until a human confirms.

- Set up a learner at `l2` with a passed session but NO confirmed Stage 5
  review.
- **API (org admin):** trigger an ILR export (org-admin export modal, or the
  export endpoint). In the output, that learner's row is **CompStatus 1
  (continuing), Outcome null**, with a suppression note "_Achievement withheld
  (honesty gate)_".
- Then create a confirmed `Stage5Review` (`org_admin_confirmed_at` set) for
  that level → re-export → row becomes **CompStatus 2, Outcome 1 (achieved)**.
- **Unit (proves both halves):**
  `npx jest --runInBand src/__tests__/ilrExport.test.ts` (cases I6a withheld /
  I6b confirmed).

---

## 8. Hours — claimable vs total GLH (Phase 5.3 + gap 1)

**Use case:** an org admin sees claim-driving hours separately from total (AI excluded).

- **Per-learner UI:** Org admin → learner → **Overview** tab → metric cards now
  include **Total GLH** ("includes AI time") **and Claimable GLH** ("excludes
  AI time"), alongside AI tutor hours + Teacher contact.
- **Org-wide UI (Amber admin):** **GLH Analytics** page → summary cards now
  include a **Claimable GLH** card next to Total GLH + AI tutor GLH.
- **What to verify:** for a learner with only AI sessions, **Claimable GLH = 0**
  while Total GLH > 0. Add a teacher review (teacher-contact hours) → claimable
  rises by that amount, total rises too, AI stays out of claimable.
- **Also fixed:** teacher-contact hours are counted **once per learner** in the
  ILR export (previously multiplied across every session row).
- **Unit:** `npx jest --runInBand src/__tests__/ilrGlh.test.ts` (asserts
  `claimable_glh = pre_platform + teacher_contact`).

---

## 9. Voice — Listen (TTS) + opt-in mic (STT) (Phase 7, F28)

**Off by default.** To test it live you must enable it + have GCP creds.

```bash
# backend .env
VOICE_TTS_ENABLED=true
VOICE_STT_ENABLED=true          # opt-in; leave unset to test TTS-only
GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcp-sa.json   # TTS+STT enabled on the project
VOICE_LOCATION=europe-west4
```

- **TTS (Listen):** in a session, each Amber bubble shows a **Listen** button →
  press it → the line plays (loading spinner → audio). Cached phrases replay
  instantly.
- **STT (mic):** a **mic button** appears in the input row only when
  `VOICE_STT_ENABLED=true`. Press it → record → stop → the transcript drops
  into the textbox. **Tap-to-type always works**; deny mic permission and it
  silently falls back.
- **Capability probe:** `GET /api/esol/session/voice-capabilities` →
  `{tts,stt,location}`; the UI shows controls per these flags.
- **With voice OFF (default):** no Listen button, no mic — and `POST /tts`
  returns `{available:false}`. That's the safe state.
- **Unit (degradation, no GCP):** `npx jest --runInBand src/__tests__/voice.test.ts`
- ⚠ Confirm europe-west4 data-residency before enabling in production
  (see `PHASE8_GO_LIVE_SIGNOFFS_AND_CONTENT.md`).

---

## 10. Safeguarding — independent of the AI (Phase 1)

**Use case:** a disclosure is caught and routed to the DSL even if the AI fails.

- In a session, type a trigger phrase (English or L1, e.g. `"I want to hurt
myself"`). Instead of a normal reply you get the **pre-cached safeguarding
  message** in the learner's language + a "Take a break" CTA; the input goes
  read-only on resume.
- **DB check:** `db.safeguardingalerts.find({learnerId:…})` — an immutable
  alert exists; raw text is encrypted (`rawInputEncrypted`) if
  `SAFEGUARDING_ENCRYPTION_KEY` is set, else kept in the append-only TurnLog.
  `db.auditlogs.find({action:"safeguarding_alert_raised"})`.
- This path runs **before** Gemini and never depends on it.
- **Unit:** `npx jest --runInBand src/__tests__/safeguarding.test.ts src/__tests__/safeguardingDetectorLang.test.ts`

---

## Quick smoke sequence (10 minutes)

1. `seed:curriculum` + `seed:qa`; start API + workers + FE.
2. Login **learner** → AI Tutor → see journey map + destination → open a
   scenario → PREPARE → Begin → send a few turns (watch dots) → trigger a
   short reply (ANCHOR) → End & review (chime).
3. **My Goals** → agree goals.
4. Login **org admin** → that learner → **Overview** (Total vs Claimable GLH)
   → **Evidence Chain** tab (captured + needs-sign-off).
5. Optional: enable voice env → Listen button + mic.
6. Run the unit suites listed per section for the deterministic checks.
