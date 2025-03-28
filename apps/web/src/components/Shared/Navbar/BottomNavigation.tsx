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
import Link from "next/link";
import { useRouter } from "next/router";

const BottomNavigation = () => {
  const { currentAccount } = useAccountStore();
  const router = useRouter();

  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[5] border-gray-200 border-t bg-white pb-safe md:hidden dark:border-gray-800 dark:bg-black">
      <div
        className={cn("grid", currentAccount ? "grid-cols-4" : "grid-cols-3")}
      >
        <Link aria-label="Home" className="mx-auto my-3" href="/">
          {isActivePath("/") ? (
            <HomeIconSolid className="size-6" />
          ) : (
            <HomeIcon className="size-6" />
          )}
        </Link>
        <Link aria-label="Explore" className="mx-auto my-3" href="/explore">
          {isActivePath("/explore") ? (
            <Squares2X2IconSolid className="size-6" />
          ) : (
            <Squares2X2Icon className="size-6" />
          )}
        </Link>
        <Link
          aria-label="Notifications"
          className="mx-auto my-3"
          href="/notifications"
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
            href={getAccount(currentAccount).link}
          >
            <Image
              alt={currentAccount.address}
              className="size-6 rounded-full border dark:border-gray-700"
              src={getAvatar(currentAccount)}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
