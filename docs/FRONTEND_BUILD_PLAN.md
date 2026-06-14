# Frontend Build Plan — Amber ESOL

> Phased integration plan that completes the React frontend against
> the 26 backend phases + Final Addendum §1–§13. Each phase contains
> a paste-into-Claude prompt. Run them top to bottom.

---

## 0 · Inventory — what already exists

### Foundation (done)

- **Single-host shell switch** (`src/routes/Wrapper.tsx`) — path prefix routes to one of: `platform`, `learner`, `teacher`, `admin`, `org_admin` shells. No subdomain split.
- **Axios + react-query** (`src/lib/network/{axios,api}.ts`) — JWT injection, request-queue throttle, `X-Demo-Mode` interceptor, global 401 → `/login` redirect (M0.1), global error toaster (M0.2).
- **Auth context** (`src/modules/dashboard/context/AuthContext.tsx`) — `useAuth()` hook, cookie-domain set for shared SSO (M0.4). Now wraps both `PlatformRoutes` and `DashboardRoutes`.
- **Role gating** (`PrivateRoute.tsx`, `RoleRoute.tsx`) — enforced on every dashboard route.
- **Diagnostic page** (`/__diag`) — mounted on every shell (M0.5).

### Modules + what's wired

| Module                              | Pages mounted                                                                                                                                                                                            | API hooks present                                                                                                                                                                 | Status                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `platform`                          | Home, About, Help, Contact, Privacy, Terms, BridgeMethod, EsolForOrgs, FindTutors, HowItWorks, Blog, BlogPost, TutorDetail                                                                               | n/a (marketing only)                                                                                                                                                              | Design port in progress (D1–D5 done, D6–D11 pending) |
| `public`                            | RoiCalculator                                                                                                                                                                                            | `roiCalculatorApi.ts`                                                                                                                                                             | **Wired** — Final Addendum §13                       |
| `dashboard/onboarding`              | Login, Signup, SignupChoice, StudentRegister, TutorRegister, ForgotPassword, ResetPassword, ConfirmEmail, VerifyEmail, EsolJoin                                                                          | `authOnboarding.ts`                                                                                                                                                               | Wired (legacy styling — needs D7/D8 reskin)          |
| `esol`                              | JoinWizard, PlacementAssessment, AiTutorSession, Stage5SelfAssessment, + orgAdmin/{Dashboard, LearnerDetail, TeacherAssignment, BulkImport, Stage5Review}, + admin/PlacementCalibration                  | `esolApi.ts`, `stage5Api.ts`, `evidenceReportApi.ts`, `learnerMessagesApi.ts`, `orgAdminApi.ts`                                                                                   | Pages exist, integration audit needed                |
| `teacher`                           | Dashboard, LearnerDetail                                                                                                                                                                                 | `teacherDashboardApi.ts`                                                                                                                                                          | Wired (Final Addendum §9 frontend done)              |
| `admin` (Project Silk)              | Overview, OrgDetail, ComplianceConfig, Queues, TeacherUtilisation, FailedJobs, GlhAnalytics, SalesIntelligence                                                                                           | `adminOrgsApi.ts`, `complianceConfigApi.ts`, `queuesApi.ts`, `teacherUtilisationApi.ts`, `failedJobsApi.ts`, `glhAnalyticsApi.ts`, `salesIntelligenceApi.ts`, `misSettingsApi.ts` | Wired                                                |
| `dashboard/admin` (legacy)          | AdminDashboard, AdminStudents, AdminTutors, AdminLessons, AdminPayments, AdminReviews, AdminSettings, AdminTickets, AdminOrgs, EsolTeacherApproval, AdminSafeguardingAlerts, AdminInvoices, AdminReports | scattered across `dashboard/lib/api/*`                                                                                                                                            | Wired                                                |
| `dashboard/tutor` (legacy + Esol)   | TutorDashboard, TutorLessons, TutorAvailability, TutorStudents, TutorProfile, TutorReviews, TutorMessages, TutorEarnings, TutorSettings, EsolTutorHome, EsolTutorSession                                 | `tutorDashboard.ts`, `myStudents.ts`, `availability.ts`, etc.                                                                                                                     | Wired                                                |
| `dashboard/student` (legacy + Esol) | Dashboard, MyTutors, FindTutors, MyLessons, Messages, Payments, Profile, Settings, TutorDetail, EsolLearnerHome, EsolSession, EsolVocab                                                                  | `studentDashboard.ts`, `myTutors.ts`, `esolLearner.ts`, etc.                                                                                                                      | Wired                                                |
| `dashboard/orgAdmin` (legacy)       | OrgAdminDashboard, OrgLearners, OrgLearnerDetail, OrgInvitations, OrgEsolTeachers, OrgInvoices, OrgSettings                                                                                              | `esolOrg.ts`, `esolInvoice.ts`, etc.                                                                                                                                              | Wired                                                |

### Open backlog (existing tasks)

- **M2** — gap fills (teacher stats, vocab Phase 18, Stage 5 wiring, ROI prefill, calibration UI)
- **M3** — demo-mode UI + role-gate hardening
- **M4** — A11y / WCAG 2.1 AA sweep
- **D6–D11** — finish platform design port (about/help/contact/auth/wizard/retired pages/QA)

---

## 1 · Backend phase reference

The frontend phases below map to these backend deliverables.

| Backend               | What                                       | Frontend phase that consumes it |
| --------------------- | ------------------------------------------ | ------------------------------- |
| Phases 1–3            | Auth, orgs, users                          | F1                              |
| Phases 4–7            | ESOL learner referral + onboarding         | F2                              |
| Phase 8               | Placement assessment                       | F3                              |
| Phases 9–12           | AI tutor session (six-layer Bridge Method) | F4                              |
| Phase 13              | Safeguarding overlay                       | F5, F12                         |
| Phase 14              | Evidence ledger (RARPA stages)             | F4, F7                          |
| Phase 15              | Bulk import + cohort dashboard             | F8                              |
| Phase 16              | ILR CSV export + companion JSON            | F8, F11                         |
| Phase 17              | Stage 5 self-assessment + org-admin review | F7, F8                          |
| Phase 18              | Vocab + spaced repetition                  | F4                              |
| Phase 19              | Messaging + translation preview            | F6                              |
| Phase 20              | Invoicing                                  | F9                              |
| Phase 21              | MIS adapters (ProSolution, Maytas, EBS)    | F11                             |
| Phases 22–23          | Teacher portal + priority queue            | F6                              |
| Phase 24              | Teacher messaging                          | F6                              |
| Phase 25              | Teacher GLH + analytics                    | F6, F10                         |
| Phase 26              | Public ROI calculator                      | **DONE** (F15 polish only)      |
| Final Addendum §1     | BullMQ queues + failed jobs                | F10                             |
| Final Addendum §2     | Compliance config (versioned)              | F10                             |
| Final Addendum §3     | Per-org compliance overrides               | F10                             |
| Final Addendum §4     | Teacher utilisation analytics              | F10                             |
| Final Addendum §9–§12 | Teacher portal + RARPA evidence            | F6                              |
| Final Addendum §13    | Public ROI + sales intelligence            | F10, F15                        |

