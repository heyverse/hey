import MenuTransition from "@/components/Shared/MenuTransition";
import { Card } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import type { SidebarProps } from ".";

const SidebarMenu = ({ items }: SidebarProps) => {
  const { pathname } = useLocation();
  const menuItems = items.filter((item) => item?.enabled !== false);
  const [selectedItem, setSelectedItem] = useState(
    menuItems.find((item) => item.url === pathname) || menuItems[0]
  );

  return (
    <div className="mb-4 space-y-2">
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            <MenuButton
              className={cn(
                "flex w-full items-center space-x-2 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-left outline-hidden focus:border-neutral-500 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800",
                {
                  "bg-neutral-200 dark:bg-neutral-800": open,
                  "text-neutral-700 hover:bg-neutral-200 hover:text-black dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white":
                    !open
                }
              )}
            >
              {selectedItem.icon}
              <div>{selectedItem.title}</div>
            </MenuButton>
            <MenuTransition>
              <MenuItems className="absolute z-10 mt-2 w-full" static>
                <Card forceRounded>
                  {menuItems.map((item) => (
                    <MenuItem
                      as={Link}
                      className={({ focus }: { focus: boolean }) =>
                        cn(
                          {
                            "dropdown-active": focus || selectedItem === item
                          },
                          "m-2 flex items-center space-x-2 rounded-lg p-2"
                        )
                      }
                      to={item.url}
                      key={item.url}
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.icon}
                      <div>{item.title}</div>
                    </MenuItem>
                  ))}
                </Card>
              </MenuItems>
            </MenuTransition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default SidebarMenu;
