import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import getAvatar from "@hey/helpers/getAvatar";
import type { AccountFragment } from "@hey/indexer";
import { Link } from "react-router";
import AccountLink from "@/components/Shared/Account/AccountLink";
import MenuTransition from "@/components/Shared/MenuTransition";
import Logout from "@/components/Shared/Navbar/NavItems/Logout";
import Rewards from "@/components/Shared/Navbar/NavItems/Rewards";
import Settings from "@/components/Shared/Navbar/NavItems/Settings";
import SwitchAccount from "@/components/Shared/Navbar/NavItems/SwitchAccount";
import ThemeSwitch from "@/components/Shared/Navbar/NavItems/ThemeSwitch";
import YourAccount from "@/components/Shared/Navbar/NavItems/YourAccount";
import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const SignedAccount = () => {
  const { currentAccount } = useAccountStore();

  const Avatar = () => (
    <Image
      alt={currentAccount?.address}
      className="size-8 cursor-pointer rounded-full border border-gray-200 dark:border-gray-700"
      src={getAvatar(currentAccount)}
    />
  );

  return (
    <Menu as="div">
      <MenuButton>
        <Avatar />
      </MenuButton>
      <MenuTransition>
        <MenuItems
          anchor="bottom start"
          className="z-[5] mt-2 w-48 origin-top-left rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-hidden dark:border-gray-700 dark:bg-black"
          static
        >
          <MenuItem
            account={currentAccount as AccountFragment}
            as={AccountLink}
            className={({ focus }: { focus: boolean }) =>
              cn({ "dropdown-active": focus }, "menu-item")
            }
          >
            <YourAccount />
          </MenuItem>
          <MenuItem
            as={Link}
            className={({ focus }: { focus: boolean }) =>
              cn({ "dropdown-active": focus }, "menu-item")
            }
            to="/settings/rewards"
          >
            <Rewards />
          </MenuItem>
          <MenuItem
            as={Link}
            className={({ focus }: { focus: boolean }) =>
              cn({ "dropdown-active": focus }, "menu-item")
            }
            to="/settings"
          >
            <Settings />
          </MenuItem>
          <div className="divider" />
          <MenuItem
            as="div"
            className={({ focus }) =>
              cn({ "dropdown-active": focus }, "m-2 rounded-lg")
            }
          >
            <SwitchAccount />
          </MenuItem>
          <MenuItem
            as="div"
            className={({ focus }) =>
              cn({ "dropdown-active": focus }, "m-2 rounded-lg")
            }
          >
            <ThemeSwitch />
          </MenuItem>
          <div className="divider" />
          <MenuItem
            as="div"
            className={({ focus }) =>
              cn({ "dropdown-active": focus }, "m-2 rounded-lg")
            }
          >
            <Logout />
          </MenuItem>
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default SignedAccount;
