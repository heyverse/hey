import SingleAccount from "@/components/Shared/Account/SingleAccount";
import type { AccountFragment } from "@hey/indexer";
import AccountOverview from "./AccountOverview";
import ManagedAccounts from "./ManagedAccounts";

interface AccountStaffToolProps {
  account: AccountFragment;
}

const AccountStaffTool = ({ account }: AccountStaffToolProps) => {
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
      <ManagedAccounts address={account.owner} />
    </div>
  );
};

export default AccountStaffTool;
