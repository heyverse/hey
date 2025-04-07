import { H6 } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router";
import MenuTransition from "../MenuTransition";
import Bookmarks from "./NavItems/Bookmarks";
import Groups from "./NavItems/Groups";
import Support from "./NavItems/Support";

const MoreNavItems = () => {
  const { currentAccount } = useAccountStore();

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <MenuButton
            className={cn(
              "w-full cursor-pointer rounded-md px-2 py-1 text-left tracking-wide md:px-3",
              {
                "bg-gray-200 dark:bg-gray-800": open,
                "text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white":
                  !open
              }
            )}
          >
            <H6>More</H6>
          </MenuButton>
          <MenuTransition>
            <MenuItems
              className="absolute mt-2 rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
              static
            >
              {currentAccount ? (
                <>
                  <MenuItem
                    as={Link}
                    className={({ focus }: { focus: boolean }) =>
                      cn({ "dropdown-active": focus }, "menu-item")
                    }
                    to="/groups"
                  >
                    <Groups />
                  </MenuItem>
                  <MenuItem
                    as={Link}
                    className={({ focus }: { focus: boolean }) =>
                      cn({ "dropdown-active": focus }, "menu-item")
                    }
                    to="/bookmarks"
                  >
                    <Bookmarks />
                  </MenuItem>
                  <div className="divider" />
                </>
              ) : null}
              <MenuItem
                as={Link}
                className={({ focus }: { focus: boolean }) =>
                  cn({ "dropdown-active": focus }, "menu-item")
                }
                to="/support"
              >
                <Support />
              </MenuItem>
            </MenuItems>
          </MenuTransition>
        </>
      )}
    </Menu>
  );
};

export default MoreNavItems;
