import { Image } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import {
  BellIcon as BellIconOutline,
  GlobeAltIcon as GlobeAltIconOutline,
  HomeIcon as HomeIconOutline
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  HomeIcon as HomeIconSolid
} from "@heroicons/react/24/solid";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import MenuItems from "./MenuItems";

const Navbar = () => {
  const { currentAccount } = useAccountStore();
  const { appIcon } = usePreferencesStore();

  interface NavItemProps {
    icon: ReactNode;
    url: string;
  }

  const NavItem = ({ icon, url }: NavItemProps) => {
    return <Link to={url}>{icon}</Link>;
  };

  const NavItems = () => {
    const { pathname } = useLocation();

    return (
      <>
        <NavItem
          icon={
            pathname === "/" ? (
              <HomeIconSolid className="size-7" />
            ) : (
              <HomeIconOutline className="size-7" />
            )
          }
          url="/"
        />
        <NavItem
          icon={
            pathname === "/explore" ? (
              <GlobeAltIconSolid className="size-7" />
            ) : (
              <GlobeAltIconOutline className="size-7" />
            )
          }
          url="/explore"
        />
        {currentAccount ? (
          <NavItem
            icon={
              pathname === "/notifications" ? (
                <BellIconSolid className="size-7" />
              ) : (
                <BellIconOutline className="size-7" />
              )
            }
            url="/notifications"
          />
        ) : null}
      </>
    );
  };

  return (
    <aside className="sticky top-10 hidden w-10 shrink-0 flex-col items-center gap-y-5 lg:flex">
      <Link to="/">
        <Image
          alt="Logo"
          className="size-9"
          src={`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
          height={36}
          width={36}
        />
      </Link>
      <NavItems />
      <MenuItems />
    </aside>
  );
};

export default Navbar;
