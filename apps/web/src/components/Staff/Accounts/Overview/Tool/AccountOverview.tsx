import MetaDetails from "@/components/Shared/MetaDetails";
import { H5 } from "@/components/Shared/UI";
import { BanknotesIcon, HashtagIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import formatAddress from "@hey/helpers/formatAddress";
import type { AccountFragment } from "@hey/indexer";

interface AccountOverviewProps {
  account: AccountFragment;
}

const AccountOverview = ({ account }: AccountOverviewProps) => {
  return (
    <>
      <div className="divider my-5 border-yellow-600 border-dashed" />
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="size-5" />
        <H5>Account Overview</H5>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={
            <HashtagIcon className="size-4 text-gray-500 dark:text-gray-200" />
          }
          title="Account ID"
          value={account.address}
        >
          {account.address}
        </MetaDetails>
        <MetaDetails
          icon={
            <BanknotesIcon className="size-4 text-gray-500 dark:text-gray-200" />
          }
          title="Address"
          value={account.owner}
        >
          {formatAddress(account.owner)}
        </MetaDetails>
      </div>
    </>
  );
};

export default AccountOverview;
