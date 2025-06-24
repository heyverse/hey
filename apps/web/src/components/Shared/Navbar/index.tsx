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
import { type MouseEvent, type ReactNode, useCallback } from "react";
import { Link, useLocation } from "react-router";
import Pro from "@/components/Shared/Navbar/NavItems/Pro";
import { Image, Tooltip } from "@/components/Shared/UI";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import SignedAccount from "./SignedAccount";

const navigationItems = {
  "/": {
    outline: <HomeOutline className="size-6" />,
    solid: <HomeSolid className="size-6" />,
    title: "Home"
  },
  "/bookmarks": {
    outline: <BookmarkOutline className="size-6" />,
    solid: <BookmarkSolid className="size-6" />,
    title: "Bookmarks"
  },
  "/explore": {
    outline: <GlobeOutline className="size-6" />,
    solid: <GlobeSolid className="size-6" />,
    title: "Explore"
  },
  "/groups": {
    outline: <UserGroupOutline className="size-6" />,
    solid: <UserGroupSolid className="size-6" />,
    title: "Groups"
  },
  "/notifications": {
    outline: <BellOutline className="size-6" />,
    solid: <BellSolid className="size-6" />,
    title: "Notifications"
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
          icon={
            pathname === route
              ? navigationItems[route as keyof typeof navigationItems].solid
              : navigationItems[route as keyof typeof navigationItems].outline
          }
          key={route}
          url={route}
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

  const handleLogoClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo(0, 0);
      }
    },
    [pathname]
  );

  const handleAuthClick = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  return (
    <aside className="sticky top-5 mt-5 hidden w-10 shrink-0 flex-col items-center gap-y-5 md:flex">
      <Link onClick={handleLogoClick} to="/">
        <Image
          alt="Logo"
          className="size-8"
          height={32}
          src={`${STATIC_IMAGES_URL}/app-icon/${appIcon}.png`}
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
        <button onClick={handleAuthClick} type="button">
          <Tooltip content="Login">
            <UserCircleIcon className="size-6" />
          </Tooltip>
        </button>
      )}
    </aside>
  );
};

export default Navbar;
