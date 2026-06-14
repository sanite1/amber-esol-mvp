# Marketplace hide-out (Phase 7)

The legacy tutor-marketplace surface — Find Tutors, My Lessons, Tutor
Profile, Tutor Earnings, Admin Students/Tutors/Lessons/Payments, etc.
— is **temporarily hidden** from the platform while we focus on
Project Silk ESOL.

The page components and their routes still exist on disk. Every
hidden surface lives behind a clearly-marked `// ─── MARKETPLACE_HIDDEN
(Phase 7) ─── //` comment block so revival is a clean
search-and-uncomment.

## What changed

| Layer                | File                                                 | What we did                                                                                                                                                                                                                                                                                                                                                       |
| -------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **New page**         | `src/modules/dashboard/pages/AccountNotEnrolled.tsx` | Created the landing screen non-ESOL students / non-approved tutors see when they log in                                                                                                                                                                                                                                                                           |
| **Routing fallback** | `src/utils/roleHome.ts`                              | `roleHome()` now returns `NOT_ENROLLED_HOME` (`/account-not-enrolled`) for marketplace students + marketplace tutors                                                                                                                                                                                                                                              |
| **Route mounts**     | `src/modules/dashboard/routes.tsx`                   | Every marketplace path (`/`, `/tutors`, `/lessons`, `/messages`, `/payments`, `/my-tutors`, `/tutor/*`, `/admin/home`, `/admin/students`, `/admin/tutors`, `/admin/lessons`, `/admin/payments`, `/admin/reviews`, `/admin/settings`, `/admin/tickets`) replaced with `<Navigate to="/account-not-enrolled" replace />` (or `/admin/overview` for the admin paths) |
| **Sidebars**         | `src/modules/dashboard/layout/MainLayout.tsx`        | Marketplace nav groups (Overview/Learning/Account for students; Overview/Teaching/Profile/Account for tutors; Management group for admin; Finance > Payments item) removed from `getMenuSections()`                                                                                                                                                               |

## What stayed

- `/profile` and `/settings` for students — both pages are re-used by ESOL learners (Phase 1 mounted `ComplianceTimelineSection` on `/profile`)
- `/tutor/settings` — only sidebar item retained for tutors, ESOL-approved or not
- `/tutor/esol` + `/teacher/dashboard` + `/teacher/learners/:id` — Project Silk teacher surface, untouched
- `/admin/overview` and every other `/admin/*` Project Silk page (overview, orgs, esol-teachers, safeguarding, calibration, teacher-utilisation, invoices, reports, queues, glh-analytics, sales-intelligence, failed-jobs, compliance-config)
- All `/org/*` org-admin pages (kept per user direction in Phase 7 planning — `OrgAdminDashboard`, `OrgLearners`, etc.)

## Reviving the marketplace

When you're ready to bring it back, do this in **one PR**:

### 1. Revert routes (`src/modules/dashboard/routes.tsx`)

- Find every `<Navigate to="/account-not-enrolled" replace />` (or `/admin/overview` for admin) and replace with the original route element from the matching `// ─── MARKETPLACE_HIDDEN (Phase 7) ─── //` comment block immediately below it
- Delete the comment blocks once you've ported the routes back

### 2. Revert sidebar (`src/modules/dashboard/layout/MainLayout.tsx`)

- Three `// ─── MARKETPLACE_HIDDEN (Phase 7) ─── //` blocks: student section (bottom of `getMenuSections`), tutor section (middle), admin section (top + the Payments item inside Finance)
- For each: uncomment the block and remove the Phase 7 placeholder that sits above it

### 3. Revert role routing (`src/utils/roleHome.ts`)

- Restore the original `return "/tutor/home";` for tutor case
- Restore the original `return "/";` for student case
- Delete the `NOT_ENROLLED_HOME` constant if no other call sites use it

### 4. (Optional) Delete the AccountNotEnrolled page

- `src/modules/dashboard/pages/AccountNotEnrolled.tsx` can be removed once the marketplace surface is back; no other file references it

### 5. Verify

- `npx tsc --noEmit` clean
- `CI=true npm test -- --watchAll=false` green
- Manual: log in as a non-ESOL student and verify `/` renders the marketplace Dashboard, not `/account-not-enrolled`
- Manual: log in as a non-ESOL tutor and verify `/tutor/home` renders the marketplace Tutor Dashboard

## Why we did it this way

- **Hide, don't delete** — the marketplace is a real business surface, just not the focus this iteration. Deleting would force a bigger archaeological dig if Joey ever decides to revive it
- **Single-marker comment block** — every revival site is greppable for `MARKETPLACE_HIDDEN` so a developer with no project context can find them all from cold
- **Real redirects (not 404s)** — a bookmarked marketplace URL lands the user on the "account not enrolled" explainer with a CTA to contact support, not a generic error page
- **Sidebar collapse, not blank** — students keep `/profile` + `/settings`, tutors keep `/tutor/settings`; admins keep the full Project Silk surface. Anyone who logs in still has something to do

## Audit trail

Phase 7 author: Claude · Phase 7 date: 2026-06-09
Sign-off by user: Q&A in chat before any code touched (4 explicit confirmations).
