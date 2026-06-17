// DashboardRoutes.tsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/routes/PrivateRoute";
import MainLayout from "./layout/MainLayout";
import RoleRoute from "./components/routes/RoleRoute";
import RouteFallback from "../../components/RouteFallback";
import "react-quill/dist/quill.snow.css";

// Phase 7 — Marketplace hide-out. The legacy tutor-marketplace pages
// (Find Tutors, My Tutors, Lessons, Payments, Tutor Dashboard, etc.)
// are temporarily HIDDEN from the platform while we focus on the
// Project Silk ESOL surface. The page components still exist on
// disk — see `// ─── MARKETPLACE_HIDDEN (Phase 7) ─── //` blocks
// below for the original mounts. To revive: uncomment those
// blocks AND revert the NOT_ENROLLED_HOME constant in
// src/utils/roleHome.ts. See docs/MARKETPLACE_HIDDEN.md for the
// full revival checklist.
const AccountNotEnrolled = lazy(() => import("./pages/AccountNotEnrolled"));

// ── F19.3 — lazy-loaded page chunks ──────────────────────────────
// Every page below is split into its own bundle. A learner no longer
// downloads the admin pages, an org-admin no longer downloads the
// tutor pages, etc. The role-gated <Route> trees inside still control
// access; lazy() just defers the *download* until the route matches.
//
// Auth + ErrorPage are kept lazy too — they're rarely matched compared
// to the main authed routes.
const Auth = lazy(() => import("./components/routes/AuthRoute"));
const ErrorPage = lazy(() => import("./pages/student/ErrorPage"));

// Student / legacy marketplace pages
// ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
// Lazy imports for hidden marketplace routes — commented alongside
// their route mounts so the CI build (which fails on unused-vars)
// stays green. Uncomment with the corresponding routes to revive.
// const Dashboard = lazy(() => import("./pages/student/Dashboard"));
// const Payments = lazy(() => import("./pages/student/Payments"));
// const MyTutors = lazy(() => import("./pages/student/MyTutors"));
// const FindTutors = lazy(() => import("./pages/student/FindTutors"));
// const MyLessons = lazy(() => import("./pages/student/MyLessons"));
// const Messages = lazy(() => import("./pages/student/Messages"));
// const TutorDetail = lazy(() => import("./pages/student/TutorDetail"));
// ─── /MARKETPLACE_HIDDEN ─── //
const Settings = lazy(() => import("./pages/student/Settings"));
const Profile = lazy(() => import("./pages/student/Profile"));

// Tutor / teacher pages (legacy + ESOL)
// ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
// const TutorDashboard = lazy(() => import("./pages/tutor/TutorDashboard"));
// const TutorLessons = lazy(() => import("./pages/tutor/TutorLessons"));
// const TutorAvailability = lazy(() => import("./pages/tutor/TutorAvailability"));
// const TutorStudents = lazy(() => import("./pages/tutor/TutorStudents"));
// const TutorProfile = lazy(() => import("./pages/tutor/TutorProfile"));
// const TutorReviews = lazy(() => import("./pages/tutor/TutorReviews"));
// const TutorMessages = lazy(() => import("./pages/tutor/TutorMessages"));
// const TutorEarnings = lazy(() => import("./pages/tutor/TutorEarnings"));
// const TutorSettings = lazy(() => import("./pages/tutor/TutorSettings"));
// ─── /MARKETPLACE_HIDDEN ─── //
const EsolTutorHome = lazy(() => import("./pages/tutor/EsolTutorHome"));
const EsolTutorSession = lazy(() => import("./pages/tutor/EsolTutorSession"));

// Legacy admin pages
// ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
// const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
// const AdminStudents = lazy(() => import("./pages/admin/AdminStudents"));
// const AdminTutors = lazy(() => import("./pages/admin/AdminTutors"));
// const AdminLessons = lazy(() => import("./pages/admin/AdminLessons"));
// const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));
// const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
// const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
// const AdminTickets = lazy(() => import("./pages/admin/AdminTickets"));
// ─── /MARKETPLACE_HIDDEN ─── //
const AdminOrgs = lazy(() => import("./pages/admin/AdminOrgs"));
const EsolTeacherApproval = lazy(
  () => import("./pages/admin/EsolTeacherApproval"),
);
const AdminSafeguardingAlerts = lazy(
  () => import("./pages/admin/AdminSafeguardingAlerts"),
);
const AdminInvoices = lazy(() => import("./pages/admin/AdminInvoices"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));

