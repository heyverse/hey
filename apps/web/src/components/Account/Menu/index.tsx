import MenuTransition from "@/components/Shared/MenuTransition";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import type { AccountFragment } from "@hey/indexer";
import { Fragment } from "react";
import Block from "./Block";
import CopyLink from "./CopyLink";
import Mute from "./Mute";
import Report from "./Report";
import StaffTool from "./StaffTool";

interface AccountMenuProps {
  account: AccountFragment;
}

const AccountMenu = ({ account }: AccountMenuProps) => {
  const { currentAccount } = useAccountStore();

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Fragment}>
        <button
          aria-label="More"
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisVerticalIcon className="size-5 text-gray-500 dark:text-gray-200" />
        </button>
      </MenuButton>
      <MenuTransition>
        <MenuItems
          className="mt-2 w-48 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
          anchor="bottom end"
        >
          <CopyLink account={account} />
          {currentAccount && currentAccount?.address !== account.address ? (
            <>
              <Block account={account} />
              <Mute account={account} />
              <Report account={account} />
            </>
          ) : null}
          {currentAccount?.isStaff ? <StaffTool account={account} /> : null}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default AccountMenu;
