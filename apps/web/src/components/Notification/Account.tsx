import AccountPreview from "@/components/Shared/AccountPreview";
import { Image } from "@/components/Shared/UI";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AccountFragment } from "@hey/indexer";
import { Link } from "react-router";

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
      <Link
        className="rounded-full outline-offset-2"
        to={getAccount(account).link}
        onClick={stopEventPropagation}
      >
        <Image
          alt={account.address}
          className="size-7 rounded-full border border-gray-200 bg-gray-200 sm:size-8 dark:border-gray-700"
          height={32}
          src={getAvatar(account)}
          width={32}
        />
      </Link>
    </AccountPreview>
  );
};

export const NotificationAccountName = ({
  account
}: NotificationProfileProps) => {
  const profileLink = getAccount(account).link;

  return (
    <AccountPreview
      username={account.username?.localName}
      address={account.address}
    >
      <Link
        className="font-bold outline-hidden hover:underline focus:underline"
        to={profileLink}
        onClick={stopEventPropagation}
      >
        {getAccount(account).name}
      </Link>
    </AccountPreview>
  );
};
