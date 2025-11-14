import { useApolloClient } from "@apollo/client";
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
import {
  GroupsDocument,
  NotificationIndicatorDocument,
  NotificationsDocument,
  PostBookmarksDocument,
  PostsExploreDocument,
  PostsForYouDocument,
  TimelineDocument,
  TimelineHighlightsDocument
} from "@hey/indexer";
import {
  type MouseEvent,
  memo,
  type ReactNode,
  useCallback,
  useState
} from "react";
import { Link, useLocation } from "react-router";
import { Image, Spinner, Tooltip } from "@/components/Shared/UI";
import useHasNewNotifications from "@/hooks/useHasNewNotifications";
import { useAuthModalStore } from "@/store/non-persisted/modal/useAuthModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SignedAccount from "./SignedAccount";

const navigationItems = {
  "/": {
    outline: <HomeOutline className="size-6" />,
    refreshDocs: [
      TimelineDocument,
      TimelineHighlightsDocument,
      PostsForYouDocument
    ],
    solid: <HomeSolid className="size-6" />,
    title: "Home"
  },
  "/bookmarks": {
    outline: <BookmarkOutline className="size-6" />,
    refreshDocs: [PostBookmarksDocument],
    solid: <BookmarkSolid className="size-6" />,
    title: "Bookmarks"
  },
  "/explore": {
    outline: <GlobeOutline className="size-6" />,
    refreshDocs: [PostsExploreDocument],
    solid: <GlobeSolid className="size-6" />,
    title: "Explore"
  },
  "/groups": {
    outline: <UserGroupOutline className="size-6" />,
    refreshDocs: [GroupsDocument],
    solid: <UserGroupSolid className="size-6" />,
    title: "Groups"
  },
  "/notifications": {
    outline: <BellOutline className="size-6" />,
    refreshDocs: [NotificationsDocument, NotificationIndicatorDocument],
    solid: <BellSolid className="size-6" />,
    title: "Notifications"
  }
};

interface NavItemProps {
  url: string;
  icon: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const NavItem = memo(({ icon, onClick, url }: NavItemProps) => (
  <Tooltip content={navigationItems[url as keyof typeof navigationItems].title}>
    <Link onClick={onClick} to={url}>
      {icon}
    </Link>
  </Tooltip>
));

const NavItems = memo(({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { pathname } = useLocation();
  const hasNewNotifications = useHasNewNotifications();
  const client = useApolloClient();
  const [refreshingRoute, setRefreshingRoute] = useState<string | null>(null);
  const routes = [
    "/",
    "/explore",
    ...(isLoggedIn ? ["/notifications", "/groups", "/bookmarks"] : [])
  ];

  return (
    <>
      {routes.map((route) => {
        let icon =
          pathname === route
            ? navigationItems[route as keyof typeof navigationItems].solid
            : navigationItems[route as keyof typeof navigationItems].outline;

        if (refreshingRoute === route) {
          icon = <Spinner className="my-0.5" size="sm" />;
        }

        const iconWithIndicator =
          route === "/notifications" ? (
            <span className="relative">
              {icon}
              {hasNewNotifications && (
                <span className="-right-1 -top-1 absolute size-2 rounded-full bg-red-500" />
              )}
            </span>
          ) : (
            icon
          );

        const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
          const item = navigationItems[route as keyof typeof navigationItems];
          const isSameRoute = pathname === route;
          if (!isSameRoute || !("refreshDocs" in item) || !item.refreshDocs) {
            return;
          }
          e.preventDefault();
          window.scrollTo(0, 0);
          setRefreshingRoute(route);
          try {
            await client.refetchQueries({ include: item.refreshDocs });
          } finally {
            setRefreshingRoute(null);
          }
        };

        return (
          <NavItem
            icon={iconWithIndicator}
            key={route}
            onClick={handleClick}
            url={route}
          />
        );
      })}
    </>
  );
});

const Navbar = () => {
  const { pathname } = useLocation();
  const { currentAccount } = useAccountStore();
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
          src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
          width={32}
        />
      </Link>
      <NavItems isLoggedIn={!!currentAccount} />
      {currentAccount ? (
        <>
          {/* <Pro /> */}
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

export default memo(Navbar);
