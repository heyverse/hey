import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type { AccountFragment } from "@hey/indexer";
import { memo } from "react";
import Slug from "../Slug";
import AccountLink from "./AccountLink";

interface SmallSingleAccountProps {
  hideSlug?: boolean;
  linkToAccount?: boolean;
  account: AccountFragment;
  smallAvatar?: boolean;
  timestamp?: Date;
}

const SmallSingleAccount = ({
  hideSlug = false,
  linkToAccount = false,
  account,
  smallAvatar = false,
  timestamp
}: SmallSingleAccountProps) => {
  const UserAvatar = () => (
    <Image
      alt={account.address}
      className={cn(
        smallAvatar ? "size-4" : "size-6",
        "rounded-full border border-gray-200 bg-gray-200 dark:border-gray-700"
      )}
      height={smallAvatar ? 16 : 24}
      loading="lazy"
      src={getAvatar(account)}
      width={smallAvatar ? 16 : 24}
    />
  );

  const UserName = () => (
    <div className="flex max-w-full flex-wrap items-center">
      <div className={cn(!hideSlug && "max-w-[75%]", "mr-1 truncate")}>
        {getAccount(account).name}
      </div>
      {!hideSlug && (
        <Slug
          className="text-sm"
          slug={getAccount(account).usernameWithPrefix}
        />
      )}
      {timestamp && (
        <span className="text-gray-500 dark:text-gray-200">
          <span className="mx-1.5">·</span>
          <span className="text-xs">{formatRelativeOrAbsolute(timestamp)}</span>
        </span>
      )}
    </div>
  );

  const AccountInfo = () => (
    <div className="flex items-center space-x-2">
      <UserAvatar />
      <UserName />
    </div>
  );

  return linkToAccount ? (
    <AccountLink account={account}>
      <AccountInfo />
    </AccountLink>
  ) : (
    <AccountInfo />
  );
};

export default memo(SmallSingleAccount);