// Legacy org-admin pages
const OrgAdminDashboard = lazy(
  () => import("./pages/orgAdmin/OrgAdminDashboard"),
);
const OrgLearners = lazy(() => import("./pages/orgAdmin/OrgLearners"));
const OrgLearnerDetail = lazy(
  () => import("./pages/orgAdmin/OrgLearnerDetail"),
);
const OrgInvitations = lazy(() => import("./pages/orgAdmin/OrgInvitations"));
const OrgEsolTeachers = lazy(() => import("./pages/orgAdmin/OrgEsolTeachers"));
const OrgSettings = lazy(() => import("./pages/orgAdmin/OrgSettings"));
const OrgInvoices = lazy(() => import("./pages/orgAdmin/OrgInvoices"));

// ESOL learner pages
const EsolLearnerHome = lazy(() => import("./pages/student/EsolLearnerHome"));
// EsolSession (the old resume page) is gone — /esol/sessions/:sessionId
// now mounts the unified AiTutorSession in resume mode. One component,
// one UX, and ending a resumed session uses the learner-facing
// POST /esol/session/end (the old page hit the management-only PATCH
// /complete and 403'd for learners).
const EsolVocab = lazy(() => import("./pages/student/EsolVocab"));
// /esol/sessions — listing of every AI tutor session the learner has
// started. Sibling to /esol/vocab; sits inside MainLayout (sidebar
// chrome present) because it's a navigational page, not an immersive
// chat. Each row links into /esol/sessions/:id which IS immersive.
const EsolSessionsList = lazy(() => import("./pages/student/EsolSessionsList"));

// Project Silk ESOL org-admin pages
const BulkImport = lazy(() => import("../esol/pages/orgAdmin/BulkImport"));
const OrgAdminCohortDashboard = lazy(
  () => import("../esol/pages/orgAdmin/Dashboard"),
);
const OrgAdminLearnerDetail = lazy(
  () => import("../esol/pages/orgAdmin/LearnerDetail"),
);
const OrgAdminTeacherAssignment = lazy(
  () => import("../esol/pages/orgAdmin/TeacherAssignment"),
);
// Phase 1 (BE-B) — Final Addendum §6 standalone org-wide audit-log page.
// Same component is also embedded under the learner-detail Compliance
// Timeline tab; the `embedded` prop differentiates the two surfaces.
const OrgAdminAuditLog = lazy(() => import("../esol/pages/orgAdmin/AuditLog"));

// ESOL placement + AI session + Stage 5
const PlacementAssessment = lazy(
  () => import("../esol/pages/PlacementAssessment"),
);
const AiTutorSession = lazy(() => import("../esol/pages/AiTutorSession"));
// /esol/prepare/:scenarioId — the PREPARE beat (F31). Immersive lead-in
// shown before the live session starts.
const ScenarioPrepare = lazy(() => import("../esol/pages/ScenarioPrepare"));
// /esol/scenarios — dedicated AI tutor picker. Sibling to /esol/home so
// the sidebar "AI Tutor" item has a unique destination (was previously
// colliding with "Dashboard" on the same path).
const Scenarios = lazy(() => import("../esol/pages/Scenarios"));
// /esol/goals — F30 learner Stage 3 negotiation (review + agree goals).
const LearnerGoals = lazy(() => import("../esol/pages/LearnerGoals"));
const PlacementCalibration = lazy(
  () => import("../esol/pages/admin/PlacementCalibration"),
);
// Function 17 — Stage 5 RARPA review (learner + org-admin sides).
const Stage5SelfAssessment = lazy(
  () => import("../esol/pages/Stage5SelfAssessment"),
);
const OrgAdminStage5Review = lazy(
  () => import("../esol/pages/orgAdmin/Stage5Review"),
);
// F12.1 — Final Addendum §11 teacher-messages inbox for learners.
const LearnerMessages = lazy(() => import("../esol/pages/LearnerMessages"));

// Final Addendum §9 — Project Silk teacher portal (new `teacher` module).
const TeacherDashboard = lazy(() => import("../teacher/pages/Dashboard"));
const TeacherLearnerDetail = lazy(
  () => import("../teacher/pages/LearnerDetail"),
);
const TeacherTeachingProfile = lazy(
  () => import("../teacher/pages/TeachingProfile"),
);

