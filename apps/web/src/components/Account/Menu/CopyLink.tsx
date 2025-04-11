import cn from "@/helpers/cn";
import { MenuItem } from "@headlessui/react";
import { LinkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AccountFragment } from "@hey/indexer";
import { toast } from "sonner";

interface CopyLinkProps {
  account: AccountFragment;
}

const CopyLink = ({ account }: CopyLinkProps) => {
  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={async (event) => {
        stopEventPropagation(event);
        await navigator.clipboard.writeText(
          `${location.origin}${getAccount(account).link}`
        );
        toast.success("Link copied to clipboard!");
      }}
    >
      <LinkIcon className="size-4" />
      <div>Copy link</div>
    </MenuItem>
  );
};

export default CopyLink;
