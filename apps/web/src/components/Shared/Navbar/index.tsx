import { Image, Tooltip } from "@/components/Shared/UI";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import {
  BellIcon as BellOutline,
  BookmarkIcon as BookmarkOutline,
  GlobeAltIcon as GlobeOutline,
  HomeIcon as HomeOutline,
  UserCircleIcon,
  UserGroupIcon as UserGroupOutline
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellSolid,
  BookmarkIcon as BookmarkSolid,
  GlobeAltIcon as GlobeSolid,
  HomeIcon as HomeSolid,
  UserGroupIcon as UserGroupSolid
} from "@heroicons/react/24/solid";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import type { MouseEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router";
import Pro from "./Pro";
import SignedAccount from "./SignedAccount";

const navigationItems = {
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
  },
  "/bookmarks": {
    title: "Bookmarks",
    solid: <BookmarkSolid className="size-6" />,
    outline: <BookmarkOutline className="size-6" />
  }
};

const NavItem = ({ url, icon }: { url: string; icon: ReactNode }) => (
  <Tooltip content={navigationItems[url as keyof typeof navigationItems].title}>
    <Link to={url}>{icon}</Link>
  </Tooltip>
);

const NavItems = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { pathname } = useLocation();
  const routes = [
    "/",
    "/explore",
    ...(isLoggedIn ? ["/notifications", "/groups", "/bookmarks"] : [])
  ];

  return (
    <>
      {routes.map((route) => (
        <NavItem
          key={route}
          url={route}
          icon={
            pathname === route
              ? navigationItems[route as keyof typeof navigationItems].solid
              : navigationItems[route as keyof typeof navigationItems].outline
          }
        />
      ))}
    </>
  );
};

const Navbar = () => {
  const { pathname } = useLocation();
  const { currentAccount } = useAccountStore();
  const { appIcon } = usePreferencesStore();
  const { setShowAuthModal } = useAuthModalStore();

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo(0, 0);
    }
  };

  return (
    <aside className="sticky top-5 mt-5 hidden w-10 shrink-0 flex-col items-center gap-y-5 md:flex">
      <Link to="/" onClick={handleLogoClick}>
        <Image
          alt="Logo"
          className="size-8"
          src={`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
          height={32}
          width={32}
        />
      </Link>
      <NavItems isLoggedIn={!!currentAccount} />
      {currentAccount ? (
        <>
          <Pro />
          <SignedAccount />
        </>
      ) : (
        <button onClick={() => setShowAuthModal(true)} type="button">
          <Tooltip content="Login">
            <UserCircleIcon className="size-6" />
          </Tooltip>
        </button>
      )}
    </aside>
  );
};

export default Navbar;