// Function 15 — Project Silk Amber-admin pages (new `admin` module).
const AdminOverview = lazy(() => import("../admin/pages/Overview"));
const AdminOrgDetail = lazy(() => import("../admin/pages/OrgDetail"));
const AdminComplianceConfig = lazy(
  () => import("../admin/pages/ComplianceConfig"),
);
const AdminQueues = lazy(() => import("../admin/pages/Queues"));
const AdminTeacherUtilisation = lazy(
  () => import("../admin/pages/TeacherUtilisation"),
);
const AdminFailedJobs = lazy(() => import("../admin/pages/FailedJobs"));
const AdminAuditSearch = lazy(() => import("../admin/pages/AuditSearch"));
const AdminSafeguardingMessages = lazy(
  () => import("../admin/pages/SafeguardingMessages"),
);
const AdminGlhAnalytics = lazy(() => import("../admin/pages/GlhAnalytics"));
const AdminSalesIntelligence = lazy(
  () => import("../admin/pages/SalesIntelligence"),
);

// M0.5 — runtime diagnostic page (no auth, no layout, no role gate).
const Diagnostics = lazy(() => import("../shared/Diagnostics"));

// F19.5 — SPA health probe for load balancers. Tiny inline component;
// not worth a lazy() boundary of its own.
const HealthCheck: React.FC = () => (
  <pre style={{ margin: 0, padding: "16px", fontFamily: "monospace" }}>ok</pre>
);

