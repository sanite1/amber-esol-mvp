import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";

interface ProfileDropdownProps {
  user: {
    firstname?: string;
    lastname?: string;
    email?: string;
    role?: string;
  } | null;
  onLogout: () => void;
}

const ProfileDropdown = ({ user, onLogout }: ProfileDropdownProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = `${user?.firstname?.[0] || ""}${user?.lastname?.[0] || ""}`;
  const fullName = `${user?.firstname || ""} ${user?.lastname || ""}`;
  const isAdmin = user?.role === "admin";
  const isTutor = user?.role === "tutor";
  const roleLabel = isAdmin ? "Administrator" : isTutor ? "Tutor" : "Student";

  const profilePath = isAdmin
    ? "/admin/settings"
    : isTutor
      ? "/tutor/profile"
      : "/profile";
  const settingsPath = isAdmin
    ? "/admin/settings"
    : isTutor
      ? "/tutor/settings"
      : "/settings";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative profile-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
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
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg shadow-[#0B2343]/8 border border-[#0B2343]/[0.06] overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-[#0B2343]/[0.06]">
              <p className="text-sm font-semibold text-[#0B2343]">{fullName}</p>
              <p className="text-xs text-[#0B2343]/40 truncate">
                {user?.email}
              </p>
            </div>
            <div className="p-1.5">
              <NavLink
                to={profilePath}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[#0B2343]/[0.04] transition-colors"
              >
                <User size={14} className="text-[#0B2343]/40" />
                <span className="text-sm text-[#0B2343]/70">Profile</span>
              </NavLink>
              <NavLink
                to={settingsPath}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-[#0B2343]/[0.04] transition-colors"
              >
                <Settings size={14} className="text-[#0B2343]/40" />
                <span className="text-sm text-[#0B2343]/70">Settings</span>
              </NavLink>
            </div>
            <div className="p-1.5 border-t border-[#0B2343]/[0.06]">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
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
  );
};

export default ProfileDropdown;