---

## 2 · The conventions every phase must follow

### 2.1 File layout (per feature)

```
src/modules/<shell>/
├── api/
│   └── <feature>Api.ts        ← react-query hooks (one file per feature)
├── lib/types/
│   └── <feature>.ts           ← request/response types matching backend DTOs
└── pages/
    └── <Feature>.tsx          ← page consumes hooks only — no axios in pages
```

For shells that pre-date the `lib/types/` split (legacy `dashboard/lib/api/*` + `dashboard/lib/types/*`), keep using that layout — don't migrate just for cosmetics.

### 2.2 Convention example (already in the codebase)

`src/modules/teacher/api/teacherDashboardApi.ts` is the gold standard. Copy its shape:

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../lib/network/api";
import type { ApiError, ApiResponse } from "../../../lib/network/axios";
import type { FeatureRequest, FeatureResponse } from "../lib/types/feature";

export const useFeature = (query: FeatureQuery) =>
  useQuery<ApiResponse<FeatureResponse>, ApiError>({
    queryKey: ["feature", query.id],
    queryFn: () => api.get(`/feature/${query.id}`),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

export const useUpdateFeature = () => {
  const qc = useQueryClient();
  return useMutation<ApiResponse<FeatureResponse>, ApiError, FeatureRequest>({
    mutationFn: (body) => api.post("/feature", body),
    onSuccess: () => {
      toast.success("Saved.");
      qc.invalidateQueries({ queryKey: ["feature"] });
    },
    onError: (err) => toast.error(err.message),
  });
};
```

### 2.3 Hard rules

- **No axios in pages.** Pages import hooks from `api/*Api.ts` only.
- **Types are local to the shell.** Don't share DTOs across shells via a global folder — copy them. Backend shape changes are caught by tsc per-shell.
- **URLs start at `/`, never `/api/`.** The axios `baseURL` already terminates at `/api`.
- **Mutations always show a toast** via `sonner` — success and error. Use the standard error shape: `err.message ?? "Something went wrong"`.
- **Query keys are stable arrays** — `["feature", id]` not `["feature-" + id]`. Include every filter that varies the response.
- **Loading + empty + error are always rendered explicitly.** Never let a page render with `data?.foo` and no skeleton.
- **Routes wired through `RoleRoute`.** Any new dashboard page must declare its allowed role(s).
- **Sidebar entry added** when a new page is mounted — `dashboard/layout/Sidebar.tsx` (or the audience-specific equivalent).

### 2.4 Verification ritual (every phase)

```
npx tsc --noEmit                 # type-check passes
npm start                        # app boots
# In the browser:
#   1. Navigate to the new page from the sidebar
#   2. Confirm Network tab shows the expected endpoint hits
#   3. Confirm empty / loading / error states render
#   4. Confirm role gate (visit as wrong role → bounce)
#   5. Confirm a11y: tab through, screen-reader labels present
```

---

## 3 · Phases

### Status legend

- ✅ **Done** — landed in code, verified
- 🟡 **Partial** — page exists, integration audit needed
- 🔵 **Pending** — not started

Phases are independent enough that two devs / sessions can pick different ones if needed, but the sequence below is the recommended order.

---

## Phase F0 — Foundation ✅ DONE

Single-host shell switch, axios interceptors, react-query providers, AuthContext, role gating, demo-mode, diagnostics page, sonner toaster. No further work — keep an eye on it during F18 cross-shell QA.

---

## Phase F1 — Platform marketing design port 🟡 PARTIAL

### Status

D1–D5 done (tokens, chrome, Home, For Providers, Bridge Method). D6–D11 pending.

### Prompt to finish

```text
Finish the platform marketing-page design port. The design assets are
unpacked under `design-refs/site/*.html` and `design-refs/site/styles.css`.
The shared design system is already imported via `src/styles/amber-design-system.css`
(scoped to .amber-platform).

Port these pages by directly translating the design-refs HTML to React,
reusing the design-system classes (kicker, lead, card, figure, etc.):

1. `/about` — design-refs/site/about.html → src/modules/platform/pages/About.tsx
2. `/help` — design-refs/site/help.html → src/modules/platform/pages/HelpCenter.tsx
   (search bar + audience tabs + accordion FAQ)
3. `/contact` — design-refs/site/contact.html → src/modules/platform/pages/Contact.tsx
   (two-column: demo request form + safeguarding contact card with red top border)
4. `/privacy` + `/terms` — design-refs/site/privacy.html + terms.html
   (article layout, max-width 720, simple typography)
5. `/blogs` — design-refs/site/blogs.html → placeholder "notes are coming back" card
6. `/tutors`, `/tutors/:id`, `/how-it-works` — design-refs/site/tutors.html etc.
   (retired-page treatment using the .retired class)
7. `/404` — design-refs/site/404.html → an ErrorPage replacement using .notfound
8. Reskin auth shell:
   /login, /signup, /signup/student — design-refs/site/login.html, signup.html,
   signup-student.html. Use the .auth + .auth-panel + .auth-card classes.
   The forms must wire to the existing useLogin / useSignup hooks from
   src/modules/dashboard/lib/api/authOnboarding.ts.
9. Reskin auth secondary flow:
   /forgot-password, /reset-password/:id/:token, /confirm-email,
   /verify/:id/:token — design-refs/site/forgot-password.html,
   reset-password.html, confirm-email.html, verify.html. Use the
   .auth-status card pattern for success/error states. The verify
   page needs three states (loading / success / failure-with-three-causes).
10. Reskin /join wizard — design-refs/site/join.html. Apply the
    .wizard, .wizard-progress, .lang-picker, .wizard-card, .uln-choice,
    .confirm-panel classes to the existing JoinWizard.tsx + 5 step
    components. Keep all backend wiring intact — only swap the
    visual layer.

For each page:
- Use lucide-react icons (not raw <svg>)
- Replace <image-slot> elements with hatched <div> placeholders
- Run `npx tsc --noEmit` after each page
- Verify the page renders correctly at localhost:3000

When done, mark D6–D11 in the task list as completed.
```

---

## Phase F2 — Auth flow integration audit 🟡 PARTIAL

### Backend deps

- Phases 1–3 — `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password/:token`, `/auth/confirm-email`, `/auth/verify/:id/:token`, `/auth/me`

### Status

Pages render and call hooks, but token refresh on tab focus, cookie-domain edge cases, and role-default redirect after login need an audit.

### Prompt

```text
Audit the full auth lifecycle end-to-end and fix any rough edges.

Files in scope:
- src/modules/dashboard/context/AuthContext.tsx
- src/modules/dashboard/lib/api/authOnboarding.ts
- src/modules/dashboard/pages/onboarding/{Login, Signup, SignupChoice,
  StudentRegister, TutorRegister, ForgotPassword, ResetPassword,
  ConfirmEmail, VerifyEmail, EsolJoin}.tsx

Acceptance criteria:
1. Login with role=student → lands on /  (legacy learner) AND /esol/home
   if the user has org_id (ESOL learner). Decide which is the primary.
2. Login with role=tutor → /tutor/home (or /teacher/dashboard if
   esol_teacher_approved + dbs_check_status === "cleared").
3. Login with role=admin → /admin/overview (the new Project Silk
   admin), not the legacy /admin/home.
4. Login with role=org_admin → /org-admin/dashboard (Project Silk),
   not the legacy /org/home.
5. The /auth/me call on app boot reads the JWT from localStorage,
   populates AuthContext, and if 401 returns, redirects to /login
   ONLY IF the current route requires auth. Public marketing pages
   stay reachable while logged out.
6. Forgot-password → reset link → set new password → auto-login →
   role default home. End-to-end test in dev.
7. Email verification: clicking the link from the email arrives at
   /verify/:id/:token, the API call runs, the success state shows
   for 2s, then auto-redirect to /login (or to role-default if a
   session cookie was issued).
8. Logout clears localStorage token, clears the auth cookie, kills
   the AuthContext user, redirects to /. No stale data in
   react-query — call queryClient.clear() on logout.
9. The "Log in" link in the platform Navbar (now /login) lands on
   the dashboard Login component without "useAuth must be used within
   an AuthProvider" errors. (Already fixed — verify still holds.)
10. SSO across shells: log in on /login, then navigate to /esol/home —
    no second login required. The cookie domain (REACT_APP_COOKIE_DOMAIN)
    handles this in prod; in dev the same-origin model just works.

Implementation:
- Read each page and the auth hooks
- Map role → default home in a single helper (e.g. utils/roleHome.ts)
- Use that helper from Login.tsx, post-signup, post-verify, and
  the AuthContext bootstrap
- Add unit-test-style assertions in a /__diag panel showing current
  role + computed home + cookie-domain state

Verify:
- Type-check clean
- Manual smoke-test each of the 8 acceptance criteria
- No 401-loop on app boot when logged out
```

---

## Phase F3 — Placement assessment integration 🟡 PARTIAL

### Backend deps

- Phase 8 — `/esol/placement/start`, `/esol/placement/answer`, `/esol/placement/submit`, `/esol/placement/result`

### Status

`src/modules/esol/pages/PlacementAssessment.tsx` exists but the integration breadth (resume mid-test, adaptive difficulty, calibration mapping) needs verification.

### Prompt

```text
Audit and complete the placement assessment integration.

Files:
- src/modules/esol/pages/PlacementAssessment.tsx
- src/modules/esol/api/esolApi.ts  (add placement hooks if missing)
- src/modules/esol/lib/types/  (add placement types)

Hooks to define:
- usePlacementStart() — POST /esol/placement/start, returns first item
- usePlacementAnswer() — POST /esol/placement/answer
  with { itemId, response }, returns next item or { complete: true }
- usePlacementSubmit() — POST /esol/placement/submit, returns level
- usePlacementResult(id) — GET /esol/placement/result/:id

Acceptance criteria:
1. Learner lands on /esol/placement, sees the welcome screen with
   their first language pre-set from the JoinWizard.
2. Each item renders: stem + 4 options + a 30s timer (visible but
   non-blocking). Selecting an option immediately advances.
3. Mid-assessment refresh resumes from the last unanswered item
   (the server persists progress).
4. On final item submit, the result panel shows: assigned CEFR
   level (A1–C1), confidence band, and a "Start learning" CTA
   that links to /esol/home.
5. If the learner abandons mid-test and returns later, the
   /esol/home shows a "Resume placement" CTA at the top.
6. Network: every answer is POSTed individually. No client-side
   adaptive logic — the server decides the next item.

Wire the page through the api/ hooks pattern. Add toast + error
states. Run tsc + visit /esol/placement (need a student account
with org_id and no existing placement_level).
```

---

## Phase F4 — AI tutor session integration 🟡 PARTIAL

### Backend deps

- Phases 9–12 (six-layer prompt orchestrator)
- Phase 13 (safeguarding overlay — runs server-side per turn)
- Phase 14 (evidence ledger writes per turn)
- Phase 18 (vocab spaced-repetition adds words on session end)

### Status

`AiTutorSession.tsx` + `EsolSession.tsx` exist. Need to verify the streaming/turn-taking, scenario picker, L1 anchor display, and Stage 5 trigger on level complete.

### Prompt

```text
Complete the AI tutor session integration end-to-end.

Files:
- src/modules/esol/pages/AiTutorSession.tsx (scenario-based session)
- src/modules/dashboard/pages/student/EsolSession.tsx (open-ended)
- src/modules/dashboard/lib/api/esolSession.ts
- src/modules/dashboard/lib/types/esol.ts
- src/modules/dashboard/lib/api/esolVocab.ts (Phase 18)

Backend endpoints to consume:
- GET  /esol/scenarios?level=A2          — list of available scenarios
- POST /esol/sessions                    — create session (body: scenario_id)
- POST /esol/sessions/:id/turn           — send learner utterance,
                                            receive AI response (six-layer)
- POST /esol/sessions/:id/complete       — end session, returns evidence
                                            id + vocab additions
- GET  /esol/sessions/:id                — resume session
- GET  /esol/vocab?status=due            — Phase 18 review queue
- POST /esol/vocab/:id/review            — log SRS review

Acceptance criteria:
1. Learner arrives at /esol/home, sees the scenario picker (filtered
   by their placement_level) — GP appointment, Universal Credit,
   parents' evening, etc.
2. Tapping a scenario starts a session and routes to /esol/session/:id.
3. Each AI turn renders with its six-layer breakdown visible:
   - 01 L1 anchor (in learner's L1, RTL-aware)
   - 02 Bridge utterance (L1 + English hybrid, fl words highlighted)
   - 03 Independent English target
   - 04 UK context anchor (small badge)
   - (05 safeguarding overlay is silent — only renders if triggered)
   - (06 evidence is silent — server-side write)
4. Learner replies via text input or voice (if implemented). Reply
   is scored against the five-band rubric — the UI shows the band
   with a green/amber/red bar.
5. After 8 turns (or learner taps "Finish"), session completes.
   The completion screen shows: vocab added, evidence stage written,
   "Start another" + "Back to home" CTAs.
6. If safeguarding triggers, an alert renders inline ("We've passed
   this to your support contact") AND the session quietly continues.
7. Mid-session refresh resumes from the last turn.
8. /esol/vocab page shows the SRS queue with cards (front L1, back
   English + example sentence). Each review POSTs the rating.

Wire all of this through the api/ hooks pattern. Use react-query's
useMutation with optimistic updates for turn submission so the UI
feels instant. Run tsc + smoke-test.
```

---

## Phase F5 — Safeguarding alert dashboard 🟡 PARTIAL

### Backend deps

- Phase 13 (safeguarding alert ingest)

### Status

`AdminSafeguardingAlerts.tsx` exists. Audit and add inline acknowledgement, DSL note, and escalation route.

### Prompt

```text
Audit and complete the safeguarding alert dashboard.

Files:
- src/modules/dashboard/pages/admin/AdminSafeguardingAlerts.tsx
- src/modules/dashboard/lib/api/esolSafeguarding.ts
- src/modules/dashboard/lib/types/   (add safeguarding alert type)

Backend endpoints:
- GET  /safeguarding/alerts?status=open|acknowledged|escalated
- POST /safeguarding/alerts/:id/acknowledge  (body: { dsl_note })
- POST /safeguarding/alerts/:id/escalate     (body: { reason })
- GET  /safeguarding/alerts/:id              (full thread + transcript snippet)

Acceptance criteria:
1. Page renders three tabs: Open (default), Acknowledged, Escalated,
   with a red badge showing the open count.
2. Each row: learner pseudonym (initials only — DSL-cleared admins
   see full name), trigger keyword class (DV / MH / CW), timestamp,
   org name, severity tag.
3. Click row → side panel slides in with the redacted transcript
   snippet (±3 turns around the trigger), DSL note textarea,
   Acknowledge / Escalate buttons.
4. Acknowledge requires a non-empty DSL note. Escalate routes to
   the org's nominated DSL email and stays on the dashboard.
5. SLA timer: every open alert >5 mins old gets an orange ring;
   >15 mins gets a red ring with an audible tick (configurable).
6. Org-admin view (separate page) sees ONLY their org's alerts and
   cannot escalate above their org's DSL.

Run tsc + smoke-test with a seeded alert. Add a Diagnostics line
showing the SLA breach count.
```

---

## Phase F6 — Teacher portal completion ✅ PARTIAL DONE

### Backend deps

- Phases 22–24 + Final Addendum §9–§12

### Status

TeacherDashboard, LearnerDetail, priority queue, messaging, RARPA Stage 5 sign-off — frontend pages mounted, hooks wired. Final audit:

### Prompt

```text
Audit the teacher portal for any unfinished integration edges.

Files:
- src/modules/teacher/pages/Dashboard.tsx
- src/modules/teacher/pages/LearnerDetail.tsx
- src/modules/teacher/api/teacherDashboardApi.ts
- src/modules/teacher/lib/types/teacherDashboard.ts

Acceptance criteria:
1. Dashboard loads at /teacher/dashboard. Tabs: Priority queue
   (default), All learners, Activity feed.
2. Priority queue shows learners ranked by priority score with
   the trigger ("Vocab review overdue", "Stage 5 awaiting sign-off",
   "Safeguarding flag", "Inactivity >7d"). Tapping a row opens
   LearnerDetail.
3. LearnerDetail at /teacher/learners/:id shows: placement level,
   active scenario, last 5 sessions with evidence stage progression,
   vocab progress, pathway with the override button, message
   thread, Stage 5 sign-off card.
4. Send-message modal opens with translation preview — typing in
   English shows the L1 preview live. Send POSTs both versions.
5. Pathway override saves and immediately reflects on the page.
6. RARPA Stage 5 sign-off: textarea + "Sign off" button. Confirms
   inline, advances the learner's evidence stage.
7. Re-engagement toggle in profile/settings (Final Addendum §11)
   honours the cron schedule.

Use the existing teacherDashboardApi.ts hooks. Add anything missing.
Verify the teacher GLH counter in MainLayout's topbar matches the
Function 25 contract (atomic increment).
```

---

## Phase F7 — Stage 5 self-assessment + learner journey close 🟡 PARTIAL

### Backend deps

- Phase 17 (Stage 5 review create + confirm)

### Status

`Stage5SelfAssessment.tsx` (learner) + `orgAdmin/Stage5Review.tsx` exist. Verify the full handoff: AI generates L1 summary → learner self-assesses → org-admin confirms → teacher signs off → ILR claim ready.

### Prompt

```text
Verify and complete the Stage 5 RARPA review pipeline end-to-end.

Files:
- src/modules/esol/pages/Stage5SelfAssessment.tsx
- src/modules/esol/pages/orgAdmin/Stage5Review.tsx
- src/modules/esol/api/stage5Api.ts
- src/modules/esol/lib/types/  (Stage 5 review types)
- Backend endpoints already exist (Function 17)

Flow to verify (this is the core handoff):
1. Learner completes a level. Backend creates a Stage 5 review with
   AI-generated L1 summary.
2. Learner gets a notification: "Review your progress" → /esol/stage5/:reviewId
3. Learner reads L1 summary, adds free-text reflection (also in L1
   if they choose), submits.
4. Org-admin gets a notification, opens /org-admin/stage5/:reviewId,
   sees: learner's reflection, AI summary, evidence ledger snippet.
5. Org-admin confirms → status = "confirmed"
6. Teacher (per assignment) gets a Stage 5 card on /teacher/learners/:id,
   adds CELTA-grade sign-off, status = "signed"
7. The ILR claim row for this learner becomes "ready" — visible on
   the org-admin cohort dashboard ILR-readiness column.

Acceptance criteria:
- All 3 user types (learner, org-admin, teacher) see the right view
  at the right time
- Status transitions match the backend state machine
- L1 summary respects RTL for Arabic/Urdu/Pashto/Farsi
- The "ready" flag on the cohort dashboard updates in <30s of teacher
  sign-off (react-query invalidation or polling)
```

---

## Phase F8 — Org admin (Project Silk) completion 🟡 PARTIAL

### Backend deps

- Phase 15 (bulk import + cohort dashboard)
- Phase 16 (ILR CSV export)
- Phase 17 (Stage 5 review)
- Phase 20 (invoicing)

### Status

Project-Silk org-admin pages exist at `/org-admin/*` — Dashboard, LearnerDetail, BulkImport, TeacherAssignment, Stage5Review. Legacy `/org/*` pages still exist too. Decide canonical, mute the other.

### Prompt

```text
Complete the Project-Silk org-admin shell.

Files:
- src/modules/esol/pages/orgAdmin/{Dashboard, LearnerDetail,
  BulkImport, TeacherAssignment, Stage5Review}.tsx
- src/modules/esol/api/orgAdminApi.ts
- src/modules/esol/api/evidenceReportApi.ts
- src/modules/esol/lib/types/orgAdmin.ts

Backend endpoints (verify these exist before wiring):
- GET  /org-admin/learners (cohort dashboard list)
- GET  /org-admin/learners/:id
- POST /org-admin/learners/import (multipart CSV)
- GET  /org-admin/learners/import/:jobId/status
- GET  /org-admin/teachers
- POST /org-admin/teachers/:teacherId/assign-learners
- GET  /org-admin/ilr/export (returns CSV download)
- GET  /org-admin/ilr/export/companion (returns JSON)
- GET  /org-admin/evidence-report?learner_id=...&stage=...

Acceptance criteria:
1. /org-admin/dashboard — cohort table with columns: name, level,
   teacher, GLH (AI + teacher split), ILR readiness, last activity.
   GLH column flags ratio breaches (teacher hours <10% or >20%).
2. /org-admin/import — CSV uploader. After upload, job status
   polls every 2s and renders the per-row validation report.
3. /org-admin/teachers — list of org-attached teachers with
   "Assign learners" button → multi-select modal.
4. /org-admin/learners/:id — same as teacher LearnerDetail but
   includes the ILR row + RARPA stage timeline.
5. ILR CSV export button on dashboard — downloads CSV + JSON
   companion in a zip, triggers a toast with the row count.
6. Decide: keep /org-admin/* as canonical, hide the legacy /org/*
   from the sidebar (but leave the routes for the next month so
   old bookmarks don't 404).

Sidebar: ensure `dashboard/layout/Sidebar.tsx` (or the org-admin
slice of it) lists: Dashboard, Learners, Import, Teachers, Stage 5
queue, Invoices, Settings. Active state highlights based on path.

Run tsc + click through every link.
```

---

## Phase F9 — Invoicing (org admin + amber admin) 🔵 PENDING UI POLISH

### Backend deps

- Phase 20 — invoicing service, line items per learner-week

### Status

`OrgInvoices.tsx` + `AdminInvoices.tsx` exist. Likely need data wiring + download.

### Prompt

```text
Complete invoicing UI for the org-admin and Amber-admin sides.

Files:
- src/modules/dashboard/pages/orgAdmin/OrgInvoices.tsx
- src/modules/dashboard/pages/admin/AdminInvoices.tsx
- src/modules/dashboard/lib/api/esolInvoice.ts
- src/modules/dashboard/lib/types/  (invoice type)

Backend endpoints:
- GET  /invoices?org_id=&status=draft|issued|paid
- GET  /invoices/:id
- GET  /invoices/:id/pdf            (returns PDF stream)
- POST /invoices/:id/issue          (admin only)
- POST /invoices/:id/mark-paid      (admin only)

Acceptance criteria:
1. /org/invoices — org admin sees their own invoices: list with
   status pill, total, period, due date. Click row → detail with
   line-item table (learner × weeks × outcome rate) and Download PDF.
2. /admin/invoices — Amber admin sees all invoices across orgs,
   can filter by org + status, can issue (draft → issued) and
   mark-paid (issued → paid). Bulk-issue button at top.
3. Both pages show running totals and a "next bill cycle" estimate.

Use the api/ hooks pattern. The PDF download uses window.location
or a hidden anchor — no need for axios for the binary.
```

---

## Phase F10 — Amber super-admin completion 🟡 PARTIAL

### Backend deps

- Final Addendum §1 (queues + failed jobs)
- Final Addendum §2 (compliance config versioned)
- Final Addendum §3 (per-org overrides)
- Final Addendum §4 (teacher utilisation)
- Final Addendum §12 (GLH analytics)
- Final Addendum §13 (sales intelligence)
- Phase 21 (MIS adapter settings)

### Status

All Project-Silk admin pages exist + their api hooks. Audit completeness:

### Prompt

```text
Audit and finalise the Project-Silk Amber super-admin shell.

Pages to verify (each must render against live data, no mocked
fallbacks):
- /admin/overview        — Overview.tsx + adminOrgsApi.ts
- /admin/orgs/:id        — OrgDetail.tsx
- /admin/compliance-config — ComplianceConfig.tsx + complianceConfigApi.ts
- /admin/queues          — Queues.tsx + queuesApi.ts (Bull Board deep-link)
- /admin/teacher-utilisation — TeacherUtilisation.tsx + teacherUtilisationApi.ts
- /admin/failed-jobs     — FailedJobs.tsx + failedJobsApi.ts (replay button)
- /admin/glh-analytics   — GlhAnalytics.tsx + glhAnalyticsApi.ts
- /admin/sales-intelligence — SalesIntelligence.tsx + salesIntelligenceApi.ts
- /admin/mis-settings (per-org) — uses misSettingsApi.ts inside OrgDetail
- /admin/safeguarding    — AdminSafeguardingAlerts (covered in F5)
- /admin/calibration     — PlacementCalibration.tsx (cohort-level question
                            calibration, Phase 8)

For each page, check:
1. Hooks call the right endpoint with the right query params
2. Empty / loading / error states all render
3. Charts (where present) use a single chart lib — pick one and
   standardise (recharts is most likely already installed)
4. CSV export buttons (where present) work and toast on success
5. Pagination is wired where the dataset can grow

ComplianceConfig specifically — Final Addendum §2:
- Diff view between active version and draft
- "Publish new version" requires non-empty changelog
- Per-org override section (Final Addendum §3) — choose org from
  dropdown, see effective config (org override layered on global)

FailedJobs:
- Tabs: Failed / Retrying / Dead-lettered
- Replay button per row + bulk-replay
- JSON payload modal on row click

GlhAnalytics:
- Cross-org chart: AI hours vs teacher hours per week
- Ratio gauge (target 10–20% teacher)
- CSV export

SalesIntelligence:
- ROI calculator submission feed
- Top organisations by computed gap
- Outreach status pill (cold / contacted / demo-booked / signed)
- CSV export of leads

Sidebar nav for admin shell: rebuild the Project-Silk nav (separate
from legacy /admin/home) so the new pages are prominent.

Run tsc + click through every link.
```

---

## Phase F11 — MIS adapter wiring (per-org MIS settings) 🔵 PENDING

### Backend deps

- Phase 21 (ProSolution + Maytas + EBS adapters, AdapterFactory,
  push + compliance-validation workers, delta-sync cron)

### Status

`misSettingsApi.ts` exists. Page surface for per-org adapter setup,
sync status, and conflict resolution likely incomplete.

### Prompt

```text
Build the MIS adapter UI inside the org-detail and per-org settings.

Files:
- src/modules/admin/pages/OrgDetail.tsx (add MIS section)
- src/modules/dashboard/pages/orgAdmin/OrgSettings.tsx (org admin's
  read-only view of their adapter status)
- src/modules/admin/api/misSettingsApi.ts (already exists)
- src/modules/admin/lib/types/misSettings.ts (already exists)

Backend endpoints (Phase 21):
- GET  /admin/orgs/:id/mis-settings
- POST /admin/orgs/:id/mis-settings (body: { adapter: 'prosolution'|
  'maytas'|'ebs', credentials, sync_mode, schedule })
- POST /admin/orgs/:id/mis-settings/test-connection
- GET  /admin/orgs/:id/mis-sync-log?from=...&to=...
- POST /admin/orgs/:id/mis-sync/run     (manual trigger)
- GET  /admin/orgs/:id/mis-conflicts    (rows that failed compliance
                                          validation)
- POST /admin/orgs/:id/mis-conflicts/:rowId/resolve

Acceptance criteria:
1. OrgDetail.tsx grows a "MIS integration" tab.
2. Adapter picker (radio): None / ProSolution / Maytas / EBS.
   Selecting reveals credential fields specific to that adapter
   (read from the type definition).
3. "Test connection" button calls /test-connection, renders the
   response inline (green/red banner).
4. Sync schedule: cron expression input + human-readable preview
   ("Runs daily at 02:00 UK").
5. Sync log table: timestamp, direction (push/pull), record count,
   status, duration. Paginated.
6. Conflicts panel: rows that failed compliance validation. Each
   row expandable, with a "Resolve" form (free-text reason +
   accept / reject buttons).
7. Manual "Sync now" button — confirm modal + toast on enqueue.
8. Org-admin sees a read-only mirror of all of this on /org/settings
   (cannot edit credentials, can trigger manual sync).

Run tsc + smoke-test against a seeded org.
```

---

## Phase F12 — Messaging + notifications cross-shell 🟡 PARTIAL

### Backend deps

- Phase 19 (messaging + translation)
- Phase 24 (teacher messaging)
- Final Addendum §11 (re-engagement cron)
- A notifications endpoint (likely Phase 23 or similar)

### Status

Messaging UI exists for learner (`Messages.tsx`), teacher (`TutorMessages.tsx`, `teacher/Dashboard.tsx` modal), and admin (`AdminTickets.tsx`). Need a unified inbox model + cross-shell unread badge.

### Prompt

```text
Unify messaging + notification UX across shells.

Files:
- src/modules/dashboard/lib/api/messaging.ts
- src/modules/dashboard/lib/api/notifications.ts
- src/modules/dashboard/lib/types/messaging.ts
- src/modules/dashboard/lib/types/notifications.ts
- src/modules/dashboard/pages/student/Messages.tsx
- src/modules/dashboard/pages/tutor/TutorMessages.tsx
- src/modules/teacher/pages/Dashboard.tsx (existing message modal)
- src/modules/esol/api/learnerMessagesApi.ts
- src/modules/dashboard/layout/{MainLayout, Sidebar, Topbar}.tsx
  (add the unread badge)

Backend endpoints:
- GET  /messages?thread=&before=     — paginated thread
- POST /messages                    — send (body: { recipient_id,
                                          body, body_l1?, translation_id? })
- POST /messages/:id/read           — mark read
- POST /messages/translate-preview  — { body, target_lang } → preview
- GET  /notifications?status=unread — generic notifications feed
- POST /notifications/:id/read

Acceptance criteria:
1. Topbar in every authed shell shows a bell icon + unread count
   (notifications + messages combined). Poll every 30s OR use
   visibility-change to refetch on tab focus.
2. Click bell → dropdown with the 10 most recent items, "See all" link.
3. Learner /messages — full inbox + thread view. Translation preview
   on every reply (toggle: send in English / send in L1 / send both).
4. Teacher message modal (Final Addendum §11) — translation preview
   live as they type. Send creates the message + a notification on
   the learner's side.
5. Re-engagement cron messages (Final Addendum §11) are flagged
   with a small "Auto-sent" badge to distinguish from teacher writes.

Run tsc + verify the bell badge updates within 30s of a send.
```

---

## Phase F13 — Bulk import + CSV download flows 🟡 PARTIAL

### Backend deps

- Phase 15 (cohort + bulk import)
- Phase 16 (ILR CSV + companion JSON)

### Status

`BulkImport.tsx` exists. Needs polish: progress bar, per-row error report download, retry mechanism.

### Prompt

```text
Harden the bulk-import UX so a 500-row CSV with 30 errors doesn't
require devtools to debug.

Files:
- src/modules/esol/pages/orgAdmin/BulkImport.tsx
- src/modules/esol/api/orgAdminApi.ts

Endpoints:
- POST /org-admin/learners/import (multipart, returns job_id)
- GET  /org-admin/learners/import/:jobId/status
       (returns: { total, processed, succeeded, failed, errors:
         [{ row, message, raw }] })
- POST /org-admin/learners/import/:jobId/retry-failed (returns new job_id)
- GET  /org-admin/learners/import/:jobId/error-report.csv

Acceptance criteria:
1. Pre-upload: CSV template download link at top of page, with
   the required columns documented inline.
2. Drop / select CSV → POST → render a progress bar polling
   /status every 2s.
3. Live counts as it runs: processed / succeeded / failed.
4. On complete: success card if 0 errors; otherwise error report
   table with sortable columns + download-CSV link.
5. "Retry failed only" button at bottom of error table.
6. Background job survives page refresh (state persisted by
   job_id in URL query string).

Run tsc + import a deliberately-bad CSV to verify the error path.
```

---

## Phase F14 — Public ROI calculator (polish) ✅ DONE

### Backend deps

- Phase 26 + Final Addendum §13

### Status

Done. Only need a single polish pass after F1 finishes (visual harmony with new platform pages).

### Prompt

```text
Light polish pass on /roi-calculator after the platform redesign.
File: src/modules/public/pages/RoiCalculator.tsx

Acceptance criteria:
1. The calculator's chrome (font, colour, button styling) reads
   as a sibling of the new platform pages — not as an outlier.
2. Submission flow still works: input → calculate → results card
   → "Email me the report" capture → PDF export download.
3. Backend's submission logging (Final Addendum §13) still records
   each submit — verify in /admin/sales-intelligence.
4. The link from outreach emails (REACT_APP_FRONTEND_URL/roi-calculator?prefill=...)
   still hydrates the inputs from the query string.

Run tsc + smoke-test the prefill link.
```

---

## Phase F15 — Demo mode UI + role-gate hardening 🔵 PENDING (M3)

### Backend deps

- Function 16 — DEMO_MODE=true on the backend stamps every response
  with X-Demo-Mode

### Status

M3 task open. Plumbing exists (axios interceptor captures header,
setDemoMode helper) — needs UI surface + role-gate audit.

### Prompt

```text
Surface demo mode in the UI and harden role gates.

Files:
- src/lib/demoMode.ts (already exists — verify the store works)
- src/components/DemoBanner.tsx (new — persistent banner)
- src/modules/dashboard/layout/MainLayout.tsx (mount banner)
- src/modules/dashboard/components/routes/RoleRoute.tsx
- src/modules/dashboard/context/AuthContext.tsx

Acceptance criteria:
1. When X-Demo-Mode is true:
   - Yellow banner across the top of every authed shell: "Demo
     environment — data is reset nightly. Do not enter live learner
     records."
   - All ILR export buttons disabled with a tooltip
   - All MIS sync buttons disabled with a tooltip
   - The org-admin "Issue invoice" button disabled
2. Role-gate hardening — audit every RoleRoute usage:
   - /admin/* requires role === "admin"
   - /org-admin/* requires role === "org_admin"
   - /teacher/* additionally requires esol_teacher_approved +
     dbs_check_status === "cleared" (server-enforced; UI shows a
     "Approval pending" page if the JWT has role=tutor but missing
     these flags)
   - /org/* (legacy) and /tutor/* (legacy) accept the modern roles
     too (org_admin can see /org/*; tutor can see /tutor/* if not
     yet approved as teacher)
3. Add a /__diag panel section listing the current user's role +
   the demo-mode state.

Run tsc + test each role on a demo deployment.
```

---

## Phase F16 — A11y + WCAG 2.1 AA sweep 🔵 PENDING (M4)

### Backend deps

- None — purely client work

### Status

M4 task open.

### Prompt

```text
WCAG 2.1 AA pass over every routed page.

Process:
1. Install eslint-plugin-jsx-a11y if not already present.
   Add it to .eslintrc and fix every error (not warning).
2. Manual sweep using axe-core devtools extension on every route:
   - / (Home)
   - /for-organisations
   - /bridge-method
   - /about, /help, /contact, /privacy, /terms
   - /login, /signup, /forgot-password, /reset-password/test/test,
     /confirm-email, /verify/test/test
   - /join (every step)
   - /esol/home, /esol/placement, /esol/session/test, /esol/vocab,
     /esol/stage5/test
   - /tutor/home, /teacher/dashboard, /teacher/learners/test
   - /org-admin/dashboard + every org-admin subpage
   - /admin/overview + every admin subpage

For each violation:
- Missing alt text → add alt
- Missing label → add <label htmlFor> or aria-label
- Insufficient contrast (4.5:1 for body, 3:1 for big text) → tweak
  the design-system variables (warn before editing — these are
  brand colours)
- Missing focus indicator → ensure :focus-visible has the orange
  outline (already in amber-design-system.css for .amber-platform —
  add the same rule globally for dashboard shells)
- Keyboard trap → fix (mostly modals)
- Skip-to-content link missing → add at top of every layout

Acceptance:
- axe-core reports zero violations on every route
- Tab-only navigation reaches every CTA on every page
- Screen reader (VoiceOver on Mac) announces every form field
  with its label
- The platform Home + For Providers + Bridge Method already pass —
  use them as the reference

Run tsc + axe-core check. Submit a PR per shell so review is tractable.
```

---

## Phase F17 — Cross-shell SSO + role-default redirect 🟡 PARTIAL

### Backend deps

- Phase 1 (auth)
- M0.4 cookie-domain work (done)

### Status

SSO works on same-origin (dev). Cookie domain set for prod.
Role-default redirect uses scattered logic — centralise.

### Prompt

```text
Centralise role → default-home routing and verify SSO end-to-end.

Files:
- src/utils/roleHome.ts (new)
- src/modules/dashboard/pages/onboarding/Login.tsx
- src/modules/dashboard/context/AuthContext.tsx
- src/modules/dashboard/components/routes/PrivateRoute.tsx

Define the helper:

  export function roleHome(user: AuthUser): string {
    if (user.role === "admin") return "/admin/overview";
    if (user.role === "org_admin") return "/org-admin/dashboard";
    if (user.role === "tutor") {
      if (user.esol_teacher_approved && user.dbs_check_status === "cleared") {
        return "/teacher/dashboard";
      }
      return "/tutor/home";
    }
    if (user.role === "student") {
      if (user.org_id) return "/esol/home";
      return "/";  // legacy marketplace student
    }
    return "/";
  }

Call it from:
- Login.tsx post-login navigate
- VerifyEmail.tsx post-verify navigate
- PrivateRoute.tsx when at "/" with a logged-in user
- AuthContext bootstrap if landing on a public route with a session

Cross-shell SSO verification:
1. Log in at /login as org_admin → land on /org-admin/dashboard
2. Navigate to /admin/overview directly → redirected (RoleRoute)
3. Open new tab, paste localhost:3000/teacher/dashboard → because
   same-origin same-cookie, the session persists; if not authorized,
   bounce to login or 403
4. Log out from /esol/home → redirect to /
5. In prod (different REACT_APP_COOKIE_DOMAIN), confirm subdomain
   crossing (app.amberesol.co.uk → learn.amberesol.co.uk) keeps
   the session via the parent-domain cookie

Run tsc + smoke-test all five paths.
```

---

## Phase F18 — End-to-end cross-shell QA 🔵 PENDING

### Backend deps

- All phases must be running

### Status

Not started. This is the "fly the whole plane through the storm" pass.

### Prompt

```text
Run end-to-end smoke tests across the entire stack — every user
journey end-to-end, every shell visited.

Scenarios (script each in a Playwright spec or a manual checklist —
your call):

1. New org signs up via /contact form → Amber-admin sees the lead
   in /admin/sales-intelligence → manually creates org →
   provisions org-admin account → org-admin logs in.

2. Org-admin uploads 25-learner CSV → all 25 import successfully →
   org-admin assigns 10 to one teacher, 15 to another → both
   teachers see their assignments on /teacher/dashboard.

3. Learner #1 receives referral link → completes /join wizard
   (token verify → personal → eligibility → ULN → complete) →
   takes /esol/placement → assigned A2 → starts /esol/home →
   completes a GP-appointment scenario → vocab additions appear
   in /esol/vocab → after 6 sessions, level-up triggers Stage 5
   review → learner self-assesses → org-admin confirms →
   teacher signs off → ILR row reads "ready".

4. Safeguarding trigger during session 5 → AdminSafeguardingAlerts
   shows new alert → DSL acknowledges with note → status flips
   to acknowledged → SLA timer stops.

5. Teacher messages learner in their L1 (Arabic) → translation
   preview accurate → learner sees the message in /esol/home
   banner → reads it → unread count decrements.

6. End of month: org-admin downloads ILR CSV + companion JSON →
   amber-admin issues invoice → org-admin downloads PDF → marks
   paid (admin only) → status transitions visible to both.

7. MIS push: Amber-admin configures ProSolution adapter on the org
   → test-connection passes → manual sync runs → sync log shows
   25 records pushed → any compliance-validation failures appear
   in conflicts panel.

8. Role gate hardening: log in as student → try /admin/orgs URL →
   bounced. Log in as tutor without esol_teacher_approved → try
   /teacher/dashboard → bounced to /tutor/home with a banner.

Acceptance:
- Every scenario completes without console errors
- Every scenario produces the expected backend state (verify via
  /__diag or directly via psql)
- Any bug found gets a dedicated task before going to F19

Output: a docs/E2E_QA_REPORT.md with each scenario, pass/fail,
screenshot of the final state, and links to bugs filed.
```

---

## Phase F19 — Production deploy hardening 🔵 PENDING

### Backend deps

- All phases shipped

### Status

Final phase before launch.

### Prompt

```text
Pre-launch hardening across the frontend.

Files to touch:
- .env.production (create if not present)
- src/index.tsx (add error boundary)
- src/components/ErrorBoundary.tsx (new)
- public/index.html (meta tags, favicon)
- src/lib/network/axios.ts (add Sentry-style error reporter)
- public/robots.txt, public/sitemap.xml

Acceptance criteria:
1. Env vars validated at boot — if REACT_APP_BACKEND_URL is missing,
   render a "Misconfigured deploy" screen, don't 500.
2. ErrorBoundary at the top of the React tree catches render
   errors, logs to console + posts to /api/client-errors (Phase
   X helper endpoint), shows a "Something went wrong" card with
   a Refresh button.
3. Performance:
   - Bundle audit: npm run build → analyze with source-map-explorer
   - Lazy-load every page route via React.lazy + Suspense
   - Initial bundle <250 KB gzipped target
4. SEO basics:
   - Per-page <title> + <meta description> (react-helmet-async)
   - Open Graph + Twitter Card meta on every public page
   - Sitemap.xml listing all public routes
   - Robots.txt allow-all for marketing, disallow /admin, /org-admin,
     /teacher, /esol
5. Favicon + apple-touch-icon
6. Analytics: integrate the chosen tracker (plausible? GA4?)
   on public pages only. No tracking inside authed shells without
   consent.
7. Health check: a /_health route on the SPA that returns "ok"
   for the load balancer.
8. Build CI step: tsc + eslint + axe-core on a sample of routes.

Output: a docs/PRE_LAUNCH_CHECKLIST.md with sign-off boxes for
each criterion.
```

---

## 4 · Phase order recap

The recommended sequence:

1. **F1** — finish platform design port (D6–D11)
2. **F2** — auth flow audit (the most-used path)
3. **F3, F4** — learner journey (placement → AI tutor)
4. **F7** — Stage 5 close (completes the learner→teacher→org-admin handoff)
5. **F6** — teacher portal audit (already mostly done)
6. **F5** — safeguarding alerts (gate review here — DSL workflow)
7. **F8** — org-admin shell (Project Silk side)
8. **F9** — invoicing
9. **F10** — amber-admin shell (Project Silk side)
10. **F11** — MIS adapter UI (last big integration piece)
11. **F12, F13** — messaging + bulk import polish
12. **F14, F15** — ROI polish + demo mode
13. **F17** — SSO + role-default centralisation
14. **F16** — A11y sweep
15. **F18** — E2E QA
16. **F19** — production hardening + launch

Each phase produces a working dev surface. Skip a phase only if the
backend dep isn't ready — and note it in the task list with a
blocker tag.

---

## 5 · How to use this document

For each phase:

1. Read the phase's "Status" and "Backend deps" sections — confirm the
   backend is ready.
2. Paste the **Prompt** block into Claude (or another agent) as the
   single instruction.
3. Run the verification ritual (§2.4).
4. Mark the phase ✅ Done in this file and in the task list.
5. Move on.

Estimated effort:

- F1: 2–3 hours (mechanical port)
- F2, F3, F4, F6, F7: 3–5 hours each (integration + UX)
- F8, F10, F11: 5–8 hours each (multiple sub-pages)
- F5, F9, F12, F13, F14, F15: 2–4 hours each
- F16: 1–2 days (full sweep)
- F17: 2 hours (helper + grep)
- F18: 1 day (manual run + bug filing)
- F19: 1 day (final polish + deploy)

Total: ~3 weeks of focused work to "launch-ready."

— end —