export const DashboardRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* F19.5 — SPA health route for load balancer probes. */}
        <Route path="/_health" element={<HealthCheck />} />

        {/* M0.5 — diagnostics. Outside PrivateRoute so we can debug
            auth issues without being logged in. Same URL on every
            shell. */}
        <Route path="/__diag" element={<Diagnostics />} />

        <Route element={<PrivateRoute />}>
          {/* ─── Immersive (no-chrome) routes ──────────────────────────
              These render WITHOUT the dashboard MainLayout (no sidebar,
              no topbar). Use for full-viewport experiences where the
              dashboard chrome would compete with the page UI (chat
              sessions, exam-style assessments, etc.). Still gated by
              PrivateRoute + RoleRoute so role enforcement is identical
              to the chrome'd routes. */}
          <Route element={<RoleRoute allowed={["student"]} />}>
            {/* /esol/prepare/:scenarioId — PREPARE beat (F31), immersive
                lead-in before the live session. */}
            <Route
              path="/esol/prepare/:scenarioId"
              element={<ScenarioPrepare />}
            />
            <Route
              path="/esol/session/:scenarioId"
              element={<AiTutorSession />}
            />
            {/* /esol/sessions/:sessionId — past-session viewer. Same
                immersive layout as the live chat so the visual
                language stays consistent. */}
            <Route
              path="/esol/sessions/:sessionId"
              element={<AiTutorSession />}
            />
          </Route>

          <Route element={<MainLayout />}>
            {/* Phase 7 — /account-not-enrolled landing for users whose
                role no longer has an active dashboard (non-ESOL
                students, non-ESOL-approved tutors). Open to every
                role since we always reach it via a server-side
                redirect, never via direct navigation from the UI. */}
            <Route
              path="/account-not-enrolled"
              element={<AccountNotEnrolled />}
            />

            {/* ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
            <Route path="/tutors/:id" element={<TutorDetail />} />
            // ─── /MARKETPLACE_HIDDEN ─── */}

            {/* ── Student / learner routes ── */}
            <Route element={<RoleRoute allowed={["student"]} />}>
              {/* Phase 7 — marketplace student routes are redirected
                  to the not-enrolled landing. ESOL learners are
                  unaffected because roleHome() lands them on /esol/home
                  before they ever see "/". To revive marketplace:
                  uncomment the MARKETPLACE_HIDDEN block below and
                  remove the redirect routes here. */}
              <Route
                path="/"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/my-tutors"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutors"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/lessons"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/messages"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/payments"
                element={<Navigate to="/account-not-enrolled" replace />}
              />

              {/* ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-tutors" element={<MyTutors />} />
              <Route path="/tutors" element={<FindTutors />} />
              <Route path="/lessons" element={<MyLessons />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/payments" element={<Payments />} />
              // ─── /MARKETPLACE_HIDDEN ─── */}

              {/* /profile + /settings KEPT — both are also reached by
                  ESOL learners and Phase 1 (BE-A) mounted the
                  ComplianceTimelineSection here. */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

              {/* ESOL learner routes (org-managed students) */}
              <Route path="/esol/home" element={<EsolLearnerHome />} />
              <Route path="/esol/scenarios" element={<Scenarios />} />
              <Route path="/esol/goals" element={<LearnerGoals />} />
              <Route path="/esol/placement" element={<PlacementAssessment />} />
              {/* /esol/session/:scenarioId and /esol/sessions/:sessionId
                  are mounted ABOVE without MainLayout — immersive chat
                  views, no sidebar. */}
              <Route path="/esol/vocab" element={<EsolVocab />} />
              <Route path="/esol/sessions" element={<EsolSessionsList />} />
              {/* F12.1 — Final Addendum §11 teacher-messages inbox.
                  Backend only exposes the unread list today, so the
                  page is intentionally unread-only. */}
              <Route path="/esol/messages" element={<LearnerMessages />} />
              {/* Function 17 — Stage 5 learner self-assessment. */}
              <Route
                path="/esol/stage5/:reviewId"
                element={<Stage5SelfAssessment />}
              />
            </Route>

            {/* ── Org admin routes ── */}
            <Route element={<RoleRoute allowed={["org_admin"]} />}>
              <Route path="/org/home" element={<OrgAdminDashboard />} />
              <Route path="/org/learners" element={<OrgLearners />} />
              <Route
                path="/org/learners/:learnerId"
                element={<OrgLearnerDetail />}
              />
              <Route path="/org/invitations" element={<OrgInvitations />} />
              <Route path="/org/import-learners" element={<BulkImport />} />
              <Route path="/org/teachers" element={<OrgEsolTeachers />} />
              <Route path="/org/invoices" element={<OrgInvoices />} />
              <Route path="/org/settings" element={<OrgSettings />} />
              {/* ── Function 12 (Project Silk) routes ── */}
              <Route
                path="/org-admin/dashboard"
                element={<OrgAdminCohortDashboard />}
              />
              <Route
                path="/org-admin/learners/:id"
                element={<OrgAdminLearnerDetail />}
              />
              <Route path="/org-admin/import" element={<BulkImport />} />
              <Route
                path="/org-admin/teachers"
                element={<OrgAdminTeacherAssignment />}
              />
              {/* Function 17 — org-admin Stage 5 review + confirmation. */}
              <Route
                path="/org-admin/stage5/:reviewId"
                element={<OrgAdminStage5Review />}
              />
              {/* Phase 1 / Final Addendum §6 (BE-B) — standalone org-wide
                  audit-log surface. Backed by the same endpoint as the
                  per-learner Compliance Timeline tab, but with no
                  learner_id pre-filter so the org admin can sweep
                  every action across every learner. */}
              <Route
                path="/org-admin/audit-log"
                element={<OrgAdminAuditLog />}
              />
            </Route>

            {/* ── Tutor / teacher routes ── */}
            <Route element={<RoleRoute allowed={["tutor"]} />}>
              {/* Phase 7 — marketplace tutor routes are redirected to
                  the not-enrolled landing. ESOL-approved teachers are
                  unaffected because roleHome() lands them on
                  /teacher/dashboard before they ever see /tutor/home.
                  To revive marketplace: uncomment the
                  MARKETPLACE_HIDDEN block below and remove the
                  redirects here. */}
              <Route
                path="/tutor/home"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutor/lessons"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutor/availability"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutor/students"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutor/profile"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutor/reviews"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutor/messages"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutor/earnings"
                element={<Navigate to="/account-not-enrolled" replace />}
              />
              <Route
                path="/tutor/settings"
                element={<Navigate to="/account-not-enrolled" replace />}
              />

              {/* ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
              <Route path="/tutor/home" element={<TutorDashboard />} />
              <Route path="/tutor/lessons" element={<TutorLessons />} />
              <Route path="/tutor/availability" element={<TutorAvailability />} />
              <Route path="/tutor/students" element={<TutorStudents />} />
              <Route path="/tutor/profile" element={<TutorProfile />} />
              <Route path="/tutor/reviews" element={<TutorReviews />} />
              <Route path="/tutor/messages" element={<TutorMessages />} />
              <Route path="/tutor/earnings" element={<TutorEarnings />} />
              <Route path="/tutor/settings" element={<TutorSettings />} />
              // ─── /MARKETPLACE_HIDDEN ─── */}

              {/* ESOL teacher routes */}
              <Route path="/tutor/esol" element={<EsolTutorHome />} />
              <Route
                path="/tutor/esol/:sessionId"
                element={<EsolTutorSession />}
              />
              {/* Final Addendum §9 — Project Silk teacher portal.
                  Backend middleware (requireTeacherRole +
                  requireTeacherContext) additionally enforces
                  esol_teacher_approved + dbs_check_status === "cleared"
                  on every /teacher/* request the page issues. The
                  React route gates only on role; deeper checks live
                  server-side so a stale JWT can't slip past. */}
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route
                path="/teacher/learners/:id"
                element={<TeacherLearnerDetail />}
              />
              {/* Teaching profile — levels / languages / specialisms
                  that drive learner→teacher matching. */}
              <Route
                path="/teacher/teaching-profile"
                element={<TeacherTeachingProfile />}
              />
            </Route>

            {/* ── Amber super-admin routes ── */}
            <Route element={<RoleRoute allowed={["admin"]} />}>
              {/* Phase 7 — legacy /admin/home (and the marketplace
                  management pages: students, tutors, lessons, payments,
                  reviews, settings, tickets) redirect to the Project
                  Silk Overview. Admins arrive there via roleHome()
                  anyway; this catches a user who bookmarked the
                  legacy URLs. */}
              <Route
                path="/admin/home"
                element={<Navigate to="/admin/overview" replace />}
              />
              <Route
                path="/admin/students"
                element={<Navigate to="/admin/overview" replace />}
              />
              <Route
                path="/admin/tutors"
                element={<Navigate to="/admin/overview" replace />}
              />
              <Route
                path="/admin/lessons"
                element={<Navigate to="/admin/overview" replace />}
              />
              <Route
                path="/admin/payments"
                element={<Navigate to="/admin/overview" replace />}
              />
              <Route
                path="/admin/reviews"
                element={<Navigate to="/admin/overview" replace />}
              />
              <Route
                path="/admin/settings"
                element={<Navigate to="/admin/overview" replace />}
              />
              <Route
                path="/admin/tickets"
                element={<Navigate to="/admin/overview" replace />}
              />

              {/* ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
              <Route path="/admin/home" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/tutors" element={<AdminTutors />} />
              <Route path="/admin/lessons" element={<AdminLessons />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/tickets" element={<AdminTickets />} />
              // ─── /MARKETPLACE_HIDDEN ─── */}

              <Route path="/admin/orgs" element={<AdminOrgs />} />
              <Route
                path="/admin/esol-teachers"
                element={<EsolTeacherApproval />}
              />
              <Route
                path="/admin/safeguarding"
                element={<AdminSafeguardingAlerts />}
              />
              <Route path="/admin/invoices" element={<AdminInvoices />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route
                path="/admin/calibration"
                element={<PlacementCalibration />}
              />

              {/* ── Function 15 (Project Silk) Amber-admin routes ── */}
              {/* Overview lives at /admin/overview to avoid colliding
                  with the legacy /admin/home dashboard. The two
                  co-exist; the sidebar can promote /admin/overview
                  independently. The org-detail route uses :id (not
                  :orgId) to match the page's useParams expectations. */}
              <Route path="/admin/overview" element={<AdminOverview />} />
              <Route path="/admin/orgs/:id" element={<AdminOrgDetail />} />
              {/* Final Addendum §3 — versioned compliance-config editor. */}
              <Route
                path="/admin/compliance-config"
                element={<AdminComplianceConfig />}
              />
              {/* Final Addendum §1 — BullMQ queues summary + Bull Board
                  deep-link. The backend's unprefixed /admin/queues mount
                  serves Bull Board itself; this React route renders the
                  dashboard summary page at the same path. They're two
                  different responses on two different ports during dev. */}
              <Route path="/admin/queues" element={<AdminQueues />} />
              {/* Final Addendum §4 — teacher utilisation analytics. */}
              <Route
                path="/admin/teacher-utilisation"
                element={<AdminTeacherUtilisation />}
              />
              {/* Final Addendum §1 — failed-jobs review dashboard. */}
              <Route path="/admin/failed-jobs" element={<AdminFailedJobs />} />
              {/* Final Addendum §6 — cross-org audit search. */}
              <Route
                path="/admin/audit-search"
                element={<AdminAuditSearch />}
              />
              {/* Final Addendum §2 — safeguarding response-text CMS. */}
              <Route
                path="/admin/safeguarding-messages"
                element={<AdminSafeguardingMessages />}
              />
              {/* Final Addendum §12 — cross-platform GLH analytics.
                  Validates the "AI + teacher oversight" funding-model
                  shape (target teacher ratio 10–20% of total). */}
              <Route
                path="/admin/glh-analytics"
                element={<AdminGlhAnalytics />}
              />
              {/* Final Addendum §13 — sales intelligence over the
                  public ROI calculator submission feed. */}
              <Route
                path="/admin/sales-intelligence"
                element={<AdminSalesIntelligence />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="/*" element={<Auth />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};
