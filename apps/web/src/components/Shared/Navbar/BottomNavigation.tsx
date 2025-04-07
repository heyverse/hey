import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {
  BellIcon,
  HomeIcon,
  Squares2X2Icon
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellIconSolid,
  HomeIcon as HomeIconSolid,
  Squares2X2Icon as Squares2X2IconSolid
} from "@heroicons/react/24/solid";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { Link, useLocation } from "react-router";

const BottomNavigation = () => {
  const { currentAccount } = useAccountStore();
  const { pathname } = useLocation();

  const isActivePath = (path: string) => pathname === path;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[5] border-gray-200 border-t bg-white pb-safe md:hidden dark:border-gray-800 dark:bg-black">
      <div
        className={cn("grid", currentAccount ? "grid-cols-4" : "grid-cols-3")}
      >
        <Link aria-label="Home" className="mx-auto my-3" to="/">
          {isActivePath("/") ? (
            <HomeIconSolid className="size-6" />
          ) : (
            <HomeIcon className="size-6" />
          )}
        </Link>
        <Link aria-label="Explore" className="mx-auto my-3" to="/explore">
          {isActivePath("/explore") ? (
            <Squares2X2IconSolid className="size-6" />
          ) : (
            <Squares2X2Icon className="size-6" />
          )}
        </Link>
        <Link
          aria-label="Notifications"
          className="mx-auto my-3"
          to="/notifications"
        >
          {isActivePath("/notifications") ? (
            <BellIconSolid className="size-6" />
          ) : (
            <BellIcon className="size-6" />
          )}
        </Link>
        {currentAccount && (
          <Link
            aria-label="Your account"
            className="mx-auto my-3"
            to={getAccount(currentAccount).link}
          >
            <Image
              alt={currentAccount.address}
              className="size-6 rounded-full border border-gray-200 dark:border-gray-700"
              src={getAvatar(currentAccount)}
            />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BottomNavigation;
