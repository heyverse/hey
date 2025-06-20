import { Spinner } from "@/components/Shared/UI";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  type AccountFragment,
  useMlDismissRecommendedAccountsMutation
} from "@hey/indexer";

interface DismissRecommendedAccountProps {
  account: AccountFragment;
}

const DismissRecommendedAccount = ({
  account
}: DismissRecommendedAccountProps) => {
  const [dismissRecommendedAccount, { loading }] =
    useMlDismissRecommendedAccountsMutation({
      update: (cache) => cache.evict({ id: cache.identify(account) }),
      variables: { request: { accounts: [account.address] } }
    });

  const handleDismiss = async () => {
    await dismissRecommendedAccount();
  };

  return (
    <button onClick={handleDismiss} type="reset" disabled={loading}>
      {loading ? (
        <Spinner size="xs" />
      ) : (
        <XMarkIcon className="size-4 text-gray-500" />
      )}
    </button>
  );
};

export default DismissRecommendedAccount;
