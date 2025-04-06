import MetaTags from "@/components/Common/MetaTags";
import type { ReactNode } from "react";
import Search from "./Sidebar/Search";

interface SidebarProps {
  children: ReactNode;
  showSearch?: boolean;
}

const Sidebar = ({ children, showSearch = false }: SidebarProps) => {
  return (
    <aside className="no-scrollbar sticky top-5 mt-5 hidden max-h-screen w-96 shrink-0 flex-col gap-y-5 overflow-y-auto lg:flex">
      {showSearch && <Search />}
      {children}
    </aside>
  );
};

interface PageLayoutProps {
  title?: string;
  children: ReactNode;
  sidebar?: ReactNode;
}

export const GeneralPageLayout = ({
  title,
  children,
  sidebar
}: PageLayoutProps) => {
  return (
    <>
      {title && <MetaTags title={title} />}
      <div className="mt-5 flex-1 space-y-5 pr-5 sm:pr-0">{children}</div>
      <Sidebar showSearch>{sidebar}</Sidebar>
    </>
  );
};

export const SettingsPageLayout = ({
  title,
  children,
  sidebar
}: PageLayoutProps) => {
  return (
    <>
      {title && <MetaTags title={title} />}
      <Sidebar>{sidebar}</Sidebar>
      <div className="mt-5 flex-1 space-y-5">{children}</div>
    </>
  );
};
