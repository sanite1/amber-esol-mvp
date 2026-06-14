# End-to-end cross-shell QA report — F18

> Manual test pass that exercises every shell (platform → learner →
> teacher → admin → org-admin) end-to-end against the backend's 26
> phases + Final Addendum §1–§13. Pasted into the build plan as the
> "fly the whole plane through the storm" phase.
>
> **Status:** 🔵 Scaffold only — scenarios documented, results matrix
> empty. Fill in as you execute. Each scenario links to the relevant
> backend phase so a failure can be triaged to "frontend bug" vs
> "backend bug" vs "missing wiring" vs "demo-mode placeholder".

---

## 0 · How to run this pass

### Pre-flight checklist

Run these once before opening the browser. If any fail, stop and fix
before running scenarios — they'll cascade.

- [ ] **Backend up.** `curl $BACKEND_URL/health` returns `200` with
      `{ ok: true, demoMode: false }` (or `true` if testing demo).
- [ ] **All 26 phases migrated.** `psql` against the prod-shaped DB,
      run `\dt` — expect tables from phases 1–26 (users, orgs,
      learners, placement_assessments, ai_sessions, vocab_items,
      messages, invoices, mis_sync_logs, safeguarding_alerts,
      stage5_reviews, evidence_reports, ilr_exports, …).
- [ ] **Workers running.** BullMQ queues for evidence-reports,
      ilr-exports, mis-sync, teacher-messages should each show a
      worker attached (`/admin/queues` page, or `redis-cli` against
      the queue keys).
- [ ] **Frontend builds clean.** `npx tsc --noEmit` → 0 errors.
      `npm run lint:a11y` → tracked baseline (see
      `docs/A11Y_SWEEP_BACKLOG.md`).
- [ ] **Diagnostics page reachable on every shell.** Hit
      `/__diag` once unauthenticated (expect public view), once
      logged in as each role (expect the Routing + Demo-mode panels
      populated). This is the single best smoke test we have.
- [ ] **Seed data.** Either run `npm run db:seed` (if it exists) or
      manually create: - 1 amber-admin account - 1 org (Hounslow Adult Learning) with 1 org-admin account - 2 ESOL-approved teachers in that org - 1 ROI lead in the inbox (`/contact` submission)

### Per-scenario routine

For each scenario below, capture in the **results table**:

1. **Date / tester / browser** — Chrome stable + 1 of {Firefox,
   Safari}; note OS.
2. **Pass / fail / blocked.**
3. **Console errors** — open DevTools, filter to errors + warnings.
   Any non-zero count is a fail until triaged.
4. **Network failures** — DevTools → Network → filter status ≥ 400.
   Acceptable: known 4xx on optional endpoints (`/health` 503 in
   demo if backend down). Unacceptable: 5xx, unexpected 404.
5. **Backend state check** — verify via `/__diag` or `psql` that
   the expected row landed.
6. **Screenshot** — final state of the happy-path. Drop into
   `docs/qa-screenshots/F18/<scenario-N>-<step>.png`.
7. **Bug filed** — if fail, link the task / issue here.

---

## 1 · Scenarios

Each scenario follows the FRONTEND_BUILD_PLAN.md F18 prompt verbatim,
expanded into clickable steps with route paths and expected
backend state.

### Scenario 1 — Org sales lead → provisioning → first login

**Backend phases touched:** 1, 2, 3 (auth + orgs + users), Final
Addendum §13 (ROI / sales intelligence).

**Steps**

1. Public visitor opens `/contact`. Fills the form:
   - Name, role, org name, email, phone, message.
2. Submit. Toast: "Message sent." Backend `POST /contact` returns
   200, row in `contact_submissions`.
3. **Switch role to amber-admin.** Login via `/login`.
4. Navigate to `/admin/sales-intelligence`. The new submission
   appears in the leads table, status = "new".
5. Manually create an org via `/admin/orgs` → "+ New org". Fill
   name, postcode, MIS adapter = "none", contract status =
   "trial".
6. From the org detail page (`/admin/orgs/:id`), click "Invite
   org-admin". Enter email of the contact from step 1.
7. **Switch tabs / log out.** Open the invite email link (in dev,
   grab the URL from server logs or `/admin/orgs/:id` invite
   list).
8. Invite link should land on `/join?token=…` → token verify →
   personal details → set password → complete.
