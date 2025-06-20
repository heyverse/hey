import AccountLink from "@/components/Shared/Account/AccountLink";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Bookmarks from "@/components/Shared/Navbar/NavItems/Bookmarks";
import Groups from "@/components/Shared/Navbar/NavItems/Groups";
import Logout from "@/components/Shared/Navbar/NavItems/Logout";
import Settings from "@/components/Shared/Navbar/NavItems/Settings";
import Support from "@/components/Shared/Navbar/NavItems/Support";
import SwitchAccount from "@/components/Shared/Navbar/NavItems/SwitchAccount";
import ThemeSwitch from "@/components/Shared/Navbar/NavItems/ThemeSwitch";
import YourAccount from "@/components/Shared/Navbar/NavItems/YourAccount";
import cn from "@/helpers/cn";
import { useMobileDrawerModalStore } from "@/store/non-persisted/modal/useMobileDrawerModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { AccountFragment } from "@hey/indexer";
import { Link } from "react-router";

const MobileDrawerMenu = () => {
  const { currentAccount } = useAccountStore();
  const { setShowMobileDrawer } = useMobileDrawerModalStore();

  const handleCloseDrawer = () => {
    setShowMobileDrawer(false);
  };

  const itemClass = "py-3 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <div className="no-scrollbar fixed inset-0 z-10 size-full overflow-y-auto bg-gray-100 py-4 md:hidden dark:bg-black">
      <button className="px-5" onClick={handleCloseDrawer} type="button">
        <XMarkIcon className="size-6" />
      </button>
      <div className="w-full space-y-2">
        <AccountLink
          className="mt-2 flex items-center space-x-2 px-5 py-3 hover:bg-gray-200 dark:hover:bg-gray-800"
          account={currentAccount as AccountFragment}
          onClick={handleCloseDrawer}
        >
          <SingleAccount
            account={currentAccount as AccountFragment}
            linkToAccount={false}
            showUserPreview={false}
          />
        </AccountLink>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <SwitchAccount className={cn(itemClass, "px-4")} />
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div>
            <AccountLink
              account={currentAccount as AccountFragment}
              onClick={handleCloseDrawer}
            >
              <YourAccount className={cn(itemClass, "px-4")} />
            </AccountLink>
            <Link to="/settings" onClick={handleCloseDrawer}>
              <Settings className={cn(itemClass, "px-4")} />
            </Link>
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
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <Link to="/support" onClick={handleCloseDrawer}>
            <Support className={cn(itemClass, "px-4")} />
          </Link>
          <div className="divider" />
        </div>
        <div className="bg-white dark:bg-gray-900">
          <div className="divider" />
          <div className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <Logout
              className={cn(itemClass, "px-4 py-3")}
              onClick={handleCloseDrawer}
            />
          </div>
          <div className="divider" />
        </div>
      </div>
    </div>
  );
};

export default MobileDrawerMenu;
