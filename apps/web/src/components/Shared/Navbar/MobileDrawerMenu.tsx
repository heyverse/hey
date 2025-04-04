import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import hasAccess from "@/helpers/hasAccess";
import { useMobileDrawerModalStore } from "@/store/non-persisted/modal/useMobileDrawerModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Features } from "@hey/data/features";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { Link } from "react-router";
import Slug from "../Slug";
import Bookmarks from "./NavItems/Bookmarks";
import Groups from "./NavItems/Groups";
import Logout from "./NavItems/Logout";
import Settings from "./NavItems/Settings";
import StaffTools from "./NavItems/StaffTools";
import Support from "./NavItems/Support";
import SwitchAccount from "./NavItems/SwitchAccount";
import ThemeSwitch from "./NavItems/ThemeSwitch";
import YourAccount from "./NavItems/YourAccount";

const MobileDrawerMenu = () => {
  const { currentAccount } = useAccountStore();
  const { setShowMobileDrawer } = useMobileDrawerModalStore();
  const isStaff = hasAccess(Features.Staff);

  const handleCloseDrawer = () => {
    setShowMobileDrawer(false);
  };

  const itemClass = "py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800";

  return (
    <div className="no-scrollbar fixed inset-0 z-10 h-full w-full overflow-y-auto bg-neutral-100 py-4 md:hidden dark:bg-black">
      <button className="px-5" onClick={handleCloseDrawer} type="button">
        <XMarkIcon className="size-6" />
      </button>
      <div className="w-full space-y-2">
        <Link
          className="mt-2 flex items-center space-x-2 px-5 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-800"
          to={getAccount(currentAccount).link}
          onClick={handleCloseDrawer}
        >
          <div className="flex w-full space-x-1.5">
            <Image
              alt={currentAccount?.address}
              className="size-12 cursor-pointer rounded-full border border-neutral-200 dark:border-neutral-700"
              src={getAvatar(currentAccount)}
            />
            <div>
              Logged in as
              <div className="truncate">
                <Slug
                  className="font-bold"
                  slug={getAccount(currentAccount).usernameWithPrefix}
                />
              </div>
            </div>
          </div>
        </Link>
        <div className="bg-white dark:bg-neutral-900">
          <div className="divider" />
          <SwitchAccount className={cn(itemClass, "px-4")} />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-neutral-900">
          <div className="divider" />
          <div>
            <Link
              to={getAccount(currentAccount).link}
              onClick={handleCloseDrawer}
            >
              <YourAccount className={cn(itemClass, "px-4")} />
            </Link>
            <Link to="/settings" onClick={handleCloseDrawer}>
              <Settings className={cn(itemClass, "px-4")} />
            </Link>
            {isStaff ? (
              <Link to="/staff" onClick={handleCloseDrawer}>
                <StaffTools className={cn(itemClass, "px-4")} />
              </Link>
            ) : null}
            <Link to="/groups" onClick={handleCloseDrawer}>
              <Groups className={cn(itemClass, "px-4")} />
            </Link>
            <Link to="/bookmarks" onClick={handleCloseDrawer}>
              <Bookmarks className={cn(itemClass, "px-4")} />
            </Link>
            <ThemeSwitch
              className={cn(itemClass, "px-4")}
              onClick={handleCloseDrawer}
            />
          </div>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-neutral-900">
          <div className="divider" />
          <Link to="/support" onClick={handleCloseDrawer}>
            <Support className={cn(itemClass, "px-4")} />
          </Link>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-neutral-900">
          <div className="divider" />
          <div className="hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <Logout
              className={cn(itemClass, "px-4 py-3")}
              onClick={handleCloseDrawer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawerMenu;
