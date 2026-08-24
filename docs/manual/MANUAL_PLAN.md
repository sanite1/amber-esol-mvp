# Amber ESOL — User Manual: Plan & System Inventory

_The working plan for the module-by-module user manual. Companion to the
build brief, but written for **people using the platform**, not people
building it. Authored 2026-08-02._

---

## 1. What we're producing

A complete, screenshot-rich user guide, one chapter per module:

| #   | Chapter                  | File                    | Audience                                                                        |
| --- | ------------------------ | ----------------------- | ------------------------------------------------------------------------------- |
| 0   | Getting started (shared) | `00-getting-started.md` | everyone                                                                        |
| 1   | Amber Admin              | `01-amber-admin.md`     | platform staff                                                                  |
| 2   | Org Admin                | `02-org-admin.md`       | provider admins (council / college / charity)                                   |
| 3   | Teacher                  | `03-teacher.md`         | ESOL teachers                                                                   |
| 4   | Learner                  | `04-learner.md`         | adult ESOL learners _(written simplest — B1-readable English, short sentences)_ |

All chapters live in `docs/manual/`, images in
`docs/manual/images/<module>/`. Markdown is the source of truth;
we can export any chapter to Word/PDF for distribution at the end.

### Writing rules (apply to every chapter)

1. **Task-first, not feature-first.** Sections are named for what the
   person wants to do ("Invite a learner", "Export your ILR return"),
   not for the screen name.
2. **Every screen gets a screenshot** with numbered callouts referenced
   in the text ("① the priority queue…").
