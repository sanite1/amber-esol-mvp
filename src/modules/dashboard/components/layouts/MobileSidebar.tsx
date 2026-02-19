import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import logo from "../../assets/logo.png";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import type { MenuSection } from "./SidebarNav";

interface MobileSidebarProps {
  open: boolean;
  sections: MenuSection[];
  isAdmin: boolean;
  showProfileCompletion: boolean;
  profilePercentage: number;
  helpUrl: string;
  user: {
    firstname?: string;
    lastname?: string;
    role?: string;
  } | null;
  onClose: () => void;
  onLogout: () => void;
}

const MobileSidebar = ({
  open,
  sections,
  isAdmin,
  showProfileCompletion,
  profilePercentage,
  helpUrl,
  user,
  onClose,
  onLogout,
}: MobileSidebarProps) => {
  const initials = `${user?.firstname?.[0] || ""}${user?.lastname?.[0] || ""}`;
  const fullName = `${user?.firstname || ""} ${user?.lastname || ""}`;
  const isTutor = user?.role === "tutor";
  const roleLabel = isAdmin ? "Administrator" : isTutor ? "Tutor" : "Student";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B2343]/40 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed left-0 top-0 h-full w-72 bg-white z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-[#0B2343]/[0.06]">
              <NavLink
                to="/"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <img src={logo} alt="Amber ESOL" className="h-8 w-auto" />
              </NavLink>
              <button
                onClick={onClose}
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

            {/* Nav */}
            <SidebarNav
              sections={sections}
              collapsed={false}
              onItemClick={onClose}
            />

            {/* Footer */}
            <SidebarFooter
              collapsed={false}
              isAdmin={isAdmin}
              showProfileCompletion={showProfileCompletion}
              profilePercentage={profilePercentage}
              helpUrl={helpUrl}
              onLogout={onLogout}
              onNavigate={onClose}
              mobile
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
