import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import type { MenuSection } from "./SidebarNav";

interface DesktopSidebarProps {
  open: boolean;
  sections: MenuSection[];
  isAdmin: boolean;
  showProfileCompletion: boolean;
  profilePercentage: number;
  helpUrl: string;
  onToggle: () => void;
}

const DesktopSidebar = ({
  open,
  sections,
  isAdmin,
  showProfileCompletion,
  profilePercentage,
  helpUrl,
  onToggle,
}: DesktopSidebarProps) => {
  return (
    <aside
      className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white border-r border-[#0B2343]/[0.06] hidden lg:flex flex-col transition-all duration-200 ease-out z-30 ${
        open ? "w-56" : "w-[60px]"
      }`}
    >
      <SidebarNav sections={sections} collapsed={!open} />
      <SidebarFooter
        collapsed={!open}
        isAdmin={isAdmin}
        showProfileCompletion={showProfileCompletion}
        profilePercentage={profilePercentage}
        helpUrl={helpUrl}
        onToggleCollapse={onToggle}
      />
    </aside>
  );
};

export default DesktopSidebar;
