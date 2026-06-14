# Project Silk — Final Addendum Audit & Full Test Plan

_Audited 2026-06-11 against `Project Silk Final Addendum.docx` (May 2026). Repos: `amber-esol-mvp` (frontend) + `amber-esol-backend`._

## Part A — Addendum audit (S1–S13; S14 is sales-only)

| §   | Section                       | Verdict | Notes                                                                                                                                                                                                                                                 |
| --- | ----------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S1  | Async queues (BullMQ + Redis) | ✅ 7/7  | All 8 spec queues + cache-refresh, workers, 202+jobId, /jobs status, failed_jobs + dead-letter, Bull Board at /admin/queues                                                                                                                           |
| S2  | Pre-caching                   | ⚠️ 4/6  | Gemini singleton, SafeguardingDetector, PostcodeRouter, FALACache all done. **MISSING: admin CMS for safeguarding response text** (static JSON, needs deploy to edit). Postcode August refresh is alert + manual reload (acceptable per spec wording) |
| S3  | Config-driven compliance      | ⚠️ 7/8  | ComplianceConfig model/service/admin editor done; ILR/RARPA/ASF rules in DB. **PARTIAL: 1-Aug year transition is manual** (documented runbook step, no auto-activate cron)                                                                            |
| S4  | Data models                   | ✅ 5/5  | All User/Org fields, TeacherReview (append-only + indexes), TeacherMessage, idempotent migration script                                                                                                                                               |
| S5  | Idempotency                   | ✅ 5/5  | TTL 90d + unique key; ILR, RARPA, MIS-push wrapped. Delta-sync is read-side reconciliation — wrapping N/A by design                                                                                                                                   |
| S6  | Audit log                     | ⚠️ 6/8  | Model append-only, service, all 7 log call-sites, learner Compliance Timeline, org-admin Audit Log tab + PDF, ILR companion JSON. **PARTIAL: RARPA evidence PDF provenance embed unverified. MISSING: Amber-admin cross-org audit search**            |
| S7  | MIS adapter pattern           | ✅ 6/6  | MISRecord, IMISAdapter, ProSolution (MVP) + Maytas/EBS (intentional stubs), AdapterFactory, encrypted org credentials, admin MIS settings UI                                                                                                          |
| S8  | Teacher middleware            | ✅ 2/2  | requireTeacherRole (role + approved + DBS cleared), /api/teacher router                                                                                                                                                                               |
| S9  | Function 18 Teacher dashboard | ✅ 8/8  | Cohort table, detail w/ 403 guard, review/pathway/rarpa-signoff writes, audit on all writes, FE dashboard + detail + action bar                                                                                                                       |
| S10 | Function 19 Priority queue    | ✅ 7/7  | P1–P4 triggers, plain-English actions (localised JSON), daily cron + on-demand recalc, clickable actions, audit on change. (Trigger thresholds adapted slightly vs spec — e.g. dormancy banding — deliberate calibration)                             |
| S11 | Function 20 Messaging         | ✅ 5/5  | Send endpoint + email via queue + TeacherReview + recalc; templates (3 triggers × 7 langs, translations partly pending Phase 19); send modal; learner blocking modal + mark-as-read; audit                                                            |
| S12 | Function 21 GLH/ILR           | ⚠️ 4/6  | Formula + companion JSON + org-admin GLH column + admin utilisation analytics done. **PARTIAL: per-review-type GLH credits deviate from spec** (see gap 1). **PARTIAL: funding-evidence-report teacher-oversight section pending Phase 14**           |
| S13 | ROI calculator                | ⚠️ 4/6  | Public page, real-time calc, PDF, submission logging + sales-intelligence admin page, onboarding embed all done. **PARTIAL: no clawback-risk output; defaults drift from spec (£750 vs £800 rate, £15 vs £16/learner, number input not slider)**      |

**Headline: 70 of 79 audited to-dos fully done; 7 partial; 2 missing.** The teacher multiplier model (S8–S11) is complete end to end.

### Punch list — ALL CLOSED 2026-06-11 (same day as the audit)

