import Suggested from "@/components/Home/Suggested";
import DismissRecommendedAccount from "@/components/Shared/Account/DismissRecommendedAccount";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import SingleAccountShimmer from "@/components/Shared/Shimmer/SingleAccountShimmer";
import Skeleton from "@/components/Shared/Skeleton";
import { Card, ErrorMessage, H5, Modal } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  type AccountFragment,
  PageSize,
  useAccountRecommendationsQuery
} from "@hey/indexer";
import { useState } from "react";

const Title = () => <H5>Who to Follow</H5>;

const WhoToFollow = () => {
  const { currentAccount } = useAccountStore();
  const [showMore, setShowMore] = useState(false);

  const { data, error, loading } = useAccountRecommendationsQuery({
    variables: {
      request: {
        pageSize: PageSize.Fifty,
        account: currentAccount?.address,
        shuffle: true
      }
    }
  });

  if (loading) {
    return (
      <Card className="space-y-4 p-5">
        <Title />
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex items-center gap-x-3" key={index}>
            <div className="w-full">
              <SingleAccountShimmer showFollowUnfollowButton />
            </div>
            <XMarkIcon className="size-4 text-gray-500" />
          </div>
        ))}
        <div className="pt-2 pb-1">
          <Skeleton className="h-3 w-5/12 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!data?.mlAccountRecommendations.items.length) {
    return null;
  }

  const recommendedAccounts = data?.mlAccountRecommendations.items.filter(
    (account) =>
      !account.operations?.isBlockedByMe &&
      !account.operations?.isFollowedByMe &&
      !account.operations?.hasBlockedMe
  ) as AccountFragment[];

  if (!recommendedAccounts?.length) {
    return null;
  }

  return (
    <>
      <Card className="space-y-4 p-5">
        <Title />
        <ErrorMessage error={error} title="Failed to load recommendations" />
        {recommendedAccounts?.slice(0, 5).map((account) => (
          <div
            className="flex items-center gap-x-3 truncate"
            key={account?.address}
          >
            <div className="w-full">
              <SingleAccount
                hideFollowButton={currentAccount?.address === account.address}
                hideUnfollowButton={currentAccount?.address === account.address}
                account={account}
              />
            </div>
            <DismissRecommendedAccount account={account} />
          </div>
        ))}
        {recommendedAccounts.length > 5 && (
          <button
            className="font-bold text-gray-500 dark:text-gray-200"
            onClick={() => setShowMore(true)}
            type="button"
          >
            Show more
          </button>
        )}
      </Card>
      <Modal
        onClose={() => setShowMore(false)}
        show={showMore}
        title="Suggested for you"
      >
        <Suggested accounts={recommendedAccounts} />
      </Modal>
    </>
  );
};

export default WhoToFollow;
