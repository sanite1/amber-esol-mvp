import { NavLink } from "react-router-dom";
import { Menu, HelpCircle, ChevronRight } from "lucide-react";
import logo from "../../assets/logo.png";
import NotificationsDropdown from "./NotificationsDropdown";
import ProfileDropdown from "./ProfileDropdown";

interface HeaderProps {
  user: {
    firstname?: string;
    lastname?: string;
    email?: string;
    role?: string;
  } | null;
  breadcrumb: string;
  roleLabel: string;
  helpUrl: string;
  onMobileMenuOpen: () => void;
  onLogout: () => void;
}

const Header = ({
  user,
  breadcrumb,
  roleLabel,
  helpUrl,
  onMobileMenuOpen,
  onLogout,
}: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-[#0B2343]/[0.06] z-[9995]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuOpen}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <Menu size={20} className="text-[#0B2343]/60" />
          </button>

          <NavLink to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Amber ESOL" className="h-8 w-auto" />
          </NavLink>

          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-[#0B2343]/[0.06]">
            <span className="text-xs font-medium text-[#0B2343]/30">
              {roleLabel}
            </span>
            <ChevronRight size={12} className="text-[#0B2343]/20" />
            <span className="text-xs font-semibold text-[#0B2343]/70">
              {breadcrumb}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => window.open(helpUrl, "_blank")}
            className="hidden sm:flex p-2 rounded-lg hover:bg-[#0B2343]/[0.04] transition-colors"
          >
            <HelpCircle size={18} className="text-[#0B2343]/35" />
          </button>

          <NotificationsDropdown />

          <div className="w-px h-6 bg-[#0B2343]/[0.06] mx-1.5 hidden sm:block" />

          <ProfileDropdown
            user={user}
            roleLabel={roleLabel}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