1. ✅ **GLH per-review-type credits (S12).** New single source of truth `teacherGlhContribution.ts` (async 0.25h / pathway 0.25h / sign-off 0.5h / contact duration÷60) applied at every TeacherReview creation site — review log, pathway override, RARPA sign-off, and message send (which previously created no review at all; it now logs the spec'd 5-minute contact_session). 6 unit tests pin the table.
2. ✅ **Amber-admin cross-org audit search (S6).** `GET /api/admin/audit-log` (optional org filter, action/date/learner filters, paginated, org names per row) + admin page at `/admin/audit-search` (Compliance nav group).
3. ✅ **Safeguarding response-text CMS (S2).** `SafeguardingMessage` collection (seeded from the JSON on first boot), admin CRUD at `/api/admin/safeguarding-messages` with live in-memory bank reload (no deployment), audit on every edit, editor page at `/admin/safeguarding-messages` (per-language tabs, RTL-aware, English-can't-be-empty rule).
4. ✅ **RARPA evidence PDF provenance (S6).** New "§11 Evidence provenance" section in the evidence-report PDF: per-stage audit-entry counts + latest timestamps + active RARPA rule-set version. (Verification also found the report's ILR section already stamped config version.)
5. ✅ **Teacher oversight hours section (S12)** — audit finding was stale: `teacher_oversight_rows` + `teacher_oversight_aggregates` already render as §8 of the evidence-report PDF. No work needed.
6. ✅ **ROI clawback-risk figure (S13).** `funding_at_risk_annual` (current throughput × rate) added to the calculator + amber risk strip on the page + PDF. £750/£15 pricing left as-is — the constants trace to the main brief's placeholders; flag to Joey whether the addendum's £800/£16 supersedes them.
7. ✅ **Academic-year auto-activation (S3).** New cron `GET /api/cron/academic-year-transition` (vercel.json: 1 Aug 06:00): activates pre-created new-year configs, otherwise rolls the prior year's rules over as v1 with a review-required changelog; audits each change and alerts the Amber admin. Previous-year configs untouched for historical lookups.

---

## Part B — Test plan (Amber admin → Org admin → Teacher → Learner)

Conventions: each case is _Action → Expected_. ⚠ = will fail today (known gap above).

### 1. Amber admin

**Access**

- A1. Login as admin → lands on /admin/overview with KPI cards.
- A2. Visit /org-admin/dashboard, /teacher/dashboard, /esol/home as admin → blocked/redirected, no data leak.

**Organisations**

- A3. Provision a new org (name, admin email) → org created; org-admin invite email sent.
- A4. Open org detail → usage analytics render.
- A5. MIS settings on org detail: pick ProSolution, save endpoint + credentials → saved; credentials never echoed back; Test connection returns a result entry.

**Teacher approval**

- A6. Approve a pending ESOL teacher (DBS cleared) → teacher can reach /teacher/dashboard.
- A7. Reject with reason → teacher blocked, reason recorded.
- A8. Unapproved tutor calls any /api/teacher/\* → 403 "Approved ESOL teacher access required".

**Safeguarding**

- A9. Open alerts list; filter by status; open an alert → review modal; resolve → status change + audit row.
- A10. Trigger a safeguarding disclosure in a learner session → critical alert email arrives via notifications queue (content-free payload).
- A11. ⚠ Edit safeguarding response text per language in an admin CMS → no such screen (gap 3).

**Analytics & ops**

- A12. Teacher utilisation page → per-teacher learner count, utilisation %, <60% flagged.
- A13. GLH analytics page → AI / pre-platform / teacher split per org.
- A14. Placement calibration page loads question bank; edits persist.
- A15. Invoices page lists org invoices with statuses.
- A16. Queues page (/admin/queues) lists queues + counts (needs healthy Redis).
- A17. Failed jobs page lists exhausted jobs; dismiss preserves the row (soft delete).
- A18. Sales intelligence: ROI submissions listed with filters; Mark contacted persists; CSV export downloads.

**Compliance config**

- A19. View active config per domain (ilr / rarpa / asf-routing) with version + changelog.
- A20. Edit rules JSON + changelog → new version created, audit row written.
- A21. Activate a version → exactly one active per domain/year; prior version retained.
- A22. ⚠ Cross-org audit search → no surface (gap 2).

### 2. Org admin

**Onboarding & access**

- O1. First-ever login → redirected to /roi-calculator?onboarding=true; Submit or Skip → back to dashboard; never intercepted again.
- O2. Normal login → /org-admin/dashboard (no 404, no marketplace flash).
- O3. Org admin calls /api/admin/\* → 403.

**Invitations**

- O4. Send learner invite → email link valid (30 days), opens /join with email prefilled + locked.
- O5. Re-invite same email while pending → blocked with clear error.
- O6. Revoke pending invite → link shows expired/invalid.
- O7. Remind → invitee gets a fresh email, same token.

**Cohort & learner detail**

- O8. Cohort table: level, status, GLH columns; sort, paginate; teacher GLH tooltip shows the 3-way split.
- O9. Learner detail tabs all render (Overview / Stages / Compliance Timeline / Teacher Reviews).
- O10. Compliance Timeline shows plain-English audit events chronologically; PDF export works.
- O11. Nudge learner → email + success toast; audit row.
- O12. Suggested teachers panel: ranked list, reason chips ("Speaks Arabic", "Teaches Entry 2"), Best match highlighted, ineligible teachers show why (capacity / level); Assign works one-click; current teacher badged.
- O13. Stage 5 pending queue: open review → confirm flow completes and is audited.

**Teacher management**

- O14. Add an approved teacher to the org pool → appears in table with profile chips (levels / languages / specialisms).
- O15. Remove teacher → ConfirmModal; cascade-unassign count reported; learners show unassigned.
- O16. Assign learners modal: multi-select, bulk apply.
- O17. Bulk reassign all of teacher A → teacher B.
- O18. Push a teacher past 80% capacity → amber warning toast + row tint (mutation still succeeds).
- O19. Auto-assign unassigned → summary toast (assigned/skipped + reasons); audit rows say "Auto-assigned (best match): …".

**Other**

- O20. Standalone Audit Log page: filter by date/learner/action; paginate.
- O21. Bulk CSV import → 202 + job status polling; re-running the same file doesn't duplicate learners (idempotency).
- O22. Invoices + settings pages load and save.

### 3. Teacher

**Access & profile**

- T1. Approved + DBS-cleared teacher login → /teacher/dashboard.
- T2. Approved teacher, DBS not cleared → 403 on /api/teacher/\*.
- T3. Set Teaching Profile (levels / languages / specialisms) → saves; display forms normalise ("Entry 2" → e2); invalid specialisms dropped.
- T4. After saving profile, org admin's suggested-teachers ranking reflects it.

**Dashboard (Function 18/19)**

- T5. Cohort sorted P1→P4, colour-coded, then least-recently-reviewed first.
- T6. Recommended action click: P1 → send-message modal; P3 → RARPA sign-off; P2 → learner detail.
- T7. Open a learner NOT assigned to you (direct URL) → 403.
- T8. Learner detail shows: recent sessions w/ scores+modes, vocab retained vs in-progress, Stage 3 objective progress, review history, safeguarding count.

**Actions**

- T9. Log review (contact_session, e.g. 30 min) → TeacherReview created; learner glh_teacher_contact +0.5h; teacher_last_reviewed_at updated; priority recalculates.
- T10. ⚠ Log async_review → spec says +0.25h GLH; today credits duration/60 only (gap 1).
- T11. Adjust pathway (valid scenario ids) → override saved with set_by/set_at; next AI session draws from override; invalid id rejects whole request.
- T12. RARPA Stage 5 sign-off → Stage5Review stamped; second sign-off attempt blocked.
- T13. Send message: template pre-filled by trigger with learner's firstname; optional L1 translation preview; >300 chars rejected; learner receives email; TeacherReview (contact, 5 min) + audit row created.
- T14. After any action → learner's priority/recommended action refreshes without full reload.
- T15. Monitor a live session via ESOL Sessions (/tutor/esol/:sessionId).
- T16. Toggle auto-re-engagement preference → persists; cron respects it.

### 4. Learner

**Onboarding**

- L1. Open invite link → /join with email prefilled and locked.
- L2. Wizard: L1 language, personal details, full nationality list, ONS ethnicity dropdown, residency upload (OCR), ULN optional.
- L3. Complete placement in wizard → real level + rationale (not "Entry 1 @ 0.5" fallback).
- L4. Verification email contains placement level + rationale; cannot log in before verifying.
- L5. Verify email → login works; expired/re-used invite links show clear errors.
- L6. After registration, learner is already assigned a best-match teacher (check org-admin cohort).

**First login & dashboard**

- L7. Placement welcome modal shows once (level + rationale + tips); never again on that device.
- L8. Dashboard full-width; recent sessions; unread-messages banner when applicable.
- L9. Unread teacher message → blocking modal before scenario selection; Mark as read sets read_at and unblocks.

**AI sessions**

- L10. Scenario picker shows level-appropriate scenarios (every level has content).
- L11. Start session → opening message; send → message appears instantly + typing indicator until reply.
- L12. Safeguarding disclosure → instant pre-written signposting (under 5s), session paused, alert raised; message text NOT stored in session turns.
- L13. End & review → "Wrapping up" overlay → score % (mean of turn scores, non-zero after scored turns) + tutor's note + vocab count + emoji feedback.
- L14. Resume an in-progress session from Recent → history hydrates; sending uses same optimistic flow; End works without 403.
- L15. Re-open a completed session → read-only banner + "Start a new scenario"; safeguarding-paused session shows red banner.
- L16. Timer ticks during chat; font-size toggle and language hint work; RTL languages render correctly.

**Vocabulary**

- L17. Vocabulary page: stats (total/mastered/to practise), word cards with "Seen N×", level chip, "Learned in sessions" badge; search + level filter; pagination.
- L18. "I know this" / "Need practice" persist; "Practise in a session" routes to scenarios.
- L19. Words from a just-finished session appear in the ledger (even if Redis is degraded — inline fallback).

**Progress & account**

- L20. Stage 5 self-assessment completes once; refresh shows thank-you state, no double submit.
- L21. Own profile shows Compliance Timeline; change password works; delete account flow confirms via modal.
- L22. All learner pages usable at 425 px wide.

### 5. Public / cross-cutting

- P1. /roi-calculator without login: live calculation, PDF download (branded, plain-English summary), optional contact capture logged to sales intelligence.
- P2. Login/signup/forgot/reset/confirm pages: navy panel fixed, right side scrolls; redirects land in the correct shell per role.
- P3. /\_health returns ok; global 404 page renders for junk URLs.
- P4. Modals everywhere: bottom-sheet on mobile, centered on desktop, blur + 50% navy overlay reaches screen top, Esc/backdrop close (except blocking ones).
