import Search from "./Search";

interface SidebarWithSearchProps {
  children: React.ReactNode;
}

const SidebarWithSearch = ({ children }: SidebarWithSearchProps) => {
  return (
    <aside className="sticky top-10 mt-10 hidden w-96 shrink-0 flex-col gap-y-5 xl:flex">
      <Search />
      {children}
    </aside>
  );
};

export default SidebarWithSearch;
