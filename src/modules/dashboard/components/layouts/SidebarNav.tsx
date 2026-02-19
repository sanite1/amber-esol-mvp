import { NavLink, useLocation } from "react-router-dom";

export interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: string | number;
  external?: boolean;
}

export interface MenuSection {
  label: string;
  items: MenuItem[];
}

interface SidebarNavProps {
  sections: MenuSection[];
  collapsed: boolean;
  onItemClick?: () => void;
}

const NavItem = ({
  item,
  collapsed,
  onClick,
}: {
  item: MenuItem;
  collapsed: boolean;
  onClick?: () => void;
}) => {
  const location = useLocation();
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
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B2343] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
          {item.name}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0B2343] rotate-45" />
        </div>
      )}
    </NavLink>
  );
};

const SidebarNav = ({ sections, collapsed, onItemClick }: SidebarNavProps) => {
  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5 space-y-5 [&::-webkit-scrollbar]:w-0">
      {sections.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0B2343]/25">
              {section.label}
            </p>
          )}
          {collapsed && (
            <div className="w-6 h-px bg-[#0B2343]/[0.06] mx-auto mb-2" />
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                collapsed={collapsed}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};

export default SidebarNav;
