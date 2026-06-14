# Frontend use cases — Amber ESOL platform

> Detailed, click-by-click use cases for every persona and every flow
> the frontend supports today. Use this as the script for manual QA
> (`docs/E2E_QA_REPORT.md`), as the demo script for stakeholder
> walkthroughs, and as the "what does the platform actually do" doc
> for new team members.
>
> **Format:** every use case lists the persona, the route, the
> required inputs (with sample values you can paste), the buttons
> to click in order, and the expected result. Where the backend
> hasn't yet shipped the supporting endpoint, the gap is called out
> inline — those are tagged **🚧 BACKEND FOLLOW-UP**.

---

## Part 1 · What's been built

A summary of the build so far, organised by the campaign that shipped
each batch. Use this section to orient yourself before reading the
use cases — every route and feature mentioned in Part 2 is anchored
to a phase here.

### 1.1 Foundation (M0)

The plumbing every shell sits on top of:

| Capability                   | Where                                                   | Notes                                                                                                                        |
| ---------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Single-host shell switch** | `src/routes/Wrapper.tsx`                                | One CRA bundle, path-prefix routes to `platform` / `learner` / `teacher` / `admin` / `org_admin` shells. No subdomain split. |
| **Axios + interceptors**     | `src/lib/network/axios.ts`                              | JWT injection, 401 → `/login` global redirect, `X-Demo-Mode` header capture.                                                 |
| **React Query**              | `src/lib/query/client.ts`                               | Global error toast bridge via sonner. Cache cleared on logout.                                                               |
| **AuthContext**              | `src/modules/dashboard/context/AuthContext.tsx`         | `useAuth()` hook, refresh-token rotation, cross-shell SSO via shared cookie.                                                 |
| **Role gating**              | `PrivateRoute.tsx`, `RoleRoute.tsx`                     | Every dashboard route role-gated. Bounce destination routed through `roleHome()`.                                            |
| **Diagnostics page**         | `/__diag` on every shell                                | Surfaces auth state, computed role-home, backend URL, demo-mode comparison, cookie state.                                    |
| **Demo-mode global**         | `src/lib/demoMode.ts` + `src/components/DemoBanner.tsx` | `useSyncExternalStore` singleton, persisted in sessionStorage.                                                               |

### 1.2 Marketing rebrand (Project Silk — phases D1–D11)

The public marketing site, ported to the warm off-white #faf8f3
design system.

| Page                                                       | Route                                                              | Phase              |
| ---------------------------------------------------------- | ------------------------------------------------------------------ | ------------------ |
| Home                                                       | `/`                                                                | D3                 |
| For organisations                                          | `/for-organisations`                                               | D4                 |
| Bridge Method                                              | `/bridge-method`                                                   | D5                 |
| About                                                      | `/about`                                                           | D6                 |
| Help centre                                                | `/help`                                                            | D6                 |
| Contact                                                    | `/contact`                                                         | D6                 |
| Login / Signup / Signup-student                            | `/login`, `/signup`, `/signup-student`                             | D7                 |
| Forgot / Reset / Confirm-email / Verify                    | `/forgot-password`, `/reset-password`, `/confirm-email`, `/verify` | D8                 |
| Join wizard (5 steps)                                      | `/join?token=…`                                                    | D9                 |
| Privacy / Terms / 404 / Blogs / Find tutors / How it works | various                                                            | D10                |
| Public ROI calculator                                      | `/roi-calculator`                                                  | Final Addendum §13 |

Shared chrome (D2): status bar + new navbar + footer + marquee.

### 1.3 Learner shell (`/esol/*`)

| Page                                       | Route                       | Phase |
| ------------------------------------------ | --------------------------- | ----- |
| Learner home                               | `/esol/home`                | M2    |
| Placement assessment                       | `/esol/placement`           | F3    |
| AI tutor session (six-layer Bridge Method) | `/esol/session/:scenarioId` | F4    |
| Legacy session viewer                      | `/esol/sessions/:sessionId` | M1    |
| Vocab (spaced repetition)                  | `/esol/vocab`               | F4    |
| Teacher messages inbox                     | `/esol/messages`            | F12   |
| Stage 5 self-assessment                    | `/esol/stage5/:reviewId`    | F7    |

### 1.4 Teacher portal (`/teacher/*` — Project Silk)

| Page                               | Route                   | Phase                |
| ---------------------------------- | ----------------------- | -------------------- |
| Teacher dashboard (priority queue) | `/teacher/dashboard`    | Final Addendum §9–10 |
| Teacher learner detail             | `/teacher/learners/:id` | Final Addendum §9    |

(Legacy tutor pages at `/tutor/*` remain mounted for non-ESOL tutors.)

### 1.5 Org-admin shell (`/org-admin/*` — Project Silk)

| Page               | Route                         | Phase          |
| ------------------ | ----------------------------- | -------------- |
| Cohort dashboard   | `/org-admin/dashboard`        | F8 / Phase 15  |
| Learner detail     | `/org-admin/learners/:id`     | Phase 15       |
| Bulk import        | `/org-admin/import`           | Phase 15 / F13 |
| Teacher assignment | `/org-admin/teachers`         | Phase 15       |
| Stage 5 review     | `/org-admin/stage5/:reviewId` | F7 / Phase 17  |

(Legacy org pages at `/org/*` retained for backward compatibility.)

### 1.6 Amber-admin shell (`/admin/*` — Project Silk Function 15)

| Page                          | Route                        | Phase              |
| ----------------------------- | ---------------------------- | ------------------ |
| Overview                      | `/admin/overview`            | F10                |
| Org detail                    | `/admin/orgs/:id`            | F10                |
| Compliance config (versioned) | `/admin/compliance-config`   | Final Addendum §3  |
| BullMQ queues                 | `/admin/queues`              | Final Addendum §1  |
| Failed jobs review            | `/admin/failed-jobs`         | Final Addendum §1  |
| Teacher utilisation analytics | `/admin/teacher-utilisation` | Final Addendum §4  |
| GLH analytics                 | `/admin/glh-analytics`       | Final Addendum §12 |
| Sales intelligence            | `/admin/sales-intelligence`  | Final Addendum §13 |
| Safeguarding alerts           | `/admin/safeguarding`        | F5 / Phase 13      |
| Invoices (with detail modal)  | `/admin/invoices`            | F9 / F15           |
| Placement calibration         | `/admin/calibration`         | M2                 |
| ESOL teacher approval         | `/admin/esol-teachers`       | Phase 4            |

