import MenuTransition from "@/components/Shared/MenuTransition";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AccountFragment } from "@hey/indexer";
import { Fragment } from "react";
import Block from "./Block";
import CopyLink from "./CopyLink";
import Mute from "./Mute";
import Report from "./Report";

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
          <EllipsisVerticalIcon className="ld-text-gray-500 size-5" />
        </button>
      </MenuButton>
      <MenuTransition>
        <MenuItems
          className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          <CopyLink account={account} />
          {currentAccount && currentAccount?.address !== account.address ? (
            <>
              <Block account={account} />
              <Mute account={account} />
              <Report account={account} />
            </>
          ) : null}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default AccountMenu;
