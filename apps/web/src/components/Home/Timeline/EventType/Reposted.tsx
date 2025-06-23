import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { RepostFragment } from "@hey/indexer";
import Accounts from "@/components/Shared/Account/Accounts";

interface RepostedProps {
  reposts: RepostFragment[];
}

const Reposted = ({ reposts }: RepostedProps) => {
  const getRepostedAccounts = () => {
    let accounts = reposts.map((repost) => repost.author);
    accounts = accounts.filter(
      (account, index, self) =>
        index === self.findIndex((t) => t.address === account.address)
    );
    return accounts;
  };

  return (
    <div className="mb-3 flex items-center space-x-1 text-[13px] text-gray-500 dark:text-gray-200">
      <ArrowsRightLeftIcon className="size-4" />
      <Accounts accounts={getRepostedAccounts()} context="reposted" />
    </div>
  );
};

export default Reposted;