(Legacy admin pages — dashboard, students, tutors, lessons, payments,
reviews, settings, tickets, orgs, reports — remain mounted.)

### 1.7 Post-launch hardening (F19)

| Capability                                  | Where                                   |
| ------------------------------------------- | --------------------------------------- |
| Boot-time env validation + misconfig screen | `src/lib/env.ts`, `src/index.tsx`       |
| ErrorBoundary at root of React tree         | `src/components/ErrorBoundary.tsx`      |
| Lazy-loaded route chunks                    | `RouteFallback.tsx` + both `routes.tsx` |
| SPA health probe                            | `/_health` on every shell               |
| robots.txt + sitemap.xml                    | `public/`                               |
| Pre-launch checklist                        | `docs/PRE_LAUNCH_CHECKLIST.md`          |

---

## Part 2 · Use cases

> **Conventions used below:**
>
> - **Sample values** are paste-ready. Replace `@example.com` /
>   placeholders with your real test fixtures.
> - **Buttons** are quoted exactly as they appear: "Sign in",
>   "Generate invoice", etc.
> - **Expected result** is the user-visible outcome plus the
>   verification you do at `/__diag` or in the network panel.
> - **🚧 BACKEND FOLLOW-UP** marks a step that exposes a known
>   backend gap. The frontend stub is documented inline.

---

### UC-1 — Anonymous visitor browses the marketing site

**Persona:** Prospective ESOL provider, no account.
**Starting URL:** `https://esol.ambertraining.co.uk/`

**Steps:**

1. Land on `/`. Hero copy and CTA "Book a demo" visible above the
   fold. Scroll — feature grid, testimonial, stats, FAQ, footer.
2. Click navbar **"For providers"** → lands on `/for-organisations`.
3. Click navbar **"Bridge Method"** → lands on `/bridge-method`.
4. Click navbar **"How it works"** → lands on `/how-it-works`.
5. Click footer **"About"** → `/about`. Team cards render with
   names and `position` text (this field used to be called `role`
   — renamed in F16.1 to dodge a jsx-a11y false positive).
6. Click footer **"Privacy policy"** → `/privacy`.
7. Click footer **"Terms"** → `/terms`.

**Expected result:**

- Every page paints with the Project Silk warm-off-white theme.
- Navbar logo is the real Amber logo (not the rebrand placeholder).
- No console errors. Lazy-loaded chunks (`bridge-method.*.js` etc.)
  appear in DevTools Network on each navigation — first paint
  pulls only the Home bundle.

---

### UC-2 — Public ROI calculator + sales lead capture

**Persona:** Procurement / training lead at a college.
**Starting URL:** `/roi-calculator`

**Inputs (sample):**

| Field                        | Sample value                 |
| ---------------------------- | ---------------------------- |
| Organisation name            | Hounslow Adult Learning      |
| Annual learner intake        | 250                          |
| Average learner hours / year | 60                           |
| Average teacher cost / hour  | £42                          |
| Current MIS spend / year     | £18,000                      |
| Email                        | training-lead@hounslow.ac.uk |
| Phone                        | 020 8583 2000                |

**Steps:**

1. Open `/roi-calculator` — page is OUTSIDE `MainLayout`, so no
   marketing navbar (single-purpose funnel).
2. Fill the inputs above. Result panel updates **live** as you type
   (no submit needed): "Projected annual saving £XX,XXX",
   "Payback period 4.2 months", etc.
3. Click **"Download PDF report"** → `@react-pdf/renderer` produces
   a branded PDF, downloads as `amber-roi-<orgname>.pdf`.
4. Fill the contact block (email + phone). Click
   **"Email me this report"** → backend logs the submission to
   `roi_submissions` and emails the report with a personalised
   onboarding CTA (Final Addendum §13 outreach templates).

**Expected result:**

- PDF contains all calculated values + Amber branding.
- Backend row: `roi_submissions` with the org name, contact, all
  inputs hashed for de-dup.
- Amber-admin sees the lead in `/admin/sales-intelligence` within
  one query refetch.

---

### UC-3 — Amber-admin reviews sales leads and provisions a new org

**Persona:** Amber super-admin.
**Starting URL:** `/login`

**Steps:**

1. **Log in.** Fill email `admin@ambertraining.co.uk`, password
   `<your test pass>`. Click **"Sign in"** (button label per
   `Login.tsx`). Redirected to `/admin/overview` (via
   `roleHome(user)` — admin → `/admin/overview`, F2.1).
2. Sidebar → **"Sales intelligence"** → `/admin/sales-intelligence`.
3. Table lists ROI submissions. Filter by status = "new". The
   Hounslow row from UC-2 should appear.
4. Click the row → detail panel slides in with all the ROI inputs,
   computed savings, contact info, and the auto-generated outreach
   copy (Final Addendum §13).
5. Click **"Mark as contacted"** to log the outreach.
6. Sidebar → **"Orgs"** (legacy `/admin/orgs`). Click **"+ New
   org"**.
7. Fill: Name = "Hounslow Adult Learning", postcode = "TW3 1HA",
   MIS adapter = "none", contract status = "trial". Save.
8. Land on `/admin/orgs/:id`. Click **"Invite org-admin"** in the
   header. Enter `training-lead@hounslow.ac.uk`. Send.

**Expected result:**

- `orgs` row created, `contractStatus = "trial"`.
- `org_invitations` row with a one-use token.
- An email goes to the org-admin contact with a `/join?token=…`
  URL.
- `/admin/sales-intelligence` row flips to status "contacted".

---

### UC-4 — Org-admin completes the join wizard for first login

**Persona:** Newly-invited org-admin.
**Starting URL:** the `/join?token=<uuid>` link from the email
in UC-3.

**Steps:**

1. Open the link. Step 1 of 5: **Token verify**. Spinner.
   On success: "Welcome, Hounslow Adult Learning. Let's set
   up your account."
2. Step 2: **Personal details.** Fill First name = "Aisha",
   Last name = "Khan", phone = "020 8583 2000". Click
   **"Continue"**.
3. Step 3: **Eligibility.** Confirm role = "Org admin", check
   the data-protection acknowledgement. Click **"Continue"**.
4. Step 4: **ULN.** Org admin doesn't have a ULN — click
   **"Skip"**.
