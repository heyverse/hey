import cn from "@/helpers/cn";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface MenuProps {
  children: ReactNode;
  current: boolean;
  url: string;
}

interface SidebarItem {
  active?: boolean;
  enabled?: boolean;
  icon: ReactNode;
  title: string;
  url: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Menu = ({ children, current, url }: MenuProps) => (
  <Link
    className={cn(
      { "font-bold": current },
      { "bg-neutral-300 dark:bg-neutral-300/20": current },
      "hover:bg-neutral-300 dark:hover:bg-neutral-300/30",
      "flex items-center space-x-2 rounded-lg px-3 py-2"
    )}
    to={url}
  >
    {children}
  </Link>
);

const SidebarTabs = ({ items }: SidebarProps) => {
  const { pathname } = useLocation();
  const menuItems = items.filter((item) => item.enabled !== false);

  return (
    <div className="mb-4 space-y-2 px-3 sm:px-0">
      {menuItems.map((item) => (
        <Menu
          current={pathname === item.url || item.active === true}
          key={item.title}
          url={item.url}
        >
          {item.icon}
          <div>{item.title}</div>
        </Menu>
      ))}
    </div>
  );
};

export default SidebarTabs;
