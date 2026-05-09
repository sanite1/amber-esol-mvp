import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Wallet,
  User,
  Settings,
  Users,
  Search,
  MessageSquare,
  Calendar,
  Star,
  GraduationCap,
  CreditCard,
  Clock,
  Briefcase,
  Building2,
  Mail,
  MessagesSquare,
  Library,
  Sparkles,
} from "lucide-react";
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
  const isEsolLearner = isStudent && Boolean(user?.orgId);
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
          label: "Organisation",
          items: [{ name: "Settings", icon: Settings, path: "/org/settings" }],
        },
      ];
    }

    if (isAdmin) {
      return [
        {
          label: "Overview",
          items: [
            { name: "Dashboard", icon: LayoutDashboard, path: "/admin/home" },
          ],
        },
        {
          label: "Management",
          items: [
            { name: "All Students", icon: Users, path: "/admin/students" },
            { name: "All Tutors", icon: GraduationCap, path: "/admin/tutors" },
            { name: "Lessons", icon: Calendar, path: "/admin/lessons" },
            { name: "Reviews", icon: MessageSquare, path: "/admin/reviews" },
          ],
        },
        {
          label: "ESOL",
          items: [
            { name: "Organisations", icon: Building2, path: "/admin/orgs" },
          ],
        },
        {
          label: "Finance",
          items: [
            { name: "Payments", icon: CreditCard, path: "/admin/payments" },
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
      return [
        {
          label: "Overview",
          items: [
            { name: "Dashboard", icon: LayoutDashboard, path: "/tutor/home" },
          ],
        },
        {
          label: "Teaching",
          items: [
            { name: "My Lessons", icon: BookOpen, path: "/tutor/lessons" },
            { name: "Availability", icon: Clock, path: "/tutor/availability" },
            { name: "My Students", icon: Users, path: "/tutor/students" },
          ],
        },
        {
          label: "Profile",
          items: [
            { name: "Tutor Profile", icon: Briefcase, path: "/tutor/profile" },
            { name: "Reviews", icon: Star, path: "/tutor/reviews" },
          ],
        },
        {
          label: "Account",
          items: [
            {
              name: "Messages",
              icon: MessageSquare,
              path: "/tutor/messages",
            },
            { name: "Earnings", icon: Wallet, path: "/tutor/earnings" },
            { name: "Settings", icon: Settings, path: "/tutor/settings" },
          ],
        },
      ];
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
            { name: "AI Tutor", icon: Sparkles, path: "/esol/home" },
            { name: "Vocabulary", icon: Library, path: "/esol/vocab" },
            { name: "My Lessons", icon: BookOpen, path: "/lessons" },
          ],
        },
        {
          label: "Account",
          items: [
            { name: "Messages", icon: MessagesSquare, path: "/messages" },
            { name: "Profile", icon: User, path: "/profile" },
            { name: "Settings", icon: Settings, path: "/settings" },
          ],
        },
      ];
    }

    // Student (default)
    return [
      {
        label: "Overview",
        items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }],
      },
      {
        label: "Learning",
        items: [
          { name: "Find Tutors", icon: Search, path: "/tutors" },
          { name: "My Lessons", icon: BookOpen, path: "/lessons" },
          { name: "My Tutors", icon: GraduationCap, path: "/my-tutors" },
        ],
      },
      {
        label: "Account",
        items: [
          { name: "Messages", icon: MessageSquare, path: "/messages" },
          { name: "Payments", icon: Wallet, path: "/payments" },
          { name: "Profile", icon: User, path: "/profile" },
          { name: "Settings", icon: Settings, path: "/settings" },
        ],
      },
    ];
  };

  const menuSections = getMenuSections();
  const allItems = menuSections.flatMap((s) => s.items);

  const getBreadcrumb = () => {
    const current = allItems.find((item) => item.path === location.pathname);
    return current?.name || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
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