5. Step 5: **Set password.** Password = `TempPass123!`, Confirm
   = `TempPass123!`. Strength meter shows "Strong". Click
   **"Complete signup"**.
6. Auto-redirected to `/org-admin/dashboard` (via `roleHome(user)`
   — org_admin → `/org-admin/dashboard`).

**Expected result:**

- `users` row: role = `org_admin`, `orgId` set, password hashed.
- `org_invitations` row marked consumed.
- JWT in localStorage. Sidebar shows org-admin navigation:
  Dashboard / Learners / Teachers / Invitations / Import learners /
  Invoices / Settings.

---

### UC-5 — Org-admin uploads 25-learner CSV via bulk import

**Persona:** Org-admin from UC-4 (still logged in).
**Starting URL:** `/org-admin/dashboard`

**Steps:**

1. Sidebar → **"Import learners"** → `/org-admin/import`.
2. Click **"Download template"** — `learners-template.csv`
   downloads. Open in Excel.
3. Required columns: `firstName`, `lastName`, `dob` (DD/MM/YYYY),
   `email`, `l1Language` (ISO code, e.g. `ar`, `ur`, `ps`),
   `uln` (optional), `eligibilityStatus` (e.g. `EU-settled`,
   `refugee`, `british-citizen`).
4. Fill 25 rows. Sample row:
   ```csv
   Mariam,Hassan,14/03/1992,mariam.hassan@example.org,ar,1234567890,refugee
   ```
5. Drag the file onto the dropzone OR click **"Choose file"**.
   Wizard advances: **upload → preview → validation → commit**.
6. **Preview screen.** Table shows 25 rows. Any malformed rows
   highlighted red (e.g. invalid DOB format). Click any red cell
   to see the validation reason.
7. (Optional, F13) Click **"Download errors as CSV"** if rows
   need fixing — saves only the bad rows with an `_errors`
   column appended.
8. Fix in Excel, re-upload, repeat preview.
9. Click **"Commit 25 learners"**. Polling spinner with job ID
   visible. BullMQ `bulk-import` queue processes.
10. Success card: "25 learners imported." Click **"Go to
    dashboard"**.

**Expected result:**

- 25 `learners` docs, all `orgId = <this org>`, `status = "active"`.
- Cohort count on `/org-admin/dashboard` = 25.
- Each learner receives a referral email with their personal
  `/join?token=…` URL.

---

### UC-6 — Org-admin assigns learners to teachers

**Persona:** Org-admin.
**Starting URL:** `/org-admin/teachers`

**Pre-req:** 2 ESOL-approved teachers exist in this org. (Amber-admin
approves teachers at `/admin/esol-teachers`.)

**Steps:**

1. Sidebar → **"Teachers"** → `/org-admin/teachers`. Roster table
   lists the 2 teachers with current load counts.
2. Click teacher A's row → side panel "Assign learners".
3. Searchable list of unassigned learners. Tick 10 learners
   (e.g. by L1 = Arabic). Click **"Assign 10"**.
4. Confirmation toast. Counts update.
5. Repeat for teacher B with the remaining 15.

**Expected result:**

- `learner_teacher_assignments` collection: 10 + 15 docs.
- Teacher dashboards (`/teacher/dashboard`) update within one
  refetch.

---

### UC-7 — Learner receives referral, completes onboarding + placement

**Persona:** ESOL learner (e.g. Mariam Hassan from UC-5).
**Starting URL:** referral link from the bulk-import email.

**Steps:**

1. Open `/join?token=<learner-token>`.
2. **Step 1: token verify** → backend recognises the token and
   pre-fills name + email + L1 from the import.
3. **Step 2: personal details** — confirm pre-filled data, add
   missing fields (address, NI number if available, emergency
   contact).
4. **Step 3: eligibility** — pick eligibility category, upload
   proof document (drag PDF/JPEG onto dropzone).
5. **Step 4: ULN** — if blank, click **"I don't have a ULN"**.
   Backend will generate / look up via the LRS adapter (Phase 6).
6. **Step 5: set password** — `LearnerPass123!`. Click
   **"Complete signup"**.
7. Auto-redirected to `/esol/home`. Hero banner says
   **"Take your placement assessment"**.
8. Click banner CTA → `/esol/placement` (F3).
9. **Placement assessment.** 20–30 adaptive questions across
   listening / reading / writing. Each question type rendered
   per Phase 8:
   - MCQ: click the radio, click **"Next"**.
   - Free-text writing: type into textarea, click **"Submit
     answer"**.
   - Audio listening: click ▶ to play, then answer the MCQ.
10. Final screen: assigned **CEFR A2 (Entry 2)** with rationale
    chip ("Confident on listening / reading, building writing").
11. Click **"Start learning"** → back to `/esol/home`. Scenario
    catalogue (F4.2 — `SCENARIO_CATALOGUE` constant) shows the
    3 A2-appropriate scenarios:
    - `s1_gp_appointment` — Booking a GP appointment
    - `s2_payslip` — Understanding a payslip
    - `s3_housing_rights` — Asking your landlord for repairs

**Expected result:**

- `placement_assessments` row, `result = "A2"`, `pathway` set.
- `learners` doc updated with `level: "A2"`.
- Scenario catalogue rendered from the hardcoded constant (NOT
  from backend — see **🚧 BACKEND FOLLOW-UP** in F4.2: no
  `GET /scenarios` endpoint; scenarios live as JSON files on disk).

---

### UC-8 — Learner completes a Bridge Method scenario

**Persona:** Mariam, freshly placed at A2 from UC-7.
**Starting URL:** `/esol/home`

**Steps:**

1. Click scenario card **"Booking a GP appointment"** →
   `/esol/session/s1_gp_appointment`.
2. Bridge Method six layers (Phases 9–12):
   - **Layer 1 — Vocab pre-teach.** Cards show key vocab
     (appointment, surgery, prescription). Click each card to
     reveal definition + L1 translation. Click **"I've got these"**.
   - **Layer 2 — Comprehension.** Listen to a short dialogue,
     answer 3 MCQs. Click ▶, click answers, click **"Submit"**.
   - **Layer 3 — Guided production.** Fill blanks in a sample
     dialogue. Type, click **"Check"**, click **"Continue"**.
   - **Layer 4 — Roleplay.** Free-form chat with the AI tutor.
     Type your part of a GP-call roleplay. AI responds in
     character. After ~6 exchanges, click **"End roleplay"**.
   - **Layer 5 — Reflection.** AI summarises what you learned.
     Self-rate confidence 1–5. Click **"Continue"**.
   - **Layer 6 — Evidence capture.** Review the evidence card
     (your responses + AI feedback). Click **"Save to my
     evidence ledger"**.
