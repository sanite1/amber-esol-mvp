import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogIn,
  GraduationCap,
  ChevronDown,
  Users,
  Phone,
  Sparkles,
  ArrowRight,
  MessageCircle,
  FileText,
  Building2,
} from "lucide-react";
import logo from "../assets/logo.png";

// Single-host model: /login, /signup, /contact etc. live in this
// same React app (Auth catch-all router in routes.tsx). The legacy
// REACT_APP_DASHBOARD_URL indirection has been removed.

interface DropdownChild {
  name: string;
  path: string;
  icon: React.ReactNode;
  desc: string;
}

interface NavItem {
  name: string;
  path: string;
  children?: DropdownChild[];
}

const navLinks: NavItem[] = [
  {
    name: "Platform",
    path: "#",
    children: [
      {
        name: "For Learners",
        path: "/login",
        icon: <GraduationCap size={20} />,
        desc: "AI tutor in 20+ first languages",
      },
      {
        name: "For Teachers",
        path: "/login",
        icon: <Users size={20} />,
        desc: "Priority queue, evidence on rails",
      },
      {
        name: "For Org Admins",
        path: "/for-organisations",
        icon: <Building2 size={20} />,
        desc: "ILR, RARPA and ASF evidence ready",
      },
    ],
  },
  { name: "For Providers", path: "/for-organisations" },
  { name: "Bridge Method", path: "/bridge-method" },
  { name: "ROI Calculator", path: "/roi-calculator" },
  { name: "About", path: "/about" },
  { name: "Help", path: "/help" },
];

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (path: string) => location.pathname === path;
  const isChildActive = (children?: DropdownChild[]) =>
    children?.some((c) => isActive(c.path)) ?? false;

  /* ── Throttled scroll listener ── */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(null);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(null), 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-white shadow-[0_1px_3px_rgba(11,35,67,0.08)]"
            : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* ─── Logo ─── */}
            <Link to="/" className="relative z-10 shrink-0">
              <img src={logo} alt="Amber ESOL" className="h-9 lg:h-10 w-auto" />
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <div className="hidden lg:flex items-center">
              {navLinks.map((link) =>
                link.children ? (
                  // Wrapper is presentational — the interactive surface
                  // is the inner <button>. Mouse hover-intent is a
                  // progressive enhancement; keyboard users open the
                  // dropdown by tabbing to and pressing Enter on the
                  // button, which is handled below.
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                  <div
                    key={link.name}
                    className="relative"
                    role="presentation"
                    onMouseEnter={() => handleDropdownEnter(link.name)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      className={`flex items-center gap-1 px-4 py-2 text-[15px] font-medium rounded-lg transition-colors duration-200 ${
                        isChildActive(link.children)
                          ? "text-[#ff7c22]"
                          : "text-[#0B2343]/65 hover:text-[#0B2343]"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          dropdownOpen === link.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* ── Mega dropdown ── */}
                    <div
                      className={`absolute top-full -left-4 pt-3 transition-all duration-200 ease-out ${
                        dropdownOpen === link.name
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-1 pointer-events-none"
                      }`}
                    >
                      <div className="w-[340px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(11,35,67,0.12)] border border-[#0B2343]/5 overflow-hidden">
                        <div className="px-5 pt-4 pb-3">
                          <p className="text-xs font-semibold text-[#0B2343]/40 uppercase tracking-wider">
                            Explore the Platform
                          </p>
                        </div>
                        <div className="px-3 pb-3 space-y-0.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className={`flex items-center gap-3.5 px-3 py-3 rounded-xl transition-colors duration-150 group ${
                                isActive(child.path)
                                  ? "bg-[#ff7c22]/5"
                                  : "hover:bg-[#0B2343]/[0.03]"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  isActive(child.path)
                                    ? "bg-[#ff7c22] text-white"
                                    : "bg-[#0B2343]/[0.04] text-[#0B2343]/40 group-hover:bg-[#ff7c22]/10 group-hover:text-[#ff7c22]"
                                }`}
                              >
                                {child.icon}
                              </div>
                              <div className="min-w-0">
                                <span
                                  className={`block text-sm font-semibold ${
                                    isActive(child.path)
                                      ? "text-[#ff7c22]"
                                      : "text-[#0B2343] group-hover:text-[#0B2343]"
                                  }`}
                                >
                                  {child.name}
                                </span>
                                <span className="block text-xs text-[#0B2343]/45 mt-0.5">
                                  {child.desc}
                                </span>
                              </div>
                              <ArrowRight
                                size={14}
                                className="ml-auto text-[#0B2343]/20 group-hover:text-[#ff7c22] transition-colors shrink-0"
                              />
                            </Link>
                          ))}
                        </div>
                        <div className="px-5 py-3.5 bg-[#0B2343]/[0.02] border-t border-[#0B2343]/5">
                          <Link
                            to="/tutors"
                            className="flex items-center gap-2 text-sm font-medium text-[#ff7c22] hover:text-[#e56a10] transition-colors"
                          >
                            <Sparkles size={14} />
                            Book a free trial lesson
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 text-[15px] font-medium rounded-lg transition-colors duration-200 ${
                      isActive(link.path)
                        ? "text-[#ff7c22]"
                        : "text-[#0B2343]/65 hover:text-[#0B2343]"
                    }`}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ff7c22]" />
                    )}
                  </Link>
                ),
              )}
            </div>

            {/* ─── Desktop CTAs ─── */}
            <div className="hidden lg:flex items-center gap-2">
              <Link to={"/login"}>
                <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#0B2343]/70 hover:text-[#ff7c22] hover:bg-[#ff7c22]/5 rounded-lg transition-colors duration-200">
                  <LogIn size={16} />
                  Sign In
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#ff7c22] rounded-full hover:bg-[#e56a10] transition-colors duration-200">
                  <GraduationCap size={16} />
                  Start Learning
                </button>
              </Link>
            </div>

            {/* ─── Mobile Toggle ─── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden relative z-[60] p-2.5 rounded-xl transition-colors duration-200 ${
                mobileOpen
                  ? "bg-[#0B2343] text-white"
                  : "text-[#0B2343] hover:bg-[#0B2343]/[0.04]"
              }`}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </div>

        {/* Bottom border on scroll */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,124,34,0.3), transparent)",
          }}
        />
      </header>

      {/* ─── Mobile Menu ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop — real <button> so keyboard users can dismiss
              with Enter/Space. Screen reader announces "Close menu". */}
          <button
            type="button"
            className="absolute inset-0 bg-[#0B2343]/50 w-full h-full"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 h-16 border-b border-[#0B2343]/5">
              <img src={logo} alt="Amber ESOL" className="h-8 w-auto" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl bg-[#0B2343]/[0.04] text-[#0B2343] hover:bg-[#0B2343]/[0.08] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pt-5 pb-2">
              <Link
                to="/tutors"
                className="flex items-center gap-3 px-4 py-3 bg-[#ff7c22]/5 border border-[#ff7c22]/10 rounded-xl text-sm text-[#ff7c22] font-medium"
              >
                <Sparkles size={16} />
                Find your perfect tutor
                <ArrowRight size={14} className="ml-auto" />
              </Link>
            </div>

            <div className="px-5 py-4">
              <p className="px-1 mb-2 text-[11px] font-semibold text-[#0B2343]/35 uppercase tracking-wider">
                Navigation
              </p>
              <div className="space-y-0.5">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.name}>
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === link.name ? null : link.name,
                          )
                        }
                        className={`flex items-center justify-between w-full px-3 py-3 text-[15px] font-medium rounded-xl transition-colors ${
                          isChildActive(link.children)
                            ? "text-[#ff7c22] bg-[#ff7c22]/5"
                            : "text-[#0B2343]/75 hover:bg-[#0B2343]/[0.03]"
                        }`}
                      >
                        {link.name}
                        <ChevronDown
                          size={16}
                          className={`text-[#0B2343]/30 transition-transform duration-200 ${
                            dropdownOpen === link.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          dropdownOpen === link.name
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="py-1.5 pl-3 space-y-0.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                isActive(child.path)
                                  ? "bg-[#ff7c22]/5 text-[#ff7c22] font-medium"
                                  : "text-[#0B2343]/60 hover:bg-[#0B2343]/[0.03] hover:text-[#0B2343]"
                              }`}
                            >
                              <span
                                className={
                                  isActive(child.path)
                                    ? "text-[#ff7c22]"
                                    : "text-[#0B2343]/30"
                                }
                              >
                                {child.icon}
                              </span>
                              <div>
                                <span className="block font-medium">
                                  {child.name}
                                </span>
                                <span className="block text-[11px] text-[#0B2343]/40 mt-0.5">
                                  {child.desc}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-3 py-3 text-[15px] font-medium rounded-xl transition-colors ${
                        isActive(link.path)
                          ? "text-[#ff7c22] bg-[#ff7c22]/5"
                          : "text-[#0B2343]/75 hover:bg-[#0B2343]/[0.03]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ),
                )}
              </div>
            </div>

            <div className="mx-5 h-px bg-[#0B2343]/5" />

            <div className="px-5 py-4">
              <p className="px-1 mb-2 text-[11px] font-semibold text-[#0B2343]/35 uppercase tracking-wider">
                Quick Links
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  // {
                  //   icon: <Shield size={16} />,
                  //   label: "Trust & Safety",
                  //   path: "/trust",
                  // },
                  {
                    icon: <MessageCircle size={16} />,
                    label: "Support",
                    path: "/help",
                  },
                  {
                    icon: <FileText size={16} />,
                    label: "Blog",
                    path: "/blogs",
                  },
                  // {
                  //   icon: <GraduationCap size={16} />,
                  //   label: "Teach with us",
                  //   path: "/signup",
                  // },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-[#0B2343]/50 bg-[#0B2343]/[0.03] hover:bg-[#0B2343]/[0.06] hover:text-[#0B2343] transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-5 py-4 space-y-2.5">
              <Link to={"/signup"} className="block">
                <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-[#ff7c22] rounded-xl hover:bg-[#e56a10] transition-colors duration-200">
                  <GraduationCap size={18} />
                  Start Learning Free
                </button>
              </Link>
              <Link to={"/login"} className="block">
                <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-[#0B2343] border border-[#0B2343]/15 rounded-xl hover:border-[#ff7c22] hover:text-[#ff7c22] transition-colors duration-200">
                  <LogIn size={18} />
                  Sign In
                </button>
              </Link>
            </div>

            <div className="mt-auto px-5 py-4 border-t border-[#0B2343]/5 bg-[#0B2343]/[0.02]">
              <a
                href="tel:+447763658885"
                className="flex items-center gap-2.5 text-sm text-[#0B2343]/50 hover:text-[#ff7c22] transition-colors"
              >
                <Phone size={14} />
                Need help?{" "}
                <strong className="text-[#0B2343]">+44 7763 658885</strong>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="h-16 lg:h-[72px]" />
    </>
  );
}
