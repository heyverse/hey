import MetaTags from "@/components/Common/MetaTags";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { ReactNode } from "react";
import LoginButton from "./LoginButton";
import SignupButton from "./Navbar/SignupButton";
import Search from "./Sidebar/Search";

interface SidebarProps {
  children: ReactNode;
  showSearch?: boolean;
}

const Sidebar = ({ children, showSearch = false }: SidebarProps) => {
  const { currentAccount } = useAccountStore();

  return (
    <aside className="no-scrollbar sticky top-5 mt-5 hidden max-h-screen w-[22.5rem] shrink-0 flex-col gap-y-5 overflow-y-auto lg:flex">
      {currentAccount ? null : (
        <div className="flex items-center gap-x-2">
          <SignupButton className="w-full" />
          <LoginButton className="w-full" />
        </div>
      )}
      {showSearch && <Search />}
      {children}
    </aside>
  );
};

interface PageLayoutProps {
  title?: string;
  children: ReactNode;
  sidebar?: ReactNode;
  sidebarPosition?: "left" | "right";
  showSearch?: boolean;
}

export const PageLayout = ({
  title,
  children,
  sidebar,
  sidebarPosition = "right",
  showSearch = false
}: PageLayoutProps) => {
  return (
    <>
      <MetaTags title={title} />
      <div className="flex w-full gap-x-8">
        {sidebarPosition === "left" && (
          <Sidebar showSearch={showSearch}>{sidebar}</Sidebar>
        )}
        <div className="my-5 flex-1 space-y-5">{children}</div>
        {sidebarPosition === "right" && (
          <Sidebar showSearch={showSearch}>{sidebar}</Sidebar>
        )}
      </div>
    </>
  );
};
