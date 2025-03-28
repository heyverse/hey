import SingleAccount from "@/components/Shared/SingleAccount";
import { trpc } from "@/helpers/trpc";
import type { AccountFragment } from "@hey/indexer";
import { useQuery } from "@tanstack/react-query";
import AccountOverview from "./AccountOverview";
import AccountPreferences from "./AccountPreferences";
import ManagedAccounts from "./ManagedAccounts";
import Permissions from "./Permissions";

interface AccountStaffToolProps {
  account: AccountFragment;
}

const AccountStaffTool = ({ account }: AccountStaffToolProps) => {
  const { data: preferences } = useQuery(
    trpc.internal.account.queryOptions({ address: account.address })
  );

  return (
    <div>
      <SingleAccount
        hideFollowButton
        hideUnfollowButton
        isBig
        linkToAccount
        account={account}
        showBio
        showUserPreview={false}
      />
      <AccountOverview account={account} />
      {preferences ? <AccountPreferences preferences={preferences} /> : null}
      {preferences ? (
        <>
          <Permissions
            permissions={preferences.permissions || []}
            accountAddress={account.address}
          />
          <div className="divider my-5 border-yellow-600 border-dashed" />
        </>
      ) : null}
      <ManagedAccounts address={account.owner} />
    </div>
  );
};

export default AccountStaffTool;
