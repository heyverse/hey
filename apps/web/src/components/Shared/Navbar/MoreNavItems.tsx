import { H6 } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
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
                "bg-gray-200 text-black dark:bg-gray-800 dark:text-white": open,
                "text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white":
                  !open
              }
            )}
          >
            <H6>More</H6>
          </MenuButton>
          <MenuTransition>
            <MenuItems
              className="absolute mt-2 rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
              static
            >
              {currentAccount ? (
                <>
                  <MenuItem
                    as="div"
                    className={({ focus }: { focus: boolean }) =>
                      cn({ "dropdown-active": focus }, "m-2 rounded-lg")
                    }
                  >
                    <Groups />
                  </MenuItem>
                  <MenuItem
                    as="div"
                    className={({ focus }: { focus: boolean }) =>
                      cn({ "dropdown-active": focus }, "m-2 rounded-lg")
                    }
                  >
                    <Bookmarks />
                  </MenuItem>
                  <div className="divider" />
                </>
              ) : null}
              <MenuItem
                as="div"
                className={({ focus }: { focus: boolean }) =>
                  cn({ "dropdown-active": focus }, "m-2 rounded-lg")
                }
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