3. Session complete. CTA: **"View vocab additions"** →
   `/esol/vocab`. New items (appointment, surgery, prescription)
   added with next-review dates (spaced repetition — Phase 18).

**Expected result:**

- `ai_sessions` row: `status = "completed"`, transcript stored,
  `evidenceLedgerStampId` set.
- `evidence_ledger`: 1 new stamp covering the 4 RARPA skills
  exercised.
- `vocab_items`: 3 new rows with SRS metadata.
- Learner's GLH counter incremented atomically (Final Addendum §12).

---

### UC-9 — Learner triggers safeguarding overlay

**Persona:** Any learner mid-session.
**Starting URL:** any `/esol/session/:scenarioId` page.

**Test phrase (from backend fixture):** "I am being hurt at home."

**Steps:**

1. During Layer 4 roleplay, type the test phrase. Press Enter.
2. Backend safeguarding classifier (Phase 13) fires. Frontend
   IMMEDIATELY replaces the chat input area with a safe-message
   overlay containing:
   - "It sounds like you might need support."
   - Contact card: Childline 0800 1111 (if learner DOB indicates
     under 18), Samaritans 116 123 otherwise, plus org DSL phone.
3. Click **"I'm okay, continue"** → session resumes (overlay
   dismissed but flagged in `safeguarding_alerts`).
   OR click **"Get help now"** → opens `tel:` link.

**Expected result:**

- `safeguarding_alerts` row: `level` set by classifier
  (high/med/low), `status = "open"`, SLA timer started.
- Alert visible on `/admin/safeguarding` within one refetch.

---

### UC-10 — DSL acknowledges a safeguarding alert

**Persona:** Amber-admin or org-admin with DSL role.
**Starting URL:** `/admin/safeguarding`

**Steps:**

1. Table lists open alerts. Each row shows: timestamp, learner
   pseudonym (not real name — PII protection), level badge
   (F5.1 — colored chip: red/amber/green), SLA badge (F5.2 —
   counts up, turns amber near breach), trigger-category badge.
2. Header pill (F5.3) shows total open count.
3. Click an alert row → detail panel slides in. Shows the
   trigger excerpt with surrounding context, the auto-shown
   safe message, learner's L1.
4. Click **"Acknowledge"**. Note field appears. Type:
   `"Called Aisha at org, DSL Sarah Mahmoud taking over. Learner
contacted Samaritans at 14:32."`. Click **"Save
   acknowledgement"**.
5. Status flips to **"acknowledged"**. SLA badge turns green
   (within SLA) or amber (close to breach) but stops
   incrementing.

**Expected result:**

- `safeguarding_alerts` row: `status = "acknowledged"`,
  `acknowledgedAt`, `acknowledgedBy`, `note`.
- Alert leaves the open count pill in the header.

---

### UC-11 — Learner completes Stage 5 self-assessment after 6 sessions

**Persona:** Mariam, after completing 6 scenarios.
**Starting URL:** `/esol/home`

**Steps:**

1. Banner: **"Time for your level review — Stage 5"** with CTA.
   Click → `/esol/stage5/:reviewId`.
2. Stage 5 review (Phase 17 / F7) covers 4 RARPA skills:
   listening / speaking / reading / writing.
