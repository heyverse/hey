import SidebarMenu from "./SidebarMenu";
import SidebarTabs from "./SidebarTabs";

export interface SidebarProps {
  items: {
    active?: boolean;
    enabled?: boolean;
    icon: any;
    title: any;
    url: string;
  }[];
}

const Sidebar = ({ items }: SidebarProps) => {
  return (
    <>
      <div className="hidden lg:block">
        <SidebarTabs items={items} />
      </div>
      <div className="block lg:hidden">
        <SidebarMenu items={items} />
      </div>
    </>
  );
};

export default Sidebar;
