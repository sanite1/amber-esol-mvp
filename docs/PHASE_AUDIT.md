# Phase 0 — Pre-flight audit snapshot

> Baseline state before the Final-Addendum gap-closure phases. Captured
> from a code sweep across both repos. Each finding flags what's
> already shipped (so we don't rebuild it) and what's actually
> missing (so we don't skip it).
>
> **Defaults applied for the 4 confirmation questions** (user said "go" without picking):
>
> 1. Phase order: Phase 1 → 5, as proposed
> 2. Phase 5: keep `so`/`ps` alongside the addendum 5 — add Bengali, don't remove
> 3. Phase 2: separate `org_onboarding_completed_at` flag (not tied to ROI specifically) so future onboarding steps can chain off it
> 4. Phase 3: allow "Read later" — track that the modal was shown so we don't re-prompt forever, but don't force-block the learner

---

## 1 · Audit-log surfacing (BE-A / B / C)

### Backend — almost fully built

| Layer                          | Status                                                                                                                                                                                                                        | Path                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `AuditLog` model               | ✅ Built                                                                                                                                                                                                                      | `backend/src/models/AuditLog.ts`                                                            |
| `auditLog.service.ts` (writer) | ✅ Built — used by 17 services                                                                                                                                                                                                | `backend/src/services/auditLog.service.ts`                                                  |
| Writers wired in               | ✅ All of: placement, RARPA, MIS push, MIS hold, safeguarding alert, teacher review, teacher message, level change, eligibility, ULN, bulk import, Stage 5, priority queue, Forskills, cron, session lifecycle, learner nudge | (multiple service files)                                                                    |
| `GET /api/org-admin/audit-log` | ✅ **Fully implemented** with 13-case test suite (A1–A13): org scoping, sort, pagination, filters (learner_id, action, from, to), actor-name resolution, learner-name resolution, system-actor null safety, validation        | `backend/src/{routes,controllers,services}/orgAdminAuditLog.{routes,controller,service}.ts` |

**What's still missing on the backend:**

- `GET /api/learner/me/audit-log` (BE-A) — for the learner's own compliance timeline
- `GET /api/teacher/learners/:id/audit-log` (BE-C) — teacher-scoped

Both are thin wrappers — same `AuditLog.find` shape as the org-admin service, with different auth/scoping. Estimated ~1 hour each.

### Frontend — half-built, partly orphan

| Component                                        | Status                                                                                                                                                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AuditLog.tsx` (BE-B target page)                | 🟡 **Exists but ORPHAN** — `src/modules/esol/pages/orgAdmin/AuditLog.tsx` is not mounted in `dashboard/routes.tsx` and not in the org-admin sidebar                                                                            |
| `ComplianceTimelineTab.tsx`                      | ✅ Mounted as a tab inside the **org-admin's** `/org-admin/learners/:id` page — NOT on the **learner's own** profile. So this fills part of BE-A's intent (admin sees timeline) but not the spec ("learner sees own timeline") |
| API hook                                         | ✅ Exists in `src/modules/esol/api/orgAdminApi.ts`                                                                                                                                                                             |
| Learner-side `/profile` Compliance Timeline tab  | ❌ Not built                                                                                                                                                                                                                   |
| Teacher-side learner-detail audit events sidebar | ❌ Not built                                                                                                                                                                                                                   |

### Phase 1 revised scope (smaller than originally planned)

- 1.1 Backend: 2 new thin endpoints (learner self + teacher), not 1 big endpoint
- 1.2 Frontend (BE-A): new tab on `/profile`
- 1.3 Frontend (BE-B): **just plumbing** — mount the existing `AuditLog.tsx` page + add sidebar item
- 1.4 Frontend (BE-C): new "Activity" section on `/teacher/learners/:id`

Total **revised** effort: ~3 hrs (down from 4–5).

---

## 2 · ROI calculator onboarding embed (BE-G)

### What exists

- Public `/roi-calculator` page — works, anonymous-accessible
- `roi_submissions` collection logs every submission (sales intelligence)
- `/admin/sales-intelligence` admin view

### What's missing

- No first-login flag on `Organisation` (no `onboarding_completed_at`, no `roi_calculator_completed_at`)
- No intercept on `/org-admin/dashboard` mount that redirects to `/roi-calculator?onboarding=true`
- No "skip / mark done" mechanism

### Phase 2 scope (unchanged)

- Add `org_onboarding_completed_at` to Organisation model
- Intercept in `Dashboard.tsx` at org-admin root
- ~1 hour

---

## 3 · Unread messages blocking modal (BE-E)

### What exists

- `UnreadMessagesBanner` mounted on `EsolLearnerHome.tsx` line 501 (dismissible)
- `UnreadMessageModal` exists for messages that arrive **during** a session bootstrap (used in `AiTutorSession`)
- `useUnreadMessages` hook works
- `useMarkTeacherMessageRead` works
- `/esol/messages` inbox page works

### What's missing

- The modal pattern from `AiTutorSession` isn't reused on `/esol/home` — there's only the banner
- No "did the learner already see the modal this session?" tracking

### Phase 3 scope (unchanged)

- Lift the existing modal component
- Show on first dashboard visit when `unread.length > 0` (track via `sessionStorage` keyed by user-id)
- "Read later" closes modal, banner falls back to current behaviour
- ~1.5 hours

---

## 4 · MIS sync UI (BE-D)

### What exists

- 3 adapters: ProSolution, Maytas, EBS
- `AdapterFactory` works
- `mis-push` BullMQ queue
- `delta-sync` cron + worker
- MIS settings tab on org detail page (configure type + creds)

### What's missing

- No `GET /api/admin/orgs/:id/mis/sync-logs` endpoint
- No `GET /api/admin/orgs/:id/mis/conflicts` endpoint
- No `POST /api/admin/orgs/:id/mis/sync-now` trigger endpoint
- No conflict-resolution endpoint
- No frontend MIS Integration tab beyond settings

### Phase 4 scope (unchanged)

- 4 new backend endpoints
- New frontend tab on `/admin/orgs/:id`
- ~4–5 hours

---

## 5 · Languages + templates (BE-F + BE-H)

### Current language coverage by source (deeply audited)

| Source                                                          | Codes present                                                                             | Codes missing per addendum       |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------- |
| Frontend `LANGUAGES` array (`translations.ts`)                  | en, ar, so, fa-AF, ps, yue, zh, es, fr, pt, ru, pl, ro, **bn**, **ur**, pa, tr, ti, am, … | ✅ None — addendum 5 all present |
| AI tutor `BankLang` type (`AiTutorSession.tsx`)                 | en, ar, so, fa, zh                                                                        | ❌ **bn, ur missing**            |
| Placement assessment language banks (`PlacementAssessment.tsx`) | en, ar, so, fa, zh                                                                        | ❌ Same — need to verify exactly |
| Placement bank JSON question fields                             | en, ar, so, fa, zh                                                                        | ❌ Same                          |
| Scenario JSON (vocab translations + cultural notes)             | ar, so, fa, zh per file                                                                   | ❌ Same                          |
| Validation enums (e.g. `esolRegister.validation.ts`)            | TBC — needs inspection                                                                    | TBC                              |
| User model `l1_language` enum                                   | TBC                                                                                       | TBC                              |

### Teacher message templates (BE-H) — actual file inventory

`backend/src/data/teacher-message-templates.json` exists. Inventory:

| Trigger                      | Spec requirement | What's there                                                                                             |
| ---------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| `re_engagement`              | ✅ required      | 🟡 file has `dormant_re_engagement` (close — but spec name is `re_engagement`) in **en, ar, so, fa, zh** |
| `encouragement` (P2 trigger) | ✅ required      | ❌ **missing entirely**                                                                                  |
| `progression` (P3 trigger)   | ✅ required      | ❌ **missing entirely**                                                                                  |

### Phase 5 revised scope

- 5a: rename `dormant_re_engagement` → `re_engagement` (or alias) — verify the cron call site
- 5b: author placeholder `encouragement` + `progression` templates in en, ar, so, fa, zh, **bn, ur**
- 5c: expand `BankLang` type to include `bn`, `ur` — add i18n strings in those two new banks across AI tutor + PlacementAssessment
- 5d: optional — add `bn` / `ur` to scenario JSON files (TODO markers, real translations later)
- 5e: validate enum lists across `validations/` directory

Total: 4–6 hrs (unchanged), but with sharper scope.

---

## 6 · Cross-cutting baseline checks

### Audit-log writers — comprehensive list

The following services call `AuditLog.create` or `AuditLogService.log`:

- `placement.service.ts` (placement_completed)
- `aiSession.service.ts` (session_started, session_completed)
- `orgAdminImport.service.ts` (learner_bulk_imported)
- `orgAdminSessionsImport.service.ts` (historical_session_imported)
- `orgAdminForskillsImport.service.ts` (forskills_imported)
- `esolEligibility.service.ts` (eligibility_declared)
- `esolUln.service.ts` (uln_recorded)
- `esolRegister.service.ts` (learner_registered)
- `teacherAssignment.service.ts` (teacher assignment)
- `learnerNudge.service.ts` (teacher_message_sent — re-engagement cron)
- `progressionCron.service.ts` (level_change_confirmed)
- `adminLevelChange.service.ts` (level_change_confirmed manual)
- `queueProcessors/index.ts` (multiple)
- `evidenceReport.controller.ts` (RARPA evidence)

**Every action the spec wants logged IS being logged.** The work in Phase 1 is purely about surfacing those existing records to the right people.

### Test baseline

- Backend: 39 test files (per Jest config). Last `npx jest` we ran (Redis fix) was 51/51 in the queue-touching suites
- Frontend: 2 test files (per jest config we saw earlier) — `esolRegistration.test.tsx`, `newPagesAxe.test.tsx`

We should run both suites green before starting Phase 1 to confirm baseline.

### Mid-flight runtime caveats found during audit

- ROI calculator embed (BE-G) depends on the org-admin landing page logic — currently `/org-admin/dashboard` renders directly with no intercept. We'll add the intercept in the page component, not via a route layer, so route gating stays clean.
- The audit-log endpoint exists at `/api/org-admin/audit-log` but **the orphan `AuditLog.tsx` may have been built against a different URL** — we need to confirm the page's hook actually targets that URL before assuming it'll "just work" on mount.

---

## 7 · Updated phase plan (with new info)

| Phase     | What                  | Original effort | Revised effort | Why changed                                                                                                                             |
| --------- | --------------------- | --------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 0         | This audit            | 30 min          | ✅ Done        | —                                                                                                                                       |
| 1         | Audit log surfacing   | 4–5 hrs         | **2.5–3 hrs**  | Most of BE-B is just mounting the orphan page. Backend has 1 endpoint done, needs 2 thin wrappers.                                      |
| 2         | ROI onboarding        | 1 hr            | 1 hr           | —                                                                                                                                       |
| 3         | Unread messages modal | 1.5 hrs         | 1.5 hrs        | —                                                                                                                                       |
| 4         | MIS sync UI           | 4–5 hrs         | 4–5 hrs        | —                                                                                                                                       |
| 5         | Languages + templates | 4–6 hrs         | **3–4 hrs**    | Frontend `LANGUAGES` already has bn/ur; only 4–5 narrower sources need updating. Templates file exists, just needs trigger types added. |
| F         | Final QA              | 1–2 hrs         | 1–2 hrs        | —                                                                                                                                       |
| **Total** |                       | 17–22 hrs       | **14–18 hrs**  |                                                                                                                                         |

---

## 8 · Ready-for-Phase-1 checklist

- [x] Audit complete (this doc)
- [x] Backend type-check clean (`npx tsc --noEmit`)
- [x] Audit-log test suite green: **13/13 in `orgAdminAuditLog.test.ts`**
- [x] `AuditLog.tsx` orphan page confirmed targeting `/org-admin/audit-log` (matches backend route)
- [x] Page has an `embedded` prop for dual use — the `ComplianceTimelineTab` already uses this pattern

**Status: ✅ GREEN. Phase 1 ready to start.**

## 9 · Phase 1 detailed task breakdown

### 1.1 Backend — Learner-self audit-log endpoint

- New route: `GET /api/learner/me/audit-log`
- Auth: `isAuthenticated` only (no extra role check — the learner is always allowed to see their own timeline)
- Service: thin reuse of `orgAdminAuditLog.service.ts` patterns, scoped to `learner_id = req.user._id`
- No filters (the learner timeline is short; pagination later)
- Returns same shape as org-admin endpoint for frontend reuse

### 1.2 Backend — Teacher-scoped audit-log endpoint

- New route: `GET /api/teacher/learners/:id/audit-log`
- Auth: `isAuthenticated + requireTeacherRole + requireOrgContext`
- Service: scoped to `learner_id = :id` AND `org_id = teacher's org`
- 403 if the teacher is not assigned to this learner (matches the existing pattern in `getTeacherLearnerDetail`)

### 1.3 Frontend — Mount BE-B

- Import `AuditLog` in `dashboard/routes.tsx` (lazy)
- Add route: `/org-admin/audit-log` inside the org_admin RoleRoute block
- Add sidebar item: "Audit log" with shield icon
- Verify it renders against real data (or empty state)

### 1.4 Frontend — Learner BE-A

- New tab on `/profile` (only for ESOL learners — gated on `esolLevel` like the existing `EsolPlacementSection`)
- New hook `useLearnerAuditLog()` in dashboard api layer
- Reuse `AuditLog.tsx` with new `embedded="learner-self"` mode OR build a dedicated `LearnerComplianceTimeline` component (smaller surface — TBD when we start)

### 1.5 Frontend — Teacher BE-C

- New "Activity" section on `/teacher/learners/:id` page
- New hook `useTeacherLearnerAuditLog(id)`
- Reuse `AuditLog.tsx` embedded mode

### 1.6 Tests

- Add backend tests: `learnerAuditLog.test.ts` mirroring 4–5 key cases from `orgAdminAuditLog.test.ts` (auth scope, sort, learner isolation, action filter)
- Add: `teacherAuditLog.test.ts` — same + 403 case
- Frontend: smoke-test the new sidebar route renders

### 1.7 Connected flows to audit before / after

- `/org-admin/learners/:id` — Compliance Timeline tab unchanged (uses same `AuditLog.tsx` embedded)
- `/admin/sales-intelligence` — no change
- `/__diag` — no change
- Auth interceptor + role gates — unchanged
- Backend: `/api/org-admin/audit-log` — unchanged (existing 13 tests must still pass after we add the 2 new routes)

### Phase 1 acceptance criteria

- New learner self endpoint returns only that learner's events
- New teacher endpoint enforces 403 for unassigned learner
- Org-admin `/org-admin/audit-log` route reachable from sidebar
- Learner `/profile` shows a Compliance Timeline tab
- Teacher `/teacher/learners/:id` shows an Activity section
- No regression in `orgAdminAuditLog.test.ts` (still 13/13)
- No regression in `npx tsc --noEmit`