3. For each skill:
   - Self-rate 1–5 confidence.
   - Free-text reflection ("Give an example of where you used
     this skill since last review").
   - Optionally upload an evidence file (audio recording,
     photo, document).
4. Click **"Submit self-assessment"**.
5. Confirmation: "Sent to your org admin for review."

**Expected result:**

- `stage5_reviews` row: `status = "submitted"`, learner inputs
  stored.
- Org-admin sees it in their pending Stage 5 queue.

---

### UC-12 — Org-admin reviews Stage 5 submission

**Persona:** Org-admin.
**Starting URL:** `/org-admin/dashboard`

**Steps:**

1. "Pending Stage 5 reviews" widget shows count. Click → opens
   the pending list.
2. **🚧 BACKEND FOLLOW-UP (F8.4):** The page that opens is currently
   a **placeholder** (`Stage5PendingTab.tsx` / `Stage5ReviewsTab.tsx`)
   showing "Phase 18 pending" copy. The backend does not yet
   expose a list endpoint for org-admin pending Stage 5 reviews.
   The frontend hooks `useOrgAdminPendingStage5` and
   `useStage5ReviewsForLearner` exist with `enabled: false` and
   comprehensive header comments documenting what the endpoint
   should return.
3. **Workaround during E2E QA:** open Mariam's learner page
   directly at `/org-admin/learners/:id` → Stage 5 tab → review
   form is reachable from the per-learner context.
4. On the per-learner Stage 5 form: review the learner's
   self-ratings and reflections. Add an org-admin confirmation
   note. Click **"Confirm self-assessment"**.

**Expected result (when backend lands the list endpoint):**

- `stage5_reviews` row: `status = "org_admin_confirmed"`,
  `orgAdminConfirmedAt`, `orgAdminNote`.
- Review moves to the teacher's sign-off queue.

---

### UC-13 — Teacher dashboard (priority queue)

**Persona:** ESOL-approved teacher (e.g. teacher A from UC-6).
**Starting URL:** `/login`

**Steps:**

1. Log in. `roleHome(user)` sees `tutor` role +
   `esolTeacherApproved: true` → redirects to `/teacher/dashboard`
   (NOT `/tutor/home`).
2. Dashboard renders **priority queue** (Final Addendum §10):
   ranked list of learners needing attention, scored by:
   - Days since last session.
   - Safeguarding flags.
   - Stage 5 review awaiting sign-off.
   - Re-engagement triggers.
3. Each row has inline action buttons (Final Addendum §10 / F-FIX):
   - **"Send message"** → opens send-message modal (UC-14).
   - **"Review session"** → opens last session transcript.
   - **"Sign off Stage 5"** → opens Stage 5 review form.
4. Click any learner's name → `/teacher/learners/:id`.

**Expected result:**

- Backend `priority_scores` table populates from the daily
  cron + the per-learner recalc trigger.
- Action button clicks call the correct endpoints — verify via
  Network tab.

---

### UC-14 — Teacher sends an L1 message with translation preview

**Persona:** Teacher A.
**Starting URL:** `/teacher/learners/:id` (Mariam — Arabic L1).

**Steps:**

1. Click the **"Messages"** tab inside the learner detail page.
2. Click **"+ New message"** → modal opens.
3. Type message in English: `"Well done on this week's
sessions. Try the housing-rights scenario next — it builds on
what you practised."`
4. Click **"Preview translation"**. Right pane shows Arabic
   translation, RTL-aligned (Final Addendum §11 / F12).
5. Tick **"Auto-send via priority queue"** if you want the
   re-engagement cron to schedule it; leave unticked to send now
   (`trigger: "manual"`).
6. Click **"Send message"**.

**Expected result:**

- `teacher_messages` row: `trigger = "manual"`,
  `originalText` (English), `translatedText` (Arabic),
  `language = "ar"`, `read = false`.
- Learner's `/esol/home` UnreadMessagesBanner increments
  (UC-15).

---

### UC-15 — Learner reads a teacher message in their L1

**Persona:** Mariam.
**Starting URL:** `/esol/home`

**Steps:**

1. **UnreadMessagesBanner** at the top of the page shows:
   "1 unread message from your teacher." If the message has
   `trigger: "cron"` (auto-sent reminder), an **"Auto-sent"**
   chip appears (F12.2).
2. Click banner → `/esol/messages` (F12.1).
3. Message list renders. Mariam's Arabic message is RTL-aligned
   (Arabic / Urdu / Pashto / Farsi flip per F12.1).
4. Click the message → expand. Read the Arabic text. Below,
   the English original is shown collapsed under
   **"Show original (English)"**.
5. Click **"Mark as read"**.

**Expected result:**

- `teacher_messages.read = true`, `readAt` set.
- Banner gone from `/esol/home`.
- Unread count in sidebar (if present) decrements.

**🚧 BACKEND FOLLOW-UP (F12.3):** the backend does NOT yet expose a
"message history" endpoint for learners. `/esol/messages` is
**unread-only** today — once a message is marked read, it
disappears. Inline header comment in `LearnerMessages.tsx`
documents the expected `GET /esol/messages/history` endpoint.

---

### UC-16 — Org-admin exports ILR CSV + companion JSON

**Persona:** Org-admin Aisha.
**Starting URL:** `/org-admin/dashboard`

**Steps:**

1. Click **"Export ILR"** button in the dashboard header
   (F8.3 — enabled per F8.2).
2. **IlrExportModal** opens (F8.2). State machine:
   `form → submitting → polling → complete | failed`.
3. **Form state.** Pick period: "May 2026" (dropdown of
   completed months). Pick variant: "Full year-to-date" or
   "This month only". Click **"Generate ILR export"**.
4. **Submitting state.** Spinner. Backend creates an
   `ilr_exports` job in BullMQ.
5. **Polling state.** Polls `GET /admin/orgs/:id/ilr-exports/:jobId`
   every 2s. Progress bar.
6. **Complete state.** Two download buttons:
   - **"Download CSV (ILR)"** — standard ILR format, one row
     per enrolment.
   - **"Download companion JSON"** — Amber-specific metadata
     (export hash, row hashes, exportedAt, version).
7. Click each, verify files land in Downloads.

**Expected result:**

- `ilr_exports` row: `status = "completed"`, `csvHash`,
  `jsonHash`, `rowCount`.
- BullMQ `ilr-export` queue depth returns to 0.

---

### UC-17 — Amber-admin generates an invoice (demo-mode gated)

**Persona:** Amber-admin.
**Starting URL:** `/admin/invoices`

**Steps:**

1. **Demo-mode check first.** If banner at top says "Demo mode",
   the **"Generate invoice"** button is disabled with tooltip:
   "Disabled in demo mode — would mutate production data." (F15.1
   gating.)
2. In live mode, click **"Generate invoice"** → modal opens.
3. Form fields (F16.1 — every label has `htmlFor`):
   - **Organisation** (dropdown): "Hounslow Adult Learning".
   - **Period start**: `2026-05-01`.
   - **Period end**: `2026-05-31`.
   - **Notes** (textarea, optional): "May 2026 ILR cycle".
4. Click **"Generate"**. Toast: "Invoice draft created."
5. Invoice appears in the list at top. Status pill = "pending".
6. Click the row → **InvoiceDetailModal** (F9.1) opens. Line
   items table: learner-hours × rate, GLH multiplier, etc.
   Totals at the bottom.
7. Click **"Mark as paid"** (also demo-gated). Confirm dialog.
   Status pill flips to "paid".

**Expected result:**

- `invoices` row: status timeline `pending → paid`, `paidAt`,
  `paidBy`.
- Org-admin sees the invoice at `/org/invoices` (or
  `/org-admin/invoices`).

**🚧 BACKEND FOLLOW-UP (F9.2):** The backend does NOT yet expose an
**"issue invoice"** state distinct from "pending". The button
shown above as "Generate invoice" actually creates a `pending`
draft directly — there's no draft → issued → paid pipeline
today. Documented inline in `AdminInvoices.tsx`.

---

### UC-18 — Org-admin reviews + downloads an invoice

**Persona:** Org-admin Aisha.
**Starting URL:** `/org-admin/dashboard` → click the invoice in
the "Recent activity" widget, OR sidebar → **"Invoices"** →
`/org-admin/invoices` (legacy `/org/invoices`).

**Steps:**

1. Invoice list renders. Click a row → InvoiceDetailModal opens.
2. Review line items.
3. Click **"Download PDF"** → `@react-pdf/renderer` renders a
   branded invoice PDF.
4. NO "Mark as paid" button (org-admin cannot — admin-only).

**Expected result:**

- PDF downloads with correct totals + Amber branding.
- Status flip from amber-admin (UC-17 step 7) shows here within
  one refetch.

---

### UC-19 — Amber-admin configures MIS adapter (ProSolution)

**Persona:** Amber-admin.
**Starting URL:** `/admin/orgs/:id` (Hounslow's detail page).

**Steps:**

1. Click **"MIS settings"** tab.
2. Adapter dropdown → select **"ProSolution"**.
3. Fill: API endpoint URL = `https://sandbox.prosolution.example/api/v3`,
   API key = `<test-key from backend .env.example>`,
   Sync interval = "Daily".
4. Click **"Test connection"** → spinner. Success toast:
   "Connected to ProSolution sandbox v3."
5. Click **"Save settings"**.

**🚧 BACKEND FOLLOW-UP (F11):** the **MIS sync-log + conflicts +
manual-trigger UI is documented but NOT BUILT** on the frontend.
The backend exposes Phase 21 endpoints, but the React surface
(sync history table, conflicts resolution panel, manual "Run
sync now" trigger button) hasn't been implemented. Tracked
inline in the relevant API hook file.

**Expected result (when MIS UI lands):**

- `mis_sync_logs` row per sync with adapter, status, records
  pushed/failed, conflicts.
- Conflicts panel renders each row with override/skip
  resolution buttons.

---

### UC-20 — Amber-admin reviews compliance config

**Persona:** Amber-admin.
**Starting URL:** `/admin/compliance-config` (Final Addendum §3).

**Steps:**

1. Page shows the **current active version** of the compliance
   rule set: ULN format, eligibility categories, evidence
   stage thresholds, RARPA stamp requirements.
2. History tab shows all past versions with timestamps + the
   admin who published each.
3. Click **"+ New version"** → form with JSON editor for the
   ruleset.
4. Edit (e.g. add a new eligibility category). Click
   **"Validate"** → backend dry-runs the new rules against a
   sample learner set, reports any breakage.
5. Click **"Publish"**. Confirmation dialog warns that all
   downstream validation will now use this version.

**Expected result:**

- `compliance_configs` collection: new doc, `version` incremented,
  `publishedBy`, `publishedAt`.
- Old version remains in history (versioned, not overwritten).

---

### UC-21 — Amber-admin reviews queues + failed jobs

**Persona:** Amber-admin.
**Starting URL:** `/admin/queues` (Final Addendum §1).

**Steps:**

1. Page summarises every BullMQ queue: `bulk-import`,
   `ilr-export`, `evidence-report`, `mis-sync`,
   `teacher-messages`, `safeguarding-classifier`. Each shows
   depth, processing rate, worker count.
2. Click **"Open Bull Board"** → deep-links to the backend's
   raw Bull Board UI at a different mount path (port 4000 or
   wherever backend mounts it).
3. Sidebar → **"Failed jobs"** → `/admin/failed-jobs`.
4. Table of failed jobs. Each row: queue name, job ID, error
   message, failed-at, retry count.
5. Click a row → expand. Stack trace, payload.
6. Click **"Retry"** → re-enqueues. Or **"Discard"** → marks as
   resolved without retrying.

**Expected result:**

- Retry click: `bull` re-queues with attempt counter.
- Discard click: status flip in `failed_jobs_resolved` table.

---

### UC-22 — Amber-admin reviews teacher utilisation

**Persona:** Amber-admin.
**Starting URL:** `/admin/teacher-utilisation` (Final Addendum §4).

**Steps:**

1. Date range picker → pick "Last 30 days". Defaults to last 7.
2. Table per teacher: name, assigned learners, hours logged,
   utilisation %, RAG status (red/amber/green based on target
   utilisation).
3. Click teacher row → detail panel with day-by-day breakdown
   chart (recharts).
4. Filter by org → dropdown narrows to one org's teachers.

**Expected result:**

- Read-only dashboard. Pure analytics, no mutations.

---

### UC-23 — Amber-admin reviews GLH analytics

**Persona:** Amber-admin.
**Starting URL:** `/admin/glh-analytics` (Final Addendum §12).

**Steps:**

1. Stacked bar chart: per-org total GLH split into
   **AI-only** vs **teacher-oversight** vs **teacher-led**
   contributions.
2. Target ratio annotation: 10–20% teacher contribution
   (funding-model constraint).
3. Orgs failing the ratio test highlighted red with delta to
   target.
4. Click an org bar → detail page (this org's daily GLH series).

**Expected result:**

- Analytics rendered from `glh_analytics_daily` aggregate
  table (backend cron).
- No mutations.

---

### UC-24 — Amber-admin reviews placement calibration

**Persona:** Amber-admin.
**Starting URL:** `/admin/calibration` (M2 — PlacementCalibration page).

**Steps:**

1. Page shows recent placement assessments grouped by assigned
   CEFR level.
2. Per level: score distribution, average duration, confidence
   metrics.
3. Outlier flags (assessments where the AI confidence was low
   or the result was overridden).
4. Click an outlier → detail panel with the full transcript +
   per-question breakdown.
5. "Override level" action available — admin can manually
   reassign and the system learns from the correction.

**Expected result:**

- Calibration overrides recorded for future training-data
  curation.

---

### UC-25 — Cross-shell SSO + role bounce hardening

**Persona:** Tester running through F18 §8.

**Steps (each sub-step is a separate test):**

1. **Logged out, hit any gated URL** — e.g. `/admin/overview`.
   Bounced to `/login` with `returnTo=/admin/overview` in
   sessionStorage. Log in as admin → land on `/admin/overview`
   (not the role-home, because returnTo took precedence).
2. **Student tries `/admin/orgs`.** Bounced via `roleHome(user)`
   to `/` (student with no org → public home).
3. **Tutor without `esolTeacherApproved` tries `/teacher/dashboard`.**
   Bounced to `/tutor/home` (F17.1 routes through `roleHome()`,
   NOT the legacy inline drift).
4. **Tutor with `esolTeacherApproved: true` tries `/admin/orgs`.**
   Bounced to `/teacher/dashboard`.
5. **Org-admin tries `/admin/orgs`.** Bounced to
   `/org-admin/dashboard`.
6. **Amber-admin tries `/org-admin/dashboard`.** Bounced to
   `/admin/overview`.

**Expected result:**

- Every bounce destination matches `roleHome(user)` exactly
  (verify by opening `/__diag` as that user — the "Routing"
  panel surfaces the computed value).
- No bounce to legacy `/admin/home` or `/org/home` (that was
  the pre-F17.1 drift).
- No flicker of gated content before redirect.

---

### UC-26 — 401 global redirect on JWT expiry

**Persona:** Any authed user.

**Steps:**

1. Log in as e.g. org-admin. Open DevTools → Application → Local
   Storage. Delete the `token` entry.
2. Click any nav link that fires a query (e.g.
   `/org-admin/dashboard` refresh button).
3. Axios interceptor catches the 401, dispatches
   `auth:unauthorized`, clears local storage, writes
   `returnTo` to sessionStorage, redirects to `/login`.
4. Log back in. Land on the original page (returnTo restored).

**Expected result:**

- No console error.
- React Query cache cleared (F2.2) — no cross-role bleed if the
  next login is as a different role.

---

### UC-27 — Demo-mode flip

**Persona:** Anyone.

**Steps:**

1. Backend started with `DEMO_MODE=true` env var.
2. Frontend: any API call response carries `X-Demo-Mode: true`
   header. Axios interceptor captures it, flips the global
   demo store.
3. **DemoBanner** appears at the top of every shell:
   "Demo mode — mutations disabled."
4. Specific buttons demo-gate:
   - `/admin/invoices` → "Generate invoice" + "Mark paid"
     disabled with tooltip (F15.1).
   - Any other mutation that would mess with production data.
5. Open `/__diag` → Demo-mode panel shows backend health
   `demoMode: true` AND frontend `useIsDemoMode() = true`
   (F15.2 invariant — both sources must agree).
6. Restart backend with `DEMO_MODE` unset. Refresh frontend.
   Banner gone, buttons re-enabled.

---

### UC-28 — Diagnostics page

**Persona:** Support / on-call engineer triaging an issue.
**Starting URL:** `/__diag` (M0.5 — reachable on every shell, no
auth required).

**What's shown:**

1. **Auth section** (F2.4):
   - Decoded JWT: user ID, role, orgId, esolTeacherApproved,
     issuedAt, expiresAt.
   - Cookie state: is the auth cookie present, domain, path.
   - Computed `roleHome(user)` value — this is the URL the user
     WOULD bounce to if they tried a disallowed route.
2. **Routing section.** Current pathname. Active shell
   (platform/learner/teacher/admin/org_admin). Active module
   (per `getModule()`).
3. **Demo-mode section** (F15.2). Backend health endpoint
   response side-by-side with the frontend
   `useIsDemoMode()` value. Mismatch → warning banner.
4. **Backend URL.** What `REACT_APP_BACKEND_URL` is set to.
   Ping button → fires `GET /health`, reports latency.
5. **Build info.** App version (from package.json), build
   timestamp.

**No mutations possible from this page** — read-only.

---

### UC-29 — ErrorBoundary catches a render crash (F19.2)

**Persona:** Any user when something breaks.

**Steps:**

1. (For testing) Inject a render error: open `/__diag` after
   temporarily editing the file to add `throw new Error("test
crash")`.
2. Page renders the **ErrorBoundary fallback card** instead of a
   white screen:
   - "Something went wrong" pill (red).
   - Heading: "We hit an unexpected error."
   - In dev: collapsible stack trace.
   - Two buttons: **"Refresh page"** and **"Go to home"**.
3. Open DevTools → Console. See
   `[ErrorBoundary] Uncaught render error: …` log.
4. Open DevTools → Network. See a `POST` to
   `<BACKEND_URL>/api/client-errors` — currently **404** (gap).
5. Click **"Refresh page"** → full reload, error gone.

**🚧 BACKEND FOLLOW-UP (F19.2):** `/api/client-errors` endpoint
not implemented backend-side. Payload shape is documented in
`ErrorBoundary.componentDidCatch` JSDoc.

---

### UC-30 — Misconfigured deploy screen (F19.1)

**Persona:** Ops / DevOps catching a bad build.

**Steps:**

1. (For testing) Rebuild without `REACT_APP_BACKEND_URL`:
   ```bash
   REACT_APP_BACKEND_URL= npm run build
   ```
2. Serve the built `/build` folder. Open any URL.
3. `validateEnv()` runs at boot, returns
   `ok: false, missing: ["REACT_APP_BACKEND_URL"]`.
4. `renderMisconfigScreen()` writes plain HTML directly into
   `#root` BEFORE React mounts:
   - Amber-yellow "DEPLOY MISCONFIGURED" pill.
   - "This build is missing required configuration."
   - List of missing vars.
   - Reference to `.env.production` + the checklist.

**Expected result:**

- Page renders even if React itself failed to load (the
  misconfig screen uses zero React).
- No console errors from the rest of the boot sequence (we
  return early before mounting).

---

### UC-31 — SPA health probe (F19.5)

**Persona:** Load balancer.

**Steps:**

1. `curl https://<domain>/_health`.

**Expected result:**

- HTTP 200.
- Body: plain text `ok` inside a `<pre>` tag.
- No React mount overhead — the route is the first match in
  both routers and renders the tiny inline `HealthCheck`
  component.

Distinguished from the backend's own `/health` (lives at
`BACKEND_URL/health`, returns `{ ok: true, demoMode }`).

---

### UC-32 — Auth — forgot password flow

**Persona:** Returning user who forgot password.
**Starting URL:** `/login`

**Steps:**

1. Click **"Forgot password?"** link below the form → `/forgot-password`.
2. Fill email `mariam.hassan@example.org`. Click **"Send reset
   link"**.
3. Confirmation card: "If an account exists for that email, a
   reset link has been sent. Check your inbox."
4. Open email, click the reset link → `/reset-password?token=…`.
5. Fill new password = `NewLearnerPass456!`, confirm same. Click
   **"Reset password"**.
6. Success card. Click **"Go to login"** → `/login`.
7. Log in with the new password.

**Expected result:**

- Token is one-use; clicking it again shows "This link has
  expired or been used."
- Backend does NOT issue a JWT in the reset response — user must
  re-authenticate at `/login` (verified during F-FIX).

---

### UC-33 — Auth — confirm email + resend (with documented gap)

**Persona:** Newly registered user who hasn't clicked the verify
link.

**Steps:**

1. Sign up at `/signup` (or via the join wizard). Backend sends a
   verification email.
2. Don't click the email link. Instead, navigate to
   `/confirm-email` (manually or via a "Please verify your email"
   prompt).
3. The page reads: "We sent a verification link to your email.
   Click it to confirm your account."
4. There IS a **"Resend verification email"** button, but it is
   **disabled** with the tooltip: "Resend not available — see
   support." (F2.3 + F-FIX.)

**🚧 BACKEND FOLLOW-UP (F2.3):** the backend does NOT expose
`POST /users/verify/resend`. The frontend used to wire it
optimistically and now disables the button until the endpoint
ships. Inline comment in `ConfirmEmail.tsx` documents the
expected contract.

5. To actually verify, the user must click the link in the
   original email → `/verify?token=…`. On success: "Email
   verified." CTA: **"Go to login"** → `/login`.

**Expected result:**

- `users.emailVerified = true`.
- Verify response does NOT auto-log the user in (no JWT in
  response). They re-auth at /login. This is why `roleHome` has
  the comment that VerifyEmail correctly stays at /login.

---

### UC-34 — Logout hygiene (F2.2)

**Persona:** Any authed user.

**Steps:**

1. Click sidebar → **"Log out"** (or profile dropdown → "Log
   out").
2. AuthContext logout fires:
   - `queryClient.clear()` — drops all React Query cache (F2.2
     prevents cross-role bleed if another user logs in next).
   - localStorage cleared (token, refreshToken, user).
   - Auth cookie cleared via `clearAuthCookie()`.
   - Redirect to `/login`.
3. Try clicking browser back. Cannot return to authed pages —
   PrivateRoute bounces to `/login`.

**Expected result:**

- Network tab: no stray queries fire after logout.
- localStorage: empty of auth keys.
- Re-login as a DIFFERENT role: no leftover data in tables from
  the previous user.

---

## Part 3 · Use-case-to-phase traceability

A grid mapping each use case back to the phase that delivered it.
Useful when "this UC broke" → "which phase do we look at first?"

| UC    | Title                              | Built in                     |
| ----- | ---------------------------------- | ---------------------------- |
| UC-1  | Marketing browse                   | D2, D3, D4, D5, D6, D10      |
| UC-2  | ROI calculator                     | Final Addendum §13 (F32–F36) |
| UC-3  | Sales lead → provisioning          | F32–F39, Phase 1–3           |
| UC-4  | Join wizard                        | D9                           |
| UC-5  | Bulk import                        | Phase 15, F13                |
| UC-6  | Teacher assignment                 | Phase 15                     |
| UC-7  | Learner referral + placement       | Phase 4–8, F3                |
| UC-8  | Bridge Method scenario             | Phase 9–12, 14, 18, F4       |
| UC-9  | Safeguarding trigger               | Phase 13                     |
| UC-10 | DSL ack                            | F5                           |
| UC-11 | Learner Stage 5                    | Phase 17, F7                 |
| UC-12 | Org-admin Stage 5 review           | Phase 17, F7, F8.4 (gap)     |
| UC-13 | Teacher dashboard / priority queue | F-§9–§10                     |
| UC-14 | Teacher L1 message                 | Phase 19, 24, F-§11, F12     |
| UC-15 | Learner reads message              | F12.1, F12.2                 |
| UC-16 | ILR export                         | Phase 16, F8.1, F8.2         |
| UC-17 | Admin invoice generate + mark paid | Phase 20, F9, F15.1          |
| UC-18 | Org-admin invoice review           | Phase 20, F9                 |
| UC-19 | MIS adapter config                 | Phase 21, F11 (gap)          |
| UC-20 | Compliance config                  | Final Addendum §3            |
| UC-21 | Queues + failed jobs               | Final Addendum §1            |
| UC-22 | Teacher utilisation                | Final Addendum §4            |
| UC-23 | GLH analytics                      | Final Addendum §12           |
| UC-24 | Placement calibration              | M2                           |
| UC-25 | Role-gate hardening                | F17                          |
| UC-26 | 401 global redirect                | M0.1                         |
| UC-27 | Demo-mode flip                     | M3, F15                      |
| UC-28 | Diagnostics page                   | M0.5, F2.4, F15.2            |
| UC-29 | ErrorBoundary                      | F19.2                        |
| UC-30 | Misconfig screen                   | F19.1                        |
| UC-31 | SPA health probe                   | F19.5                        |
| UC-32 | Forgot password                    | D8                           |
| UC-33 | Confirm email + resend (gap)       | D8, F2.3                     |
| UC-34 | Logout hygiene                     | F2.2                         |

---

## Part 4 · Consolidated backend follow-ups

Single source of truth for the backend gaps frontend documented
inline during F1–F19. F18 should re-audit each one before launch.

| ID   | Endpoint / capability                            | Frontend stub                                                                                                       | UC affected |
| ---- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ----------- |
| BE-1 | `POST /users/verify/resend`                      | `ConfirmEmail.tsx` resend button disabled                                                                           | UC-33       |
| BE-2 | `GET /scenarios` (list endpoint)                 | `SCENARIO_CATALOGUE` constant — scenarios live as JSON on disk                                                      | UC-7        |
| BE-3 | Stage 5 list endpoints for org-admin / teacher   | `Stage5PendingTab.tsx` + `Stage5ReviewsTab.tsx` placeholders; hooks have `enabled: false`                           | UC-12       |
| BE-4 | Invoice "issue" workflow (draft → issued → paid) | `AdminInvoices.tsx` creates `pending` directly                                                                      | UC-17       |
| BE-5 | MIS sync-log / conflicts / manual-trigger UI     | Page not built; inline backend-follow-up doc in hook file                                                           | UC-19       |
| BE-6 | Teacher-messages history endpoint                | `LearnerMessages.tsx` unread-only today; inline header doc                                                          | UC-15       |
| BE-7 | `POST /api/client-errors`                        | `ErrorBoundary` posts to it, silently 404s today                                                                    | UC-29       |
| BE-8 | DBS-cleared field in JWT                         | `roleHome.ts` has note — frontend uses `esolTeacherApproved` only; server-side `requireTeacherContext` enforces DBS | UC-25       |

---

## Part 5 · Pre-launch compliance call-outs

Not strictly use cases, but every demo / QA pass should hit these.

1. **Analytics consent gate (GDPR / PECR).** GTM, GA4, TikTok
   pixel currently fire on every page including authed shells.
   See `docs/PRE_LAUNCH_CHECKLIST.md` §7 — the closest thing to
   a hard launch blocker for any UK deploy.
2. **A11y baseline.** `npm run lint:a11y` violation count
   tracked in `docs/A11Y_SWEEP_BACKLOG.md`. ~200 violations
   remain in legacy dashboard files. Per-file work order also in
   that doc.
3. **Skip-to-content link.** Not present on platform or dashboard
   `MainLayout`. Tracked in A11y backlog §"What's outside the
   lint catch".
4. **Per-page `<title>` / `<meta description>`.** Currently
   site-wide values from `public/index.html`. Tracked in
   `PRE_LAUNCH_CHECKLIST.md` §4 follow-up.

---

That's the script. Hand this to a stakeholder + the F18 report,
and they can walk every persona end-to-end.
