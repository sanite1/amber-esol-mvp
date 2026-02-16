import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Wallet,
  User,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Bell,
  HelpCircle,
  Users,
  Search,
  MessageSquare,
  Calendar,
  Star,
  GraduationCap,
  BarChart3,
  Shield,
  CreditCard,
  Clock,
  Award,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  ChevronRight,
  Headphones,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { getDecodedJwt } from "../lib/auth";
import { useProfileCompletion } from "../lib/utils/useProfileCompletion";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: string | number;
  external?: boolean;
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [user, setUser] = useState(getDecodedJwt());

  // Listen for user updates
  useEffect(() => {
    const handleUserUpdate = () => {
      setUser(getDecodedJwt());
    };
    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setProfileDropdownOpen(false);
      }
      if (!target.closest(".notifications-dropdown")) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const notifications = [
    {
      id: 1,
      title: "Lesson confirmed",
      message: "Your lesson with Sarah is confirmed for tomorrow at 3 PM",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment received",
      message: "£29.00 subscription payment processed",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "New review",
      message: "You received a 5-star review from Maria",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;
  const { percentage } = useProfileCompletion();

  const isAdmin = user?.role === "admin";
  const isTutor = user?.role === "tutor";
  const isStudent = user?.role === "student";
  const showProfileCompletion = (isStudent || isTutor) && percentage < 100;

  const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;
  const helpUrl = `${FRONTEND_URL}/help`;

  // ── Role-based navigation ──
  const getMenuSections = (): MenuSection[] => {
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
          label: "Finance",
          items: [
            { name: "Payments", icon: CreditCard, path: "/admin/payments" },
            // { name: "Revenue", icon: BarChart3, path: "/admin/revenue" },
          ],
        },
        {
          label: "System",
          items: [
            // { name: "Messages", icon: MessageSquare, path: "/admin/messages" },
            { name: "Settings", icon: Settings, path: "/admin/settings" },
          ],
        },
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
            {
              name: "Tutor Profile",
              icon: Briefcase,
              path: "/tutor/profile",
            },
            { name: "Reviews", icon: Star, path: "/tutor/reviews" },
            // { name: "Analytics", icon: BarChart3, path: "/tutor/analytics" },
          ],
        },
        {
          label: "Account",
          items: [
            { name: "Messages", icon: MessageSquare, path: "/tutor/messages" },
            { name: "Earnings", icon: Wallet, path: "/tutor/earnings" },
            { name: "Settings", icon: Settings, path: "/tutor/settings" },
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

  // ── Breadcrumb from path ──
  const getBreadcrumb = () => {
    const current = allItems.find((item) => item.path === location.pathname);
    return current?.name || "Dashboard";
  };

  // ── Initials & role label ──
  const initials = `${user?.firstname?.[0] || ""}${user?.lastname?.[0] || ""}`;
  const fullName = `${user?.firstname || ""} ${user?.lastname || ""}`;
  const roleLabel = isAdmin ? "Administrator" : isTutor ? "Tutor" : "Student";

  // ── Sidebar nav link renderer ──
  const renderNavItem = (
    item: MenuItem,
    collapsed: boolean,
    onClick?: () => void
  ) => {
    const isActive = location.pathname === item.path;

    return (
      <NavLink
        key={item.name}
        to={item.path}
        end={item.path === "/" || item.path === "/admin/home"}
        onClick={onClick}
        className={`group relative flex items-center gap-3 rounded-lg transition-all duration-150 ${
          collapsed ? "justify-center px-3 py-2.5" : "px-3 py-2.5"
        } ${
          isActive
            ? "bg-[#ff7c22] text-white"
            : "text-[#0B2343]/55 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]"
        }`}
      >
        <item.icon size={18} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="text-[13px] font-medium">{item.name}</span>
            {item.badge && (
              <span
                className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#ff7c22]/10 text-[#ff7c22]"
                }`}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
        {collapsed && item.badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff7c22] text-white text-[9px] font-bold flex items-center justify-center">
            {item.badge}
          </span>
        )}
        {/* Tooltip */}
        {collapsed && (
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B2343] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
            {item.name}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0B2343] rotate-45" />
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* ─── Top Header ─── */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-[#0B2343]/[0.06] z-[9995]">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <Menu size={20} className="text-[#0B2343]/60" />
            </button>

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Amber ESOL" className="h-8 w-auto" />
            </NavLink>

            {/* Breadcrumb divider */}
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-[#0B2343]/[0.06]">
              <span className="text-xs font-medium text-[#0B2343]/30">
                {roleLabel}
              </span>
              <ChevronRight size={12} className="text-[#0B2343]/20" />
              <span className="text-xs font-semibold text-[#0B2343]/70">
                {getBreadcrumb()}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            {/* Help */}
            <button
              onClick={() => window.open(helpUrl, "_blank")}
              className="hidden sm:flex p-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
            >
              <HelpCircle size={18} className="text-[#0B2343]/35" />
            </button>

            {/* Notifications */}
            <div className="relative notifications-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(!notificationsOpen);
                }}
                className="relative p-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
              >
                <Bell size={18} className="text-[#0B2343]/35" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff7c22]" />
                )}
              </button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg shadow-[#0B2343]/8 border border-[#0B2343]/[0.06] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[#0B2343]/[0.06]">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#0B2343]">
                          Notifications
                        </h3>
                        <button className="text-xs text-[#ff7c22] hover:underline font-medium">
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-[#0B2343]/[0.02] cursor-pointer transition-colors ${
                            notification.unread ? "bg-[#ff7c22]/[0.03]" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {notification.unread && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff7c22] mt-1.5 shrink-0" />
                            )}
                            <div className={notification.unread ? "" : "ml-4"}>
                              <p className="text-sm font-medium text-[#0B2343]">
                                {notification.title}
                              </p>
                              <p className="text-xs text-[#0B2343]/45 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-[#0B2343]/25 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-[#0B2343]/[0.06]">
                      <button className="w-full py-1.5 text-xs font-semibold text-[#ff7c22] hover:bg-[#ff7c22]/[0.04] rounded-md transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-[#0B2343]/[0.06] mx-1.5 hidden sm:block" />

            {/* Profile dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0B2343] flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-[#0B2343] leading-tight">
                    {fullName}
                  </p>
                  <p className="text-[10px] text-[#0B2343]/35 capitalize leading-tight">
                    {roleLabel}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`hidden sm:block text-[#0B2343]/25 transition-transform ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg shadow-[#0B2343]/8 border border-[#0B2343]/[0.06] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[#0B2343]/[0.06]">
                      <p className="text-sm font-semibold text-[#0B2343]">
                        {fullName}
                      </p>
                      <p className="text-xs text-[#0B2343]/40 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <NavLink
                        to="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[#0B2343]/[0.04] transition-colors"
                      >
                        <User size={14} className="text-[#0B2343]/40" />
                        <span className="text-sm text-[#0B2343]/70">
                          Profile
                        </span>
                      </NavLink>
                      <NavLink
                        to="/settings"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[#0B2343]/[0.04] transition-colors"
                      >
                        <Settings size={14} className="text-[#0B2343]/40" />
                        <span className="text-sm text-[#0B2343]/70">
                          Settings
                        </span>
                      </NavLink>
                    </div>
                    <div className="p-1.5 border-t border-[#0B2343]/[0.06]">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut size={14} className="text-red-400" />
                        <span className="text-sm text-red-500">Sign out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Desktop Sidebar ─── */}
      <aside
        className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-[#0B2343]/[0.06] hidden lg:flex flex-col transition-all duration-200 ease-out z-30 ${
          sidebarOpen ? "w-56" : "w-[60px]"
        }`}
      >
        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5 space-y-5 [&::-webkit-scrollbar]:w-0">
          {menuSections.map((section) => (
            <div key={section.label}>
              {sidebarOpen && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0B2343]/25">
                  {section.label}
                </p>
              )}
              {!sidebarOpen && (
                <div className="w-6 h-px bg-[#0B2343]/[0.06] mx-auto mb-2" />
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => renderNavItem(item, !sidebarOpen))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-[#0B2343]/[0.06] p-2.5 space-y-2">
          {/* Help/Support */}
          {isAdmin ? (
            <NavLink
              to="/admin/tickets"
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg transition-all duration-150 ${
                  sidebarOpen ? "px-3 py-2.5" : "justify-center px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-[#ff7c22]/10 text-[#ff7c22]"
                    : "text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/60"
                }`
              }
            >
              <Headphones size={18} className="shrink-0" />
              {sidebarOpen && (
                <span className="text-[13px] font-medium">Support Tickets</span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B2343] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                  Support Tickets
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0B2343] rotate-45" />
                </div>
              )}
            </NavLink>
          ) : (
            <a
              href={helpUrl}
              onClick={(e) => {
                e.preventDefault();
                window.open(helpUrl, "_blank");
              }}
              className={`group relative flex items-center gap-3 rounded-lg text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/60 transition-all duration-150 ${
                sidebarOpen ? "px-3 py-2.5" : "justify-center px-3 py-2.5"
              }`}
            >
              <HelpCircle size={18} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-[13px] font-medium">
                    Help & Support
                  </span>
                  <ExternalLink size={12} className="ml-auto opacity-40" />
                </>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B2343] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none flex items-center gap-1.5">
                  Help & Support
                  <ExternalLink size={10} />
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0B2343] rotate-45" />
                </div>
              )}
            </a>
          )}

          {/* Profile completion */}
          {showProfileCompletion && sidebarOpen && (
            <div className="p-3 rounded-lg bg-[#ff7c22]/[0.04] border border-[#ff7c22]/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-[#0B2343]/70">
                  Profile {percentage}%
                </p>
                <NavLink
                  to="/profile"
                  className="text-[10px] font-bold text-[#ff7c22] hover:underline"
                >
                  Complete
                </NavLink>
              </div>
              <div className="w-full h-1 bg-[#0B2343]/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff7c22] rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          {showProfileCompletion && !sidebarOpen && (
            <div className="group relative flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-[#ff7c22]/[0.06] flex items-center justify-center">
                <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    stroke="#0B234310"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    stroke="#ff7c22"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray={`${(percentage / 100) * 69.1} 69.1`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#0B2343]/60">
                  {percentage}
                </span>
              </div>
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B2343] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none top-1/2 -translate-y-1/2">
                Profile {percentage}% complete
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0B2343] rotate-45" />
              </div>
            </div>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex items-center gap-3 rounded-lg text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/50 transition-all duration-150 w-full ${
              sidebarOpen ? "px-3 py-2" : "justify-center px-3 py-2"
            }`}
          >
            {sidebarOpen ? (
              <>
                <PanelLeftClose size={16} className="shrink-0" />
                <span className="text-[11px] font-medium">Collapse</span>
              </>
            ) : (
              <PanelLeftOpen size={16} />
            )}
          </button>
        </div>
      </aside>

      {/* ─── Mobile Sidebar ─── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-[#0B2343]/40 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-[#0B2343]/[0.06]">
                <NavLink to="/" className="flex items-center gap-2">
                  <img src={logo} alt="Amber ESOL" className="h-8 w-auto" />
                </NavLink>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
                >
                  <X size={18} className="text-[#0B2343]/40" />
                </button>
              </div>

              {/* User card */}
              <div className="px-4 py-4 border-b border-[#0B2343]/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0B2343] flex items-center justify-center text-white text-sm font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0B2343]">
                      {fullName}
                    </p>
                    <p className="text-xs text-[#0B2343]/35 capitalize">
                      {roleLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
                {menuSections.map((section) => (
                  <div key={section.label}>
                    <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0B2343]/25">
                      {section.label}
                    </p>
                    <div className="space-y-0.5">
                      {section.items.map((item) =>
                        renderNavItem(item, false, () =>
                          setMobileSidebarOpen(false)
                        )
                      )}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Footer */}
              <div className="border-t border-[#0B2343]/[0.06] p-3 space-y-2">
                {isAdmin ? (
                  <NavLink
                    to="/admin/tickets"
                    onClick={() => setMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-[#ff7c22]/10 text-[#ff7c22]"
                          : "text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04]"
                      }`
                    }
                  >
                    <Headphones size={18} />
                    <span className="text-[13px] font-medium">
                      Support Tickets
                    </span>
                  </NavLink>
                ) : (
                  <a
                    href={helpUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(helpUrl, "_blank");
                      setMobileSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] transition-all"
                  >
                    <HelpCircle size={18} />
                    <span className="text-[13px] font-medium">
                      Help & Support
                    </span>
                    <ExternalLink size={12} className="ml-auto opacity-40" />
                  </a>
                )}

                {showProfileCompletion && (
                  <div className="p-3 rounded-lg bg-[#ff7c22]/[0.04] border border-[#ff7c22]/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-semibold text-[#0B2343]/70">
                        Profile {percentage}%
                      </p>
                      <NavLink
                        to="/profile"
                        onClick={() => setMobileSidebarOpen(false)}
                        className="text-[10px] font-bold text-[#ff7c22] hover:underline"
                      >
                        Complete
                      </NavLink>
                    </div>
                    <div className="w-full h-1 bg-[#0B2343]/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ff7c22] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={16} className="text-red-400" />
                  <span className="text-[13px] font-medium text-red-500">
                    Sign out
                  </span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
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