9. After complete, user is auto-redirected to `/org-admin/dashboard`
   (verify via `roleHome(user)` in `/__diag`).

**Acceptance**

- `users` row: role = `org_admin`, `orgId` set, `passwordHash`
  non-null.
- `orgs` row: contractStatus = `trial`, primaryContactUserId = the
  new user.
- No console errors. No 5xx in network panel.

---

### Scenario 2 — Bulk learner import + teacher assignment

**Backend phases touched:** 15 (bulk import), 22–23 (teacher
portal).

**Steps**

1. Log in as the org-admin from scenario 1.
2. Navigate to `/org-admin/import` (or `/org/import-learners` —
   legacy alias).
3. Download the CSV template via the "Download template" button.
4. Fill 25 rows: required cols = first name, last name, DOB, email,
   L1 language, ULN (where known), eligibility status.
5. Upload via the dropzone. Wizard goes:
   `upload → preview → validation → commit`.
6. Preview screen lists 25 rows, validation errors highlighted
   inline (e.g. malformed DOB).
7. Commit. Polling spinner. On success: "25 learners imported."
8. Navigate to `/org-admin/dashboard`. Cohort count = 25.
9. Navigate to `/org-admin/teachers` (or legacy `/org/teachers`).
10. Click "Assign learners" on teacher A. Pick 10. Save.
11. Repeat for teacher B with the remaining 15.
12. **Switch role to teacher A.** Log in.
13. `/teacher/dashboard` shows 10 assigned learners. Roster table
    populated. Each row links to `/teacher/learners/:id`.
14. Same for teacher B → 15.

**Acceptance**

- `learners` collection: 25 new docs, all `orgId = <this org>`.
- `learner_teacher_assignments`: 10 with teacher A, 15 with
  teacher B.
- Teacher dashboards reflect counts within 1 query refetch.

**Watch for**

- `bulk-import` BullMQ queue depth should hit 0 within ~5s for
  25 rows. If it stalls, worker not attached → fail F18 pre-flight.

---

### Scenario 3 — Learner referral → placement → 6 sessions → Stage 5 ready

**Backend phases touched:** 4–7 (onboarding), 8 (placement), 9–12
(AI tutor / Bridge Method), 14 (RARPA evidence ledger), 17 (Stage 5),
18 (vocab + spaced repetition).

**Steps**

1. As org-admin, from `/org-admin/learners`, pick learner #1.
   Click "Resend referral link" → copy the link.
2. **Switch to anonymous browser session.** Open the referral URL
   (looks like `/join?token=…`).
3. Wizard steps in order: token verify → personal → eligibility →
   ULN → complete.
4. After complete, lands on `/esol/home`. Banner says "Take your
   placement assessment."
5. Click → `/esol/placement`. 20–30 questions. Submit.
6. Result screen shows assigned level (e.g. **A2**) with the
   rationale chip.
7. Back on `/esol/home`. Scenario catalogue shows 3 A2-appropriate
   scenarios (GP appointment, payslip, housing rights).
8. Open scenario 1 (`/esol/session/s1_gp_appointment`). Complete
   the six-layer Bridge Method flow:
   - Layer 1: vocab pre-teach
   - Layer 2: comprehension
   - Layer 3: guided production
   - Layer 4: roleplay
   - Layer 5: reflection
   - Layer 6: evidence capture
9. After session ends: `/esol/vocab` shows new items added.
   Spaced-rep next-due dates set.
10. Repeat for sessions 2–6 (use same scenario or rotate). Each
    completion adds a row to `ai_sessions` and stamps evidence
    in `evidence_ledger`.
11. After session 6, learner should see a Stage 5 prompt on
    `/esol/home`. Click → `/esol/stage5/:reviewId`.
12. Complete the 4-skill self-assessment (listening / speaking /
    reading / writing). Submit.
13. **Switch role to org-admin.** `/org-admin/dashboard` →
    pending Stage 5 reviews → confirm learner's self-assessment.
14. **Switch role to teacher A.** `/teacher/learners/:id` →
    Stage 5 tab → sign off.
15. **Switch role to amber-admin.** `/admin/overview` → ILR
    readiness widget → learner appears as "ready".

**Acceptance**

- `placement_assessments` row, `result = "A2"`.
- 6 rows in `ai_sessions`, all `status = "completed"`.
- ≥ 6 evidence stamps in `evidence_ledger`.
- `stage5_reviews` row, status timeline = `submitted →
org_admin_confirmed → teacher_signed_off`.
- ILR readiness flag flipped on the learner doc.

