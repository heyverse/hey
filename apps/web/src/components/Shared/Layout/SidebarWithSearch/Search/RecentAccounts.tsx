import Loader from "@/components/Shared/Loader";
import SingleAccount from "@/components/Shared/SingleAccount";
import { H6 } from "@/components/Shared/UI";
import { useSearchStore } from "@/store/persisted/useSearchStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { useAccountsBulkQuery } from "@hey/indexer";
import { useNavigate } from "react-router";

interface RecentAccountsProps {
  onAccountClick: () => void;
}

const RecentAccounts = ({ onAccountClick }: RecentAccountsProps) => {
  const navigate = useNavigate();
  const {
    addAccount,
    clearAccount,
    clearAccounts,
    accounts: recentAccounts
  } = useSearchStore();

  const { data, loading } = useAccountsBulkQuery({
    skip: !recentAccounts.length,
    variables: { request: { addresses: recentAccounts } }
  });

  if (!recentAccounts.length) {
    return null;
  }

  const accounts = data?.accountsBulk || [];

  return (
    <div>
      {loading ? (
        <Loader className="my-3" message="Loading recent accounts" small />
      ) : (
        <div>
          <div className="flex items-center justify-between px-4 pt-1 pb-2">
            <b>Recent</b>
            <button onClick={clearAccounts} type="button">
              <H6 className="text-neutral-500 dark:text-neutral-200">
                Clear all
              </H6>
            </button>
          </div>
          {accounts.map((account) => (
            <div
              className="flex cursor-pointer items-center space-x-3 truncate px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              key={account.address}
              onClick={() => {
                addAccount(account.address);
                navigate(getAccount(account).link);
                onAccountClick();
              }}
            >
              <div className="w-full">
                <SingleAccount
                  hideFollowButton
                  hideUnfollowButton
                  linkToAccount={false}
                  account={account}
                  showUserPreview={false}
                />
              </div>
              <button
                onClick={(event) => {
                  stopEventPropagation(event);
                  clearAccount(account.address);
                }}
                type="reset"
              >
                <XMarkIcon className="size-4 text-neutral-500" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="divider my-2" />
    </div>
  );
};

export default RecentAccounts;
