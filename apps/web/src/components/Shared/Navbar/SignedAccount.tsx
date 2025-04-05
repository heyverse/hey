import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import hasAccess from "@/helpers/hasAccess";
import { useMobileDrawerModalStore } from "@/store/non-persisted/modal/useMobileDrawerModalStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Features } from "@hey/data/features";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import MenuTransition from "../MenuTransition";
import Slug from "../Slug";
import { NextLink } from "./MenuItems";
import MobileDrawerMenu from "./MobileDrawerMenu";
import Logout from "./NavItems/Logout";
import Settings from "./NavItems/Settings";
import StaffTools from "./NavItems/StaffTools";
import SwitchAccount from "./NavItems/SwitchAccount";
import ThemeSwitch from "./NavItems/ThemeSwitch";
import YourAccount from "./NavItems/YourAccount";

const SignedAccount = () => {
  const { currentAccount } = useAccountStore();
  const { setShowMobileDrawer, showMobileDrawer } = useMobileDrawerModalStore();
  const isStaff = hasAccess(Features.Staff);

  const Avatar = () => (
    <Image
      alt={currentAccount?.address}
      className="size-8 cursor-pointer rounded-full border border-neutral-200 dark:border-neutral-700"
      src={getAvatar(currentAccount)}
    />
  );

  const handleOpenMobileMenuDrawer = () => {
    setShowMobileDrawer(true);
  };

  return (
    <>
      {showMobileDrawer ? <MobileDrawerMenu /> : null}
      <button
        className="focus:outline-hidden md:hidden"
        onClick={handleOpenMobileMenuDrawer}
        type="button"
      >
        <Avatar />
      </button>
      <Menu as="div" className="hidden md:block">
        <MenuButton className="flex self-center rounded-full">
          <Avatar />
        </MenuButton>
        <MenuTransition>
          <MenuItems
            className="absolute left-0 mt-2 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-xs focus:outline-hidden dark:border-neutral-700 dark:bg-black"
            static
          >
            <MenuItem
              as={NextLink}
              className="m-2 flex items-center rounded-lg px-4 py-2 text-neutral-700 text-sm hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
              to={getAccount(currentAccount).link}
            >
              <div className="flex w-full flex-col">
                <div>Logged in as</div>
                <div className="truncate">
                  <Slug
                    className="font-bold"
                    slug={getAccount(currentAccount).usernameWithPrefix}
                  />
                </div>
              </div>
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as="div"
              className={({ focus }: { focus: boolean }) =>
                cn(
                  { "dropdown-active": focus },
                  "m-2 rounded-lg border border-neutral-200 dark:border-neutral-700"
                )
              }
            >
              <SwitchAccount />
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as={NextLink}
              className={({ focus }: { focus: boolean }) =>
                cn({ "dropdown-active": focus }, "menu-item")
              }
              to={getAccount(currentAccount).link}
            >
              <YourAccount />
            </MenuItem>
            <MenuItem
              as={NextLink}
              className={({ focus }: { focus: boolean }) =>
                cn({ "dropdown-active": focus }, "menu-item")
              }
              to="/settings"
            >
              <Settings />
            </MenuItem>
            {isStaff ? (
              <MenuItem
                as={NextLink}
                className={({ focus }: { focus: boolean }) =>
                  cn({ "dropdown-active": focus }, "menu-item")
                }
                to="/staff"
              >
                <StaffTools />
              </MenuItem>
            ) : null}
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ "dropdown-active": focus }, "m-2 rounded-lg")
              }
            >
              <Logout />
            </MenuItem>
            <div className="divider" />
            <MenuItem
              as="div"
              className={({ focus }) =>
                cn({ "dropdown-active": focus }, "m-2 rounded-lg")
              }
            >
              <ThemeSwitch />
            </MenuItem>
          </MenuItems>
        </MenuTransition>
      </Menu>
    </>
  );
};

export default SignedAccount;
