import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { AccountFragment } from "@hey/indexer";
import Accounts from "@/components/Shared/Account/Accounts";

interface RepostedProps {
  account: AccountFragment;
}

const Reposted = ({ account }: RepostedProps) => {
  return (
    <div className="mb-3 flex items-center space-x-1 text-[13px] text-gray-500 dark:text-gray-200">
      <ArrowsRightLeftIcon className="size-4" />
      <Accounts accounts={[account]} context="reposted" />
    </div>
  );
};

export default Reposted;
