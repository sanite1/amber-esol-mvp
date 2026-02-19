import { NavLink } from "react-router-dom";
import {
  HelpCircle,
  ExternalLink,
  Headphones,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import ProfileCompletionWidget from "./ProfileCompletionWidget";

interface SidebarFooterProps {
  collapsed: boolean;
  isAdmin: boolean;
  showProfileCompletion: boolean;
  profilePercentage: number;
  helpUrl: string;
  onToggleCollapse?: () => void;
  onLogout?: () => void;
  onNavigate?: () => void;
  /** If true, renders the mobile variant (with logout, no collapse toggle) */
  mobile?: boolean;
}

const SidebarFooter = ({
  collapsed,
  isAdmin,
  showProfileCompletion,
  profilePercentage,
  helpUrl,
  onToggleCollapse,
  onLogout,
  onNavigate,
  mobile = false,
}: SidebarFooterProps) => {
  return (
    <div className="border-t border-[#0B2343]/[0.06] p-2.5 space-y-2">
      {/* Help / Support */}
      {isAdmin ? (
        <NavLink
          to="/admin/tickets"
          onClick={onNavigate}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-lg transition-all duration-150 ${
              collapsed && !mobile
                ? "justify-center px-3 py-2.5"
                : "px-3 py-2.5"
            } ${
              isActive
                ? "bg-[#ff7c22]/10 text-[#ff7c22]"
                : "text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/60"
            }`
          }
        >
          <Headphones size={18} className="shrink-0" />
          {(!collapsed || mobile) && (
            <span className="text-[13px] font-medium">Support Tickets</span>
          )}
          {collapsed && !mobile && (
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
            onNavigate?.();
          }}
          className={`group relative flex items-center gap-3 rounded-lg text-[#0B2343]/40 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/60 transition-all duration-150 ${
            collapsed && !mobile ? "justify-center px-3 py-2.5" : "px-3 py-2.5"
          }`}
        >
          <HelpCircle size={18} className="shrink-0" />
          {(!collapsed || mobile) && (
            <>
              <span className="text-[13px] font-medium">Help & Support</span>
              <ExternalLink size={12} className="ml-auto opacity-40" />
            </>
          )}
          {collapsed && !mobile && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B2343] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none flex items-center gap-1.5">
              Help & Support
              <ExternalLink size={10} />
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0B2343] rotate-45" />
            </div>
          )}
        </a>
      )}

      {/* Profile completion */}
      {showProfileCompletion && (
        <ProfileCompletionWidget
          percentage={profilePercentage}
          collapsed={collapsed && !mobile}
          onNavigate={onNavigate}
        />
      )}

      {/* Mobile: logout */}
      {mobile && onLogout && (
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors w-full text-left"
        >
          <LogOut size={16} className="text-red-400" />
          <span className="text-[13px] font-medium text-red-500">Sign out</span>
        </button>
      )}

      {/* Desktop: collapse toggle */}
      {!mobile && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className={`flex items-center gap-3 rounded-lg text-[#0B2343]/30 hover:bg-[#0B2343]/[0.04] hover:text-[#0B2343]/50 transition-all duration-150 w-full ${
            collapsed ? "justify-center px-3 py-2" : "px-3 py-2"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <>
              <PanelLeftClose size={16} className="shrink-0" />
              <span className="text-[11px] font-medium">Collapse</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default SidebarFooter;
