import type { ReactNode } from "react";
import Search from "./Search";

interface SidebarWithSearchProps {
  children: ReactNode;
}

const SidebarWithSearch = ({ children }: SidebarWithSearchProps) => {
  return (
    <aside className="no-scrollbar sticky top-10 mt-10 hidden max-h-screen w-96 shrink-0 flex-col gap-y-5 overflow-y-auto xl:flex">
      <Search />
      {children}
    </aside>
  );
};

export default SidebarWithSearch;
