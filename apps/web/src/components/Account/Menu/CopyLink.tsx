import { MenuItem } from "@headlessui/react";
import { LinkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import type { AccountFragment } from "@hey/indexer";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

interface CopyLinkProps {
  account: AccountFragment;
}

const CopyLink = ({ account }: CopyLinkProps) => {
  const copyLink = useCopyToClipboard(
    `${location.origin}${getAccount(account).link}`,
    "Link copied to clipboard!"
  );
  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        copyLink();
      }}
    >
      <LinkIcon className="size-4" />
      <div>Copy link</div>
    </MenuItem>
  );
};

export default CopyLink;