**Known gap to verify lands on the report, not silently passes**

- `Stage5PendingTab.tsx` / `Stage5ReviewsTab.tsx` were placeholder
  pages as of F7 (see F8.4 backend follow-up). If step 13 shows
  "Phase 18 pending" copy instead of a real list, that's the
  documented gap — fail this scenario, link to F8.4.

---

### Scenario 4 — Safeguarding trigger → DSL acknowledgement

**Backend phases touched:** 13 (safeguarding overlay).

**Steps**

1. As learner #1, mid-session 5 (or in a fresh session), type a
   phrase that triggers the safeguarding classifier. Use the
   test phrase from the backend test fixtures
   (`backend/test/fixtures/safeguarding-trigger.txt` — typically
   something like "I am being hurt at home").
2. Session UI surfaces an immediate safe-message overlay with
   contact info (Childline / Samaritans depending on age).
3. **Switch role to amber-admin.** `/admin/safeguarding` shows
   a new alert. Row contains: timestamp, learner pseudonym, level
   (high / med / low), excerpt.
4. Click row → detail panel. Click "Acknowledge". Add note ("Called
   DSL at org, awaiting confirmation").
5. Status flips to `acknowledged`. SLA timer (visible badge)
   stops counting up.

**Acceptance**

- `safeguarding_alerts` row: `status = acknowledged`,
  `acknowledgedAt` set, `acknowledgedBy = amber-admin user`,
  `note` non-null.
- SLA badge on the row turns green (within SLA) or amber (close to
  breach) but stops incrementing.

---

### Scenario 5 — Teacher-to-learner L1 message + unread banner

**Backend phases touched:** 19 (messaging + translation), 24
(teacher messaging), Final Addendum §11 (cron + manual + priority).

**Steps**

1. **Login as teacher A.** Navigate to `/teacher/learners/:id` for
   an Arabic-L1 learner.
2. Open the Messages tab. Compose a message in English. Click
   "Preview translation". Arabic preview renders RTL.
3. Approve + send. Toast: "Message sent." Row in
   `teacher_messages` with `trigger = "manual"`.
4. **Switch role to learner.** Navigate to `/esol/home`.
   UnreadMessagesBanner shows unread count = 1 with the L1
   indicator.
5. Click → `/esol/messages`. Message appears, RTL-aligned. Click
   "Mark as read".
6. Back to `/esol/home`. Banner gone.

**Bonus: trigger=cron path**

- Wait for (or manually fire) the daily cron `auto-send-reminders`.
  Verify the auto-sent message arrives with the "Auto-sent" chip
  on `/esol/messages` (per F12.1).

**Acceptance**

- `teacher_messages` row: `read = true`, `readAt` set.
- Translation preview correct script + direction (Arabic RTL).
- No console errors when toggling read state.

---

### Scenario 6 — End-of-month ILR + invoice cycle

**Backend phases touched:** 16 (ILR export), 20 (invoicing).

**Steps**

1. **Org-admin** opens `/org-admin/dashboard` → "Export ILR" CTA.
   IlrExportModal opens (per F8.2).
2. Pick period (e.g. May 2026). Submit. State machine:
   `form → submitting → polling → complete`.
3. Polling spinner with job ID visible. On complete, download CSV
   - companion JSON. Verify:
   * CSV row count = enrolled learners for that period.
   * JSON has `metadata.exportedAt`, `metadata.orgId`, list of
     row hashes matching CSV.
4. **Switch role to amber-admin.** `/admin/invoices` → "Generate
   invoice" → pick org + period. Demo-mode gate respected
   (per F15.1 — button disabled with tooltip in demo).
5. Generated invoice appears in the list. Click row →
   InvoiceDetailModal (F9.1) shows line items, totals, status =
   `pending`.
6. **Switch role to org-admin.** `/org-admin/invoices` (or
   `/org/invoices`). Same invoice listed. Click row → modal.
   Download PDF. Status still `pending` (org-admin cannot
   mark paid).
7. **Switch back to amber-admin.** Click "Mark as paid" on the
   invoice. Confirmation modal. Confirm.
8. Status flips to `paid` everywhere — refresh both shells, verify.

**Acceptance**

- `ilr_exports` row: `status = completed`, `csvHash` + `jsonHash`
  recorded.
- `invoices` row: status timeline `pending → paid`, `paidAt` and
  `paidBy` (amber-admin user) recorded.
- Org-admin shell shows updated status within one query refetch
  (≤ 60s react-query stale time).

---

### Scenario 7 — MIS push (ProSolution adapter)

**Backend phases touched:** 21 (MIS adapters).

**Steps**

1. **Amber-admin** opens `/admin/orgs/:id` → MIS settings tab.
2. Select "ProSolution" adapter. Enter test credentials (sandbox
   API key + endpoint URL from `backend/.env.example`).
3. Click "Test connection". Spinner. Success toast with
   "Connected to ProSolution sandbox v3".
4. Click "Run manual sync now". Job queues. Polling spinner.
5. On complete, sync-log table populates. Latest row:
   - Timestamp
   - Records pushed = 25 (from scenario 2)
   - Records failed = any
   - Conflicts panel populated if validation rules tripped
6. Open conflicts panel → each conflict shows: learner pseudonym,
   field, expected value, MIS value, resolution CTA
   (Override / Skip).

**Acceptance**

- `mis_sync_logs` row: `adapter = "prosolution"`, `status =
completed`, `recordsPushed`, `recordsFailed`, `conflicts[]`.
- BullMQ `mis-sync` queue depth returns to 0.
- If sandbox credentials are wrong, expect a clear error in
  step 3 — not a 500.

---

### Scenario 8 — Role gate hardening

**Backend phases touched:** Routing layer + RoleRoute (F17.1).

**Steps**

1. Log in as a **student** (no `orgId`). Try the following URLs by
   hand-typing into the address bar — all should bounce to
   `roleHome(user)`:
   - `/admin/orgs` → bounces to `/` (student with no org
     → public home).
   - `/teacher/dashboard` → bounces to `/`.
   - `/org-admin/dashboard` → bounces to `/`.
2. Log in as a **tutor** with `esolTeacherApproved = false`. Try:
   - `/teacher/dashboard` → bounces to `/tutor/home`.
   - `/admin/overview` → bounces to `/tutor/home`.
3. Log in as a **tutor** with `esolTeacherApproved = true`. Try:
   - `/teacher/dashboard` → renders the page (allowed).
   - `/admin/orgs` → bounces to `/teacher/dashboard`.
4. Log in as **org-admin**. Try:
   - `/admin/orgs` → bounces to `/org-admin/dashboard`.
   - `/teacher/dashboard` → bounces to `/org-admin/dashboard`.
5. Log in as **amber-admin**. All admin routes render. Try
   `/org-admin/dashboard` → bounces to `/admin/overview` (admin
   is not in the org-admin allow-list).

**Acceptance**

- Every bounce goes to the URL produced by `roleHome(user)`.
- No flicker of the gated content before redirect — the
  `<Navigate replace />` should happen on the first render pass.
- `/__diag` "Routing" panel shows the same `roleHome` value as
  the actual bounce destination. (This is the F17.1 invariant.)

**Watch for**

- A bounce to `/admin/home` or `/org/home` is the **legacy** drift
  RoleRoute used to have. If you see that, F17.1 regressed → file
  a bug.

---

## 2 · Cross-cutting checks

These are not full scenarios but should be exercised once during the
F18 pass on any shell:

### 2.1 Demo-mode flip

- [ ] Backend `/health` returns `demoMode: true`.
- [ ] DemoBanner appears on every shell at the top.
- [ ] Mutation buttons gated by `useIsDemoMode()` are disabled
      with tooltip: - AdminInvoices "Generate invoice" + "Mark paid" (F15.1). - Any other gated control surfaced in F15.
- [ ] Flip `demoMode: false` (restart backend with env unset).
      Refresh frontend. Banner gone, buttons re-enabled.
- [ ] `/__diag` Demo-mode panel shows backend value == frontend
      `useIsDemoMode()` (F15.2 invariant).

### 2.2 401 → /login global redirect

- [ ] While logged in, open DevTools → Application → Local Storage →
      delete the JWT. Click any nav link that fires a query.
- [ ] Axios interceptor (M0.1) should catch the 401 and redirect
      to `/login` with no console error.
- [ ] After re-login, react-query cache is cleared (F2.2) — no
      cross-role bleed visible in any list.

### 2.3 A11y spot-check

Pick 3 pages and tab through with keyboard only:

- [ ] `/login` — every input reachable, labels announced, submit
      via Enter.
- [ ] `/esol/home` — main CTAs reachable, banner Dismiss has a
      visible focus ring.
- [ ] `/admin/overview` — sidebar items reachable, skip-to-content
      link present (per A11Y_SWEEP_BACKLOG.md outstanding item —
      may be missing; note as fail if so).

Then run `npm run lint:a11y` and confirm the violation count is
≤ the F16 baseline. If it's higher, regression.

### 2.4 RTL languages

- [ ] Set learner #1's L1 to Arabic (`ar`). Verify `/esol/messages`
      renders RTL.
- [ ] Repeat for Urdu (`ur`), Pashto (`ps`), Farsi (`fa`). All
      should flip per F12.1.
- [ ] Other shells stay LTR — RTL is per-message, not global.

### 2.5 Cross-shell SSO

- [ ] Log in once as amber-admin. Navigate via address bar between
      `/admin/overview`, `/__diag`, and `/` (marketing landing).
      Auth header survives — no re-prompt.
- [ ] Log out from any shell. JWT cleared from localStorage.
      Navigating to any gated route bounces to `/login`.

---

## 3 · Results matrix

Fill in as you execute. Use ✅ pass / ❌ fail / 🟡 blocked / — n/a.

| #   | Scenario                         | Chrome | Firefox | Safari | Console clean | Backend state OK | Bug filed |
| --- | -------------------------------- | ------ | ------- | ------ | ------------- | ---------------- | --------- |
| 1   | Org sales lead → provisioning    |        |         |        |               |                  |           |
| 2   | Bulk import + teacher assign     |        |         |        |               |                  |           |
| 3   | Learner referral → Stage 5 ready |        |         |        |               |                  |           |
| 4   | Safeguarding trigger → ack       |        |         |        |               |                  |           |
| 5   | Teacher L1 message + banner      |        |         |        |               |                  |           |
| 6   | ILR + invoice cycle              |        |         |        |               |                  |           |
| 7   | MIS ProSolution push             |        |         |        |               |                  |           |
| 8   | Role gate hardening              |        |         |        |               |                  |           |
| C1  | Demo-mode flip                   |        |         |        |               |                  |           |
| C2  | 401 → /login                     |        |         |        |               |                  |           |
| C3  | A11y spot-check                  |        |         |        |               |                  |           |
| C4  | RTL languages                    |        |         |        |               |                  |           |
| C5  | Cross-shell SSO                  |        |         |        |               |                  |           |

---

## 4 · Bugs found

Append rows as you find them. Link to the spawned task / GH issue.

| ID  | Scenario | Severity | Summary | Link |
| --- | -------- | -------- | ------- | ---- |
|     |          |          |         |      |

Severity guide:

- **S1 blocker** — kills a scenario, no workaround.
- **S2 major** — degrades a scenario, ugly but workable.
- **S3 minor** — cosmetic / a11y / nice-to-have.
- **S4 polish** — copy / spacing / icon nit.

---

## 5 · Backend follow-ups still tracked from F1–F17

These were documented as gaps during the build. F18 should
re-verify they're still gaps (not silently fixed by a backend
change) and re-confirm each frontend stub matches the gap
description.

| F-phase  | Gap                                               | Frontend stub location                                      |
| -------- | ------------------------------------------------- | ----------------------------------------------------------- |
| F2.3     | No `POST /users/verify/resend` endpoint           | `ConfirmEmail.tsx` resend button disabled                   |
| F4.2     | No `GET /scenarios` endpoint — JSON files only    | `SCENARIO_CATALOGUE` constant in scenarios util             |
| F8.4     | No Stage 5 list endpoints for org-admin / teacher | `Stage5PendingTab.tsx`, `Stage5ReviewsTab.tsx` placeholders |
| (others) | … re-audit during F18                             | …                                                           |

---

## 6 · Sign-off

When every scenario is ✅ and every C-check is ✅, sign off here:

- Tester: \***\*\*\*\*\***\_\_\***\*\*\*\*\***
- Date: \***\*\*\*\*\***\_\_\_\_\***\*\*\*\*\***
- Backend git SHA: **\*\***\_**\*\***
- Frontend git SHA: \***\*\_\_\_\_\*\***
- Notes: \***\*\*\*\*\***\_\_\_\***\*\*\*\*\***

That's the gate to move to F19 (production deploy hardening).
