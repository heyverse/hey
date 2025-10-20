import { MenuItem } from "@headlessui/react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import type { AccountFragment } from "@hey/indexer";
import { type MouseEvent, useCallback } from "react";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useBlockAlertStore } from "@/store/non-persisted/alert/useBlockAlertStore";

const menuItemClassName = ({ focus }: { focus: boolean }) =>
  cn(
    { "dropdown-active": focus },
    "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
  );

interface BlockProps {
  account: AccountFragment;
}

const Block = ({ account }: BlockProps) => {
  const { setShowBlockOrUnblockAlert } = useBlockAlertStore();
  const isBlockedByMe = account.operations?.isBlockedByMe;

  const handleClick = useCallback(
    (event: MouseEvent) => {
      stopEventPropagation(event);
      setShowBlockOrUnblockAlert(true, account);
    },
    [account, setShowBlockOrUnblockAlert]
  );

  return (
    <MenuItem as="div" className={menuItemClassName} onClick={handleClick}>
      <NoSymbolIcon className="size-4" />
      <div>
        {isBlockedByMe ? "Unblock" : "Block"} {getAccount(account).username}
      </div>
    </MenuItem>
  );
};

export default Block;
