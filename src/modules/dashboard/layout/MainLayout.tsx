import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  Users,
  Search,
  GraduationCap,
  Building2,
  Mail,
  MessagesSquare,
  Library,
  Sparkles,
  ShieldAlert,
  Receipt,
  FileText,
  Activity,
  AlertTriangle,
  TrendingUp,
  Inbox,
  PieChart,
  ScrollText,
  Target,
} from "lucide-react";
import { useFailedJobsCount } from "../../admin/api/failedJobsApi";
import DemoBanner from "../../../components/DemoBanner";
import { useAuth } from "../context/AuthContext";
import { getDecodedJwt } from "../lib/auth";
import { useProfileCompletion } from "../lib/utils/useProfileCompletion";
import Header from "../components/layouts/Header";
import DesktopSidebar from "../components/layouts/DesktopSidebar";
import MobileSidebar from "../components/layouts/MobileSidebar";
import type { MenuSection } from "../components/layouts/SidebarNav";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState(getDecodedJwt());

  const { percentage } = useProfileCompletion();

  const isAdmin = user?.role === "admin";
  const isTutor = user?.role === "tutor";
  const isStudent = user?.role === "student";
  const isOrgAdmin = user?.role === "org_admin";

  // Final Addendum §1 — unresolved failed-job count drives the badge
  // on the admin sidebar's "Failed jobs" item. The hook auto-polls
  // every 30 s and pauses while the tab is hidden. Gated on `isAdmin`
  // so non-admin learners / teachers / org-admins don't hammer the
  // admin-only endpoint and rack up 403s in the backend log every
  // 30 seconds.
  const failedJobsCount = useFailedJobsCount({ enabled: isAdmin });
  const unresolvedFailedJobs = failedJobsCount.data?.data?.unresolved ?? 0;
  const isEsolLearner = isStudent && Boolean(user?.orgId);
  const isEsolTeacher = isTutor && Boolean(user?.esolTeacherApproved);
  const roleLabel = isAdmin
    ? "Administrator"
    : isOrgAdmin
      ? "Organisation Admin"
      : isTutor
        ? "Tutor"
        : "Student";
  const showProfileCompletion = (isStudent || isTutor) && percentage < 100;

  const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
  const helpUrl = `${FRONTEND_URL}/help`;

  // Listen for user updates
  useEffect(() => {
    const handleUserUpdate = () => setUser(getDecodedJwt());
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ── Role-based navigation ──
  const getMenuSections = (): MenuSection[] => {
    if (isOrgAdmin) {
      return [
        {
          label: "Overview",
          items: [
            { name: "Dashboard", icon: LayoutDashboard, path: "/org/home" },
          ],
        },
        {
          label: "ESOL",
          items: [
            { name: "Learners", icon: Users, path: "/org/learners" },
            { name: "Invitations", icon: Mail, path: "/org/invitations" },
            {
              name: "ESOL Teachers",
              icon: GraduationCap,
              path: "/org/teachers",
            },
          ],
        },
        {
          label: "Finance",
          items: [{ name: "Invoices", icon: Receipt, path: "/org/invoices" }],
        },
        {
          // Phase 1 / Final Addendum §6 (BE-B) — append-only audit
          // log surface for the whole org. The same component also
          // backs the per-learner Compliance Timeline tab under
          // /org-admin/learners/:id; this entry is the org-wide
          // sweep with no learner pre-filter.
          label: "Compliance",
          items: [
            {
              name: "Audit log",
              icon: ScrollText,
              path: "/org-admin/audit-log",
            },
          ],
        },
        {
          label: "Organisation",
          items: [{ name: "Settings", icon: Settings, path: "/org/settings" }],
        },
      ];
    }

    if (isAdmin) {
      // Phase 7 — Marketplace admin pages hidden.
      //
      // The legacy Dashboard (/admin/home), the Management group
      // (Students / Tutors / Lessons / Reviews), and the Finance >
      // Payments item are all marketplace-only and now redirect to
      // /admin/overview. To revive marketplace: uncomment the
      // MARKETPLACE_HIDDEN blocks below.
      return [
        {
          label: "Overview",
          items: [
            // Project Silk overview is now the only Overview entry.
            { name: "Overview", icon: PieChart, path: "/admin/overview" },
          ],
        },

        // ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
        // {
        //   label: "Overview",
        //   items: [
        //     { name: "Dashboard", icon: LayoutDashboard, path: "/admin/home" },
        //     { name: "Overview", icon: PieChart, path: "/admin/overview" },
        //   ],
        // },
        // {
        //   label: "Management",
        //   items: [
        //     { name: "All Students", icon: Users, path: "/admin/students" },
        //     { name: "All Tutors", icon: GraduationCap, path: "/admin/tutors" },
        //     { name: "Lessons", icon: Calendar, path: "/admin/lessons" },
        //     { name: "Reviews", icon: MessageSquare, path: "/admin/reviews" },
        //   ],
        // },
        // ─── /MARKETPLACE_HIDDEN ─── //
        {
          label: "ESOL",
          items: [
            { name: "Organisations", icon: Building2, path: "/admin/orgs" },
            {
              name: "ESOL Teachers",
              icon: GraduationCap,
              path: "/admin/esol-teachers",
            },
            {
              name: "Safeguarding",
              icon: ShieldAlert,
              path: "/admin/safeguarding",
            },
            // Final Addendum §2 — crisis response-text CMS. Edits go
            // live without deployment (backend reloads its pre-cache).
            {
              name: "Response texts",
              icon: MessagesSquare,
              path: "/admin/safeguarding-messages",
            },
            // Final Addendum §4 — per-teacher load & capacity analytics.
            {
              name: "Teacher utilisation",
              icon: GraduationCap,
              path: "/admin/teacher-utilisation",
            },
            // Function 8 — placement-bank calibration (per-question
            // difficulty + discrimination view; cohort-level retuning).
            {
              name: "Placement calibration",
              icon: Target,
              path: "/admin/calibration",
            },
          ],
        },
        {
          // Phase 7 — Payments (marketplace) hidden; Invoices stays
          // because it's the Project Silk billing surface (demo-gated
          // writes via F15.1).
          label: "Finance",
          items: [
            // ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
            // { name: "Payments", icon: CreditCard, path: "/admin/payments" },
            // ─── /MARKETPLACE_HIDDEN ─── //
            { name: "Invoices", icon: Receipt, path: "/admin/invoices" },
          ],
        },
        {
          label: "Compliance",
          items: [
            { name: "Reports", icon: FileText, path: "/admin/reports" },
            // Final Addendum §12 — cross-platform GLH split
            // (AI tutor / pre-platform / teacher contact) with
            // funding-model ratio check.
            {
              name: "GLH analytics",
              icon: TrendingUp,
              path: "/admin/glh-analytics",
            },
            // Final Addendum §3 — versioned ILR / RARPA / ASF
            // routing rules editor. Per-domain, per-academic-year;
            // activate-new-version flow with full version history.
            {
              name: "Compliance config",
              icon: ScrollText,
              path: "/admin/compliance-config",
            },
            // Final Addendum §6 — cross-organisation audit search.
            // The one audit surface not scoped to a single org.
            {
              name: "Audit search",
              icon: Search,
              path: "/admin/audit-search",
            },
          ],
        },
        {
          // Final Addendum §13 — sales-team-only surface over
          // the public ROI calculator submission feed. Kept in
          // its own group so a future "Sales pipeline" /
          // "Lead scoring" section can land here without
          // bloating Compliance.
          label: "Sales",
          items: [
            {
              name: "Sales intelligence",
              icon: Inbox,
              path: "/admin/sales-intelligence",
            },
          ],
        },
        {
          // Final Addendum §1 — operational tooling for the Amber
          // platform team. Queues is the dashboard summary; the
          // "Open Bull Board" button on that page deep-links to the
          // full Bull Board UI in a new tab. Failed jobs is the
          // durable audit dashboard — the badge counts unresolved
          // failures (non-dismissed) and only renders when > 0.
          label: "Operations",
          items: [
            { name: "Queues", icon: Activity, path: "/admin/queues" },
            {
              name: "Failed jobs",
              icon: AlertTriangle,
              path: "/admin/failed-jobs",
              ...(unresolvedFailedJobs > 0
                ? { badge: unresolvedFailedJobs }
                : {}),
            },
          ],
        },
        // {
        //   label: "System",
        //   items: [
        //     { name: "Settings", icon: Settings, path: "/admin/settings" },
        //   ],
        // },
      ];
    }

    if (isTutor) {
      // Phase 7 — Marketplace tutor sidebar collapsed.
      //
      // The legacy marketplace tutor groups (Overview / Teaching /
      // Profile / Account) are hidden. An ESOL-approved teacher
      // (`isEsolTeacher`) still gets the ESOL section + a minimal
      // Account section. A non-ESOL-approved tutor sees only
      // Account (Settings) — they're a marketplace-only tutor and
      // will land on /account-not-enrolled via roleHome().
      //
      // To revive marketplace: uncomment the MARKETPLACE_HIDDEN
      // block below and restore the multi-section sections[] array.
      const sections: MenuSection[] = [];

      if (isEsolTeacher) {
        sections.push({
          label: "ESOL",
          items: [
            // Final Addendum §9 — teacher portal landing page.
            {
              name: "Teacher Dashboard",
              icon: LayoutDashboard,
              path: "/teacher/dashboard",
            },
            { name: "ESOL Sessions", icon: Sparkles, path: "/tutor/esol" },
            // Matching foundation — levels / languages / specialisms
            // that decide which learners get auto-assigned to them.
            {
              name: "Teaching Profile",
              icon: GraduationCap,
              path: "/teacher/teaching-profile",
            },
          ],
        });
      }

      sections.push({
        label: "Account",
        items: [{ name: "Settings", icon: Settings, path: "/tutor/settings" }],
      });

      return sections;

      // ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
      // const sections: MenuSection[] = [
      //   {
      //     label: "Overview",
      //     items: [
      //       { name: "Dashboard", icon: LayoutDashboard, path: "/tutor/home" },
      //     ],
      //   },
      //   {
      //     label: "Teaching",
      //     items: [
      //       { name: "My Lessons", icon: BookOpen, path: "/tutor/lessons" },
      //       { name: "Availability", icon: Clock, path: "/tutor/availability" },
      //       { name: "My Students", icon: Users, path: "/tutor/students" },
      //     ],
      //   },
      // ];
      //
      // if (isEsolTeacher) {
      //   sections.push({ … ESOL group … });
      // }
      //
      // sections.push(
      //   {
      //     label: "Profile",
      //     items: [
      //       { name: "Tutor Profile", icon: Briefcase, path: "/tutor/profile" },
      //       { name: "Reviews", icon: Star, path: "/tutor/reviews" },
      //     ],
      //   },
      //   {
      //     label: "Account",
      //     items: [
      //       { name: "Messages", icon: MessageSquare, path: "/tutor/messages" },
      //       { name: "Earnings", icon: Wallet, path: "/tutor/earnings" },
      //       { name: "Settings", icon: Settings, path: "/tutor/settings" },
      //     ],
      //   },
      // );
      //
      // return sections;
      // ─── /MARKETPLACE_HIDDEN ─── //
    }

    if (isEsolLearner) {
      return [
        {
          label: "Overview",
          items: [
            { name: "Dashboard", icon: LayoutDashboard, path: "/esol/home" },
          ],
        },
        {
          label: "Learning",
          items: [
            // AI Tutor sends to its OWN page (/esol/scenarios) rather
            // than /esol/home — otherwise both this item and "Dashboard"
            // light up at once, since the active-state check matches
            // by exact path.
            { name: "AI Tutor", icon: Sparkles, path: "/esol/scenarios" },
            { name: "Vocabulary", icon: Library, path: "/esol/vocab" },
            // "My Lessons" (marketplace bookings, /lessons) was a
            // Phase 7 leftover — for ESOL learners that route just
            // redirects to /account-not-enrolled. Their session
            // history lives at /esol/sessions instead.
            { name: "My Sessions", icon: BookOpen, path: "/esol/sessions" },
          ],
        },
        {
          label: "Account",
          items: [
            // ESOL learners get the teacher-messages inbox, NOT the
            // marketplace /messages route (which dead-ends on the
            // not-enrolled redirect for them).
            { name: "Messages", icon: MessagesSquare, path: "/esol/messages" },
            { name: "Profile", icon: User, path: "/profile" },
            { name: "Settings", icon: Settings, path: "/settings" },
          ],
        },
      ];
    }

    // Phase 7 — Marketplace student fallback.
    //
    // Non-ESOL students no longer see the marketplace nav (Find
    // Tutors / My Lessons / My Tutors / Payments). Their entire
    // sidebar collapses to a single Account section so the
    // chrome stays consistent with the not-enrolled landing they
    // arrive at via the route redirects. ESOL learners reach a
    // different earlier branch (see `isEsolLearner`), so this fall-
    // through only ever fires for the marketplace-style student.
    //
    // To revive marketplace: uncomment the MARKETPLACE_HIDDEN block
    // below and revert this section to its original three-group
    // shape. See docs/MARKETPLACE_HIDDEN.md for the revival
    // checklist.
    return [
      {
        label: "Account",
        items: [
          { name: "Profile", icon: User, path: "/profile" },
          { name: "Settings", icon: Settings, path: "/settings" },
        ],
      },
    ];

    // ─── MARKETPLACE_HIDDEN (Phase 7) ─── //
    // return [
    //   {
    //     label: "Overview",
    //     items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }],
    //   },
    //   {
    //     label: "Learning",
    //     items: [
    //       { name: "Find Tutors", icon: Search, path: "/tutors" },
    //       { name: "My Lessons", icon: BookOpen, path: "/lessons" },
    //       { name: "My Tutors", icon: GraduationCap, path: "/my-tutors" },
    //     ],
    //   },
    //   {
    //     label: "Account",
    //     items: [
    //       { name: "Messages", icon: MessageSquare, path: "/messages" },
    //       { name: "Payments", icon: Wallet, path: "/payments" },
    //       { name: "Profile", icon: User, path: "/profile" },
    //       { name: "Settings", icon: Settings, path: "/settings" },
    //     ],
    //   },
    // ];
    // ─── /MARKETPLACE_HIDDEN ─── //
  };

  const menuSections = getMenuSections();
  const allItems = menuSections.flatMap((s) => s.items);

  const getBreadcrumb = () => {
    const current = allItems.find((item) => item.path === location.pathname);
    return current?.name || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Function 16 — demo banner sits above everything (including
          the app header). Renders nothing when not in demo mode. */}
      <DemoBanner />

      <Header
        user={user}
        breadcrumb={getBreadcrumb()}
        roleLabel={roleLabel}
        helpUrl={helpUrl}
        onMobileMenuOpen={() => setMobileSidebarOpen(true)}
        onLogout={handleLogout}
      />

      <DesktopSidebar
        open={sidebarOpen}
        sections={menuSections}
        isAdmin={isAdmin}
        showProfileCompletion={showProfileCompletion}
        profilePercentage={percentage}
        helpUrl={helpUrl}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <MobileSidebar
        open={mobileSidebarOpen}
        sections={menuSections}
        isAdmin={isAdmin}
        showProfileCompletion={showProfileCompletion}
        profilePercentage={percentage}
        helpUrl={helpUrl}
        user={user}
        onClose={() => setMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main
        className={`pt-14 min-h-screen transition-all duration-200 ease-out ${
          sidebarOpen ? "lg:pl-56" : "lg:pl-[60px]"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
