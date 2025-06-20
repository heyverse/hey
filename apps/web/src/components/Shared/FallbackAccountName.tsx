import AccountLink from "@/components/Shared/Account/AccountLink";
import cn from "@/helpers/cn";
import getAccount from "@hey/helpers/getAccount";
import type { AccountFragment } from "@hey/indexer";
import type { ReactNode } from "react";
import Slug from "./Slug";

interface FallbackAccountNameProps {
  className?: string;
  account?: AccountFragment;
  separator?: ReactNode;
}

const FallbackAccountName = ({
  className = "",
  account,
  separator = ""
}: FallbackAccountNameProps) => {
  if (!account) {
    return null;
  }

  const { name, usernameWithPrefix } = getAccount(account);
  const accountName = account?.metadata?.name || (
    <Slug slug={usernameWithPrefix} />
  );

  return (
    <>
      <AccountLink
        aria-label={`Account of ${name || usernameWithPrefix}`}
        className={cn(
          "max-w-sm truncate outline-hidden hover:underline focus:underline",
          className
        )}
        account={account}
      >
        <b className="whitespace-nowrap">{accountName}</b>
      </AccountLink>
      {separator && <span>{separator}</span>}
    </>
  );
};

export default FallbackAccountName;
