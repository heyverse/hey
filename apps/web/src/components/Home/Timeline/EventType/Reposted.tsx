import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { RepostFragment } from "@hey/indexer";
import { useMemo } from "react";
import Accounts from "@/components/Shared/Account/Accounts";

interface RepostedProps {
  reposts: RepostFragment[];
}

const Reposted = ({ reposts }: RepostedProps) => {
  const accounts = useMemo(
    () =>
      reposts
        .map((repost) => repost.author)
        .filter(
          (account, index, self) =>
            index === self.findIndex((t) => t.address === account.address)
        ),
    [reposts]
  );

  return (
    <div className="mb-3 flex items-center space-x-1 text-[13px] text-gray-500 dark:text-gray-200">
      <ArrowsRightLeftIcon className="size-4" />
      <Accounts accounts={accounts} context="reposted" />
    </div>
  );
};

export default Reposted;
