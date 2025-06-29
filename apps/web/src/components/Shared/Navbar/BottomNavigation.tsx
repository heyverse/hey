import {
  BellIcon,
  GlobeAltIcon as GlobeOutline,
  HomeIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellIconSolid,
  GlobeAltIcon as GlobeSolid,
  HomeIcon as HomeIconSolid
} from "@heroicons/react/24/solid";
import getAvatar from "@hey/helpers/getAvatar";
import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { Image } from "@/components/Shared/UI";
import { useMobileDrawerModalStore } from "@/store/non-persisted/modal/useMobileDrawerModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import MobileDrawerMenu from "./MobileDrawerMenu";

interface NavigationItemProps {
  path: string;
  label: string;
  outline: ReactNode;
  solid: ReactNode;
  isActive: boolean;
  onClick?: (e: MouseEvent) => void;
}

const NavigationItem = ({
  path,
  label,
  outline,
  solid,
  isActive,
  onClick
}: NavigationItemProps) => (
  <Link aria-label={label} className="mx-auto my-3" onClick={onClick} to={path}>
    {isActive ? solid : outline}
  </Link>
);

const BottomNavigation = () => {
  const { pathname } = useLocation();
  const { currentAccount } = useAccountStore();
  const { show: showMobileDrawer, setShow: setShowMobileDrawer } =
    useMobileDrawerModalStore();

  const handleAccountClick = () => setShowMobileDrawer(true);

  const handleHomClick = (path: string, e: MouseEvent) => {
    if (path === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo(0, 0);
    }
  };

  const navigationItems = [
    {
      label: "Home",
      outline: <HomeIcon className="size-6" />,
      path: "/",
      solid: <HomeIconSolid className="size-6" />
    },
    {
      label: "Search",
      outline: <MagnifyingGlassIcon className="size-6" />,
      path: "/search",
      solid: <MagnifyingGlassIcon className="size-6" />
    },
    {
      label: "Explore",
      outline: <GlobeOutline className="size-6" />,
      path: "/explore",
      solid: <GlobeSolid className="size-6" />
    },
    {
      label: "Notifications",
      outline: <BellIcon className="size-6" />,
      path: "/notifications",
      solid: <BellIconSolid className="size-6" />
    }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[5] border-gray-200 border-t bg-white pb-safe md:hidden dark:border-gray-800 dark:bg-black">
      {showMobileDrawer && <MobileDrawerMenu />}
      <div className="flex justify-between">
        {navigationItems.map(({ path, label, outline, solid }) => (
          <NavigationItem
            isActive={pathname === path}
            key={path}
            label={label}
            onClick={(e) => handleHomClick(path, e)}
            outline={outline}
            path={path}
            solid={solid}
          />
        ))}
        {currentAccount && (
          <button
            aria-label="Your account"
            className="m-auto h-fit"
            onClick={handleAccountClick}
            type="button"
          >
            <Image
              alt={currentAccount.address}
              className="m-0.5 size-6 rounded-full border border-gray-200 dark:border-gray-700"
              src={getAvatar(currentAccount)}
            />
          </button>
        )}
      </div>
    </nav>
  );
};

export default BottomNavigation;
