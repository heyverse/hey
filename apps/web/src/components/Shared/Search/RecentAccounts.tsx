import { XMarkIcon } from "@heroicons/react/24/outline";
import getAccount from "@hey/helpers/getAccount";
import { useAccountsBulkQuery } from "@hey/indexer";
import { useNavigate } from "react-router";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import Loader from "@/components/Shared/Loader";
import { H6 } from "@/components/Shared/UI";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useAccountLinkStore } from "@/store/non-persisted/navigation/useAccountLinkStore";
import { useSearchStore } from "@/store/persisted/useSearchStore";

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
  const { setCachedAccount } = useAccountLinkStore();

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
              <H6 className="text-gray-500 dark:text-gray-200">Clear all</H6>
            </button>
          </div>
          {accounts.map((account) => (
            <div
              className="flex cursor-pointer items-center space-x-3 truncate px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              key={account.address}
              onClick={() => {
                setCachedAccount(account);
                addAccount(account.address);
                navigate(getAccount(account).link);
                onAccountClick();
              }}
            >
              <div className="w-full">
                <SingleAccount
                  account={account}
                  hideFollowButton
                  hideUnfollowButton
                  linkToAccount={false}
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
                <XMarkIcon className="size-4 text-gray-500" />
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
