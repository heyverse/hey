import Sidebar from "@/components/Shared/Sidebar";
import {
  AdjustmentsVerticalIcon,
  AtSymbolIcon,
  CodeBracketIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  NoSymbolIcon,
  PaintBrushIcon,
  UserIcon
} from "@heroicons/react/24/outline";

const SettingsSidebar = () => {
  const sidebarItems = [
    {
      icon: <PaintBrushIcon className="size-4" />,
      title: "Personalize",
      url: "/settings"
    },
    {
      icon: <UserIcon className="size-4" />,
      title: "Account",
      url: "/settings/account"
    },
    {
      icon: <CreditCardIcon className="size-4" />,
      title: "Funds",
      url: "/settings/funds"
    },
    {
      icon: <AtSymbolIcon className="size-4" />,
      title: "Username",
      url: "/settings/username"
    },
    {
      icon: <AdjustmentsVerticalIcon className="size-4" />,
      title: "Preferences",
      url: "/settings/preferences"
    },
    {
      icon: <FingerPrintIcon className="size-4" />,
      title: "Manager",
      url: "/settings/manager"
    },
    {
      icon: <GlobeAltIcon className="size-4" />,
      title: "Sessions",
      url: "/settings/sessions"
    },
    {
      icon: <NoSymbolIcon className="size-4" />,
      title: "Blocked accounts",
      url: "/settings/blocked"
    },
    {
      icon: <CodeBracketIcon className="size-4" />,
      title: "Developer",
      url: "/settings/developer"
    },
    {
      icon: <ExclamationTriangleIcon className="size-4 text-red-500" />,
      title: <div className="text-red-500">Danger zone</div>,
      url: "/settings/danger"
    }
  ];

  return <Sidebar items={sidebarItems} />;
};

export default SettingsSidebar;
