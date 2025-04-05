import Sidebar from "@/components/Shared/Sidebar";
import { LockClosedIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useLocation, useParams } from "react-router";

const SettingsSidebar = () => {
  const { pathname } = useLocation();
  const { address } = useParams<{ address: string }>();

  const sidebarItems = [
    {
      icon: <UserGroupIcon className="size-4" />,
      title: "Group",
      url: `/g/${address}/settings`,
      active: pathname === "/g/[address]/settings"
    },
    {
      icon: <LockClosedIcon className="size-4" />,
      title: "Group Rules",
      url: `/g/${address}/settings/rules`,
      active: pathname === "/g/[address]/settings/rules"
    }
  ];

  return <Sidebar items={sidebarItems} />;
};

export default SettingsSidebar;
