import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type { AccountFragment } from "@hey/indexer";
import { TipIcon } from "../Icons/TipIcon";
import MenuTransition from "../MenuTransition";
import TipMenu from "../TipMenu";
import { Button, Tooltip } from "../UI";

interface TipButtonProps {
  account: AccountFragment;
}

const TipButton = ({ account }: TipButtonProps) => {
  const { currentAccount } = useAccountStore();

  if (currentAccount?.address === account.address) {
    return null;
  }

  return (
    <>
      <Menu as="div" className="relative">
        <MenuButton
          aria-label="Tip"
          as={Button}
          outline
          onClick={stopEventPropagation}
        >
          <Tooltip content="Tip" placement="top" withDelay>
            <TipIcon className="-mx-2 my-1 size-4 text-gray-500" />
          </Tooltip>
        </MenuButton>
        <MenuTransition>
          <MenuItems
            className="z-[5] mt-2 w-max origin-top-right rounded-xl border border-gray-200 bg-white shadow-xs focus:outline-hidden dark:border-gray-700 dark:bg-gray-900"
            anchor="bottom end"
            static
          >
            <MenuItem>
              {({ close }) => (
                <TipMenu closePopover={close} account={account} />
              )}
            </MenuItem>
          </MenuItems>
        </MenuTransition>
      </Menu>
    </>
  );
};

export default TipButton;