3. **Per-screen template** (used consistently):
   - _What this is for_ — one sentence.
   - _How to get here_ — sidebar path / URL.
   - _What you see_ — screenshot + callout walkthrough.
   - _Step-by-step_ — each action as a numbered recipe.
   - _Good to know_ — behind-the-scenes notes that matter to the user
     (e.g. "this is recorded in the audit log", "AI hours never count
     toward your funding claim").
   - _If something goes wrong_ — the 2–3 realistic failure modes.
4. **No developer vocabulary.** "The system records…" not "the backend
   writes an AuditLog row". Compliance terms (ILR, RARPA, GLH) ARE
   allowed for admin/teacher chapters — that's their language — but each
   gets a plain-English gloss on first use + a glossary entry.
5. **Learner chapter is special**: simplest English, more pictures,
   fewer words per step. Assume the reader is at E2–E3 level.

---

## 2. Screenshots — the capture pipeline

Screenshots must be **repeatable** (UI will keep changing) and
**consistent** (same viewport, same demo data). One-off manual
screenshots rot instantly.

**Approach: a Puppeteer capture harness**, checked into the repo:

```
docs/manual/capture/
  package.json          # puppeteer pinned, isolated from app deps
  capture.mjs           # the runner
  manifest.mjs          # ROLE → [{route, name, actions?, viewport?}]
```

- Logs in via the API with the `seed:qa` accounts (one per role),
  injects the token, walks the route manifest, saves
  `docs/manual/images/<module>/NN-<slug>.png` at a fixed 1440×900
  viewport (plus 390×844 mobile shots for key learner screens).
- `actions` hooks let a manifest entry click a tab / open a modal
  before shooting (needed for the learner-detail tabs, ILR export
  modal, exit-confirm modal, etc.).
- Re-running refreshes every image in one command → the manual stays
  current for free.

**Demo data prep (one-time, before capture):** `seed:demo` is currently
a stub, so screens would look empty. Before each module's capture run
we generate believable data with what exists:

1. `npm run seed:qa` (org + 4 role accounts, 1 demo session, teacher
   assignment, audit rows)
2. `createTestLearner.ts` ×3–4 at different levels (e1, e2, l1,
   "fresh") with varied names
3. Drive 2–3 real AI-tutor sessions as learners (Gemini is configured)
   so vocab, evidence chain, GLH, mode history, and dashboards populate
4. One safeguarding trigger + one Stage 5 review so those admin
   surfaces have content
5. Local Redis on, so the evidence chain fills

**Anonymity rule:** demo data only — never real learner names in any
screenshot.

---

## 3. Full system inventory (what each chapter must cover)

Grounded in `dashboard/routes.tsx` + the live sidebar config. Only
ACTIVE surfaces are listed (legacy marketplace nav that is commented
out is excluded). Nothing below may be skipped without a written
"excluded because…" note.

### Chapter 0 — Getting started (shared)

| Topic                  | Notes                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| What Amber is (1 page) | the three-sentence pitch + the four roles diagram                                             |
| Signing in / out       | `/login`, password rules, what each role sees on landing                                      |
| The dashboard shell    | sidebar, breadcrumb, profile card, mobile drawer                                              |
| Language & RTL         | the `esol_lang` picker, Arabic flips the layout                                               |
| Notifications & toasts | how the system talks to you                                                                   |
| Accessibility          | font-size toggle, keyboard, WCAG commitment                                                   |
| Glossary               | ILR, RARPA, ASF, GLH, ULN, DSL, Bridge Method, ANCHOR/BRIDGE/IMMERSION, Stage 1–6, E1–L2/CEFR |

### Chapter 1 — AMBER ADMIN (platform owner) — ~15 screens

| Surface               | Route                                 | Key tasks to document                                                    |
| --------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| Overview              | `/admin/overview`                     | platform-wide health read                                                |
| Organisations         | `/admin/orgs`                         | list, open an org                                                        |
| Org detail            | `/admin/orgs/:id`                     | org health, **MIS sync settings + test connection**, delta-sync outcomes |
| ESOL Teachers         | `/admin/esol-teachers`                | approve/manage teacher pool                                              |
| Safeguarding          | `/admin/safeguarding`                 | alert queue, statuses, the single-alert decrypted view, DSL duty         |
| Response texts        | `/admin/safeguarding-messages`        | edit crisis messages per language, validation                            |
| Teacher utilisation   | `/admin/teacher-utilisation`          | capacity read                                                            |
| Placement calibration | `/admin/calibration`                  | the 18/20 exercise, zero over-assignments rule                           |
| Invoices              | `/admin/invoices`                     | billing across orgs                                                      |
| Reports               | `/admin/reports`                      | evidence report generation                                               |
| GLH analytics         | `/admin/glh-analytics`                | **Total vs Claimable GLH**, AI share, per-org, trend                     |
| Compliance config     | `/admin/compliance-config`            | versioned rules, activate a new year, why old versions are kept          |
| Audit search          | `/admin/audit-search`                 | find any event                                                           |
| Queues / Failed jobs  | `/admin/queues`, `/admin/failed-jobs` | ops health, retry/dismiss failed jobs (incl. safeguarding-critical)      |
| Sales intelligence    | `/admin/sales-intelligence`           | ROI-calculator submissions                                               |
| Impersonation         | (from org/learner surfaces)           | start/end, audit trail                                                   |

### Chapter 2 — ORG ADMIN — ~11 surfaces + 8 tabs

| Surface              | Route                         | Key tasks                                                                                                                                                                                                            |
| -------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard            | `/org/home`                   | landing overview; first-login ROI-calculator onboarding intercept                                                                                                                                                    |
| **Cohort dashboard** | `/org-admin/dashboard`        | cohort table (sort/filter/CSV), narrative summary, Stage 5 pending tab, audit tab, **ILR export modal**, **evidence report modal**                                                                                   |
| Learners             | `/org/learners`               | search, status bands (active/inactive/dormant), nudge                                                                                                                                                                |
| **Learner detail**   | `/org-admin/learners/:id`     | **8 tabs**: Overview (GLH cards incl. Claimable), Sessions, Vocabulary, Stage 3 Objectives, Stage 5 Reviews, **Evidence Chain** (honesty gate view), Compliance Timeline, Teacher Reviews + suggested-teachers panel |
| Invitations          | `/org/invitations`            | create invite link, remind, revoke — the learner-creation flow                                                                                                                                                       |
| Bulk import          | `/org-admin/import`           | CSV template, per-row validation, SOF warnings                                                                                                                                                                       |
| ESOL Teachers        | `/org-admin/teachers`         | add/remove teachers, assign learners (needs-based matching)                                                                                                                                                          |
| Stage 5 review       | `/org-admin/stage5/:reviewId` | the human sign-off that releases "achieved" — **the honesty gate**                                                                                                                                                   |
| Audit log            | `/org-admin/audit-log`        | the "what happened?" view                                                                                                                                                                                            |
| Invoices             | `/org/invoices`               | org billing                                                                                                                                                                                                          |
| Settings             | `/org/settings`               | org profile                                                                                                                                                                                                          |

### Chapter 3 — TEACHER — ~6 surfaces

| Surface           | Route                           | Key tasks                                                                                   |
| ----------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| Teacher Dashboard | `/teacher/dashboard`            | **priority queue (P1–P4)** — who needs you this week; cohort strip                          |
| Learner detail    | `/teacher/learners/:id`         | progress read, review logging (**this is what counts your GLH**), messaging in learner's L1 |
| ESOL Sessions     | `/tutor/esol`                   | session list across your learners                                                           |
| Session detail    | `/tutor/esol/:sessionId`        | transcript read, teacher prep notes                                                         |
| Teaching Profile  | `/teacher/teaching-profile`     | specialisms that drive needs-based matching                                                 |
| Stage 5 sign-off  | (from learner/session surfaces) | teacher-side RARPA sign-off                                                                 |
| Settings          | `/tutor/settings`               | account                                                                                     |

### Chapter 4 — LEARNER — the richest chapter, ~12 flows

| Flow                                 | Route(s)                                                                               | Key moments                                                                                                                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Joining                              | `/join?token=`                                                                         | 5-step wizard: welcome → personal details (**L1 language choice**) → eligibility → ULN → done                                                                                    |
| Placement                            | `/esol/placement`                                                                      | what it is, how long, what happens after (level + goals)                                                                                                                         |
| Dashboard                            | `/esol/home`                                                                           | welcome modal, unread-teacher-message blocking modal, Stage 5 notification card, recent sessions/vocab                                                                           |
| **The AI Tutor session**             | `/esol/scenarios` → `/esol/prepare/:id` → `/esol/session/:id`                          | journey map + destination card → PREPARE (4 micro-stages) → ROLEPLAY (**4-dot progress**, Listen button, opt-in mic, font-size, wrap-up banner) → COMPLETE (score, words, chime) |
| Leaving / resuming                   | exit-confirm modal, "Leave for now" vs "End & review", resume from My Sessions         |                                                                                                                                                                                  |
| If you're struggling                 | what ANCHOR mode feels like (more of your language), "I don't understand" is always OK |                                                                                                                                                                                  |
| If you disclose something            | the safeguarding response, "Take a break", who is told (honest, gentle wording)        |                                                                                                                                                                                  |
| My Goals                             | `/esol/goals`                                                                          | review + agree goals in your language                                                                                                                                            |
| Vocabulary                           | `/esol/vocab`                                                                          | retained vs in-progress words                                                                                                                                                    |
| My Sessions                          | `/esol/sessions`                                                                       | history, resume, read-only completed views                                                                                                                                       |
| Messages                             | `/esol/messages`                                                                       | teacher messages in your L1                                                                                                                                                      |
| Stage 5 self-assessment              | `/esol/stage5/:reviewId`                                                               | your voice in your record                                                                                                                                                        |
| Profile / Settings / language switch | `/profile`, `/settings`                                                                | incl. RTL                                                                                                                                                                        |

---

## 4. Order of work & definition of done

**Recommended order: Learner → Teacher → Org Admin → Amber Admin.**
Reason: capturing the learner chapter _generates the real data_
(sessions, vocab, evidence, GLH) that makes every admin screenshot look
alive instead of empty. If you prefer your original order (Amber Admin
first), we do the data-prep step up front instead — both work.

Per module, the loop is:

1. **Prep** — seed/refresh demo data for that module's screens.
2. **Capture** — extend `manifest.mjs` with the module's routes +
   actions; run the harness; eyeball every image.
3. **Write** — the chapter, following the per-screen template, screen
   by screen against the inventory table above (tick each row).
4. **Verify** — walk the manual as the target user: can a new person
   complete every task using only the doc? Fix gaps.
5. **Sign-off** — you read it; anything unclear gets rewritten.

**Definition of done per chapter:** every inventory row ticked, every
screenshot current, every step tested against the running app, glossary
terms linked, and a final "quick reference" card (one page of the 10
most common tasks) at the top.

### Estimated shape

| Piece                | Size                                       |
| -------------------- | ------------------------------------------ |
| Ch 0 Getting started | ~6 pages, 6 screenshots                    |
| Ch 1 Amber Admin     | ~18 pages, ~18 screenshots                 |
| Ch 2 Org Admin       | ~20 pages, ~22 screenshots (tabs + modals) |
| Ch 3 Teacher         | ~10 pages, ~10 screenshots                 |
| Ch 4 Learner         | ~16 pages, ~24 screenshots (incl. mobile)  |
| Capture harness      | one-time build, reused forever             |

---

## 5. Open decisions (defaults chosen — say if you want different)

1. **Format**: Markdown in-repo, exported to Word/PDF per chapter at
   the end. _(Default: yes.)_
2. **Learner chapter language**: English-only for now; ar/yue/tr
   versions are a translation pass later, same as the scenario content.
   _(Default: English-only.)_
3. **Voice features**: documented with an "if enabled by your
   provider" banner since TTS/STT ship dark. _(Default: include.)_
4. **Marketing site** (Home/About/Bridge Method pages): excluded — the
   manual covers the logged-in product. _(Default: exclude.)_
