import MenuTransition from "@/components/Shared/MenuTransition";
import cn from "@/helpers/cn";
import { usePostRulesStore } from "@/store/non-persisted/post/usePostRulesStore";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GlobeAmericasIcon, UsersIcon } from "@heroicons/react/24/solid";

const RulesSettings = () => {
  const { rules, setRules } = usePostRulesStore();

  const options = [
    {
      label: "Everyone can reply",
      value: "everyone",
      icon: <GlobeAmericasIcon className="size-4" />,
      checked: rules === undefined,
      onClick: () => setRules(undefined)
    },
    {
      label: "Only followers can reply",
      value: "followers",
      icon: <UsersIcon className="size-4" />,
      checked: rules?.repliesRestricted,
      onClick: () => setRules({ repliesRestricted: true })
    }
  ];

  return (
    <Menu as="div" className="relative">
      <MenuButton className="mb-2 ml-5 flex items-center gap-1 text-sm">
        {options.find((option) => option.checked)?.icon}
        <div className="font-semibold">
          {options.find((option) => option.checked)?.label}
        </div>
      </MenuButton>
      <MenuTransition>
        <MenuItems
          className="z-[5] mt-2 w-max origin-top-left rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
          anchor="bottom start"
          static
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              as="div"
              className={({ focus }) =>
                cn(
                  { "dropdown-active": focus },
                  "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
                )
              }
              onClick={option.onClick}
            >
              <div className={cn(option.checked && "text-green-600")}>
                {option.icon}
              </div>
              <div>{option.label}</div>
            </MenuItem>
          ))}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default RulesSettings;
