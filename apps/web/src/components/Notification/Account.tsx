import AccountPreview from "@/components/Shared/Account/AccountPreview";
import { Image } from "@/components/Shared/UI";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AccountFragment } from "@hey/indexer";
import AccountLink from "../Shared/Account/AccountLink";

interface NotificationProfileProps {
  account: AccountFragment;
}

export const NotificationAccountAvatar = ({
  account
}: NotificationProfileProps) => {
  return (
    <AccountPreview
      username={account.username?.localName}
      address={account.address}
    >
      <AccountLink
        className="rounded-full outline-offset-2"
        account={account}
        onClick={stopEventPropagation}
      >
        <Image
          alt={account.address}
          className="size-7 rounded-full border border-gray-200 bg-gray-200 sm:size-8 dark:border-gray-700"
          height={32}
          src={getAvatar(account)}
          width={32}
        />
      </AccountLink>
    </AccountPreview>
  );
};

export const NotificationAccountName = ({
  account
}: NotificationProfileProps) => {
  return (
    <AccountPreview
      username={account.username?.localName}
      address={account.address}
    >
      <AccountLink
        className="font-bold outline-hidden hover:underline focus:underline"
        account={account}
        onClick={stopEventPropagation}
      >
        {getAccount(account).name}
      </AccountLink>
    </AccountPreview>
  );
};
