import { Image, Tooltip } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import {
  BellIcon as BellOutline,
  GlobeAltIcon as GlobeOutline,
  HomeIcon as HomeOutline,
  UserGroupIcon as UserGroupOutline
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellSolid,
  GlobeAltIcon as GlobeSolid,
  HomeIcon as HomeSolid,
  UserGroupIcon as UserGroupSolid
} from "@heroicons/react/24/solid";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import MenuItems from "./MenuItems";

const icons = {
  "/": {
    title: "Home",
    solid: <HomeSolid className="size-6" />,
    outline: <HomeOutline className="size-6" />
  },
  "/explore": {
    title: "Explore",
    solid: <GlobeSolid className="size-6" />,
    outline: <GlobeOutline className="size-6" />
  },
  "/notifications": {
    title: "Notifications",
    solid: <BellSolid className="size-6" />,
    outline: <BellOutline className="size-6" />
  },
  "/groups": {
    title: "Groups",
    solid: <UserGroupSolid className="size-6" />,
    outline: <UserGroupOutline className="size-6" />
  }
};

const NavItem = ({ url, icon }: { url: string; icon: ReactNode }) => (
  <Tooltip content={icons[url as keyof typeof icons].title} placement="right">
    <Link to={url}>{icon}</Link>
  </Tooltip>
);

const NavItems = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { pathname } = useLocation();
  const routes = [
    "/",
    "/explore",
    ...(isLoggedIn ? ["/notifications", "/groups"] : [])
  ];

  return (
    <>
      {routes.map((route) => (
        <NavItem
          key={route}
          url={route}
          icon={
            pathname === route
              ? icons[route as keyof typeof icons].solid
              : icons[route as keyof typeof icons].outline
          }
        />
      ))}
    </>
  );
};

const Navbar = () => {
  const { currentAccount } = useAccountStore();
  const { appIcon } = usePreferencesStore();

  return (
    <aside className="sticky top-5 mt-5 hidden w-10 shrink-0 flex-col items-center gap-y-5 md:flex">
      <Link to="/">
        <Image
          alt="Logo"
          className="size-8"
          src={`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
          height={32}
          width={32}
        />
      </Link>
      <NavItems isLoggedIn={!!currentAccount} />
      <MenuItems />
    </aside>
  );
};

export default Navbar;
