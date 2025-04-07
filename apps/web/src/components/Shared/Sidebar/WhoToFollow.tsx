import DismissRecommendedAccount from "@/components/Shared/DismissRecommendedAccount";
import SingleAccountShimmer from "@/components/Shared/Shimmer/SingleAccountShimmer";
import SingleAccount from "@/components/Shared/SingleAccount";
import { Card, ErrorMessage, H5, Modal } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {
  type AccountFragment,
  PageSize,
  useAccountRecommendationsQuery
} from "@hey/indexer";
import { useState } from "react";
import Suggested from "../../Home/Suggested";

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
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <div className="pt-2 pb-1">
          <div className="shimmer h-3 w-5/12 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!data?.mlAccountRecommendations.items.length) {
    return null;
  }

  const recommendedAccounts = data?.mlAccountRecommendations.items.filter(
    (account) =>
      !account.operations?.isBlockedByMe && !account.operations?.isFollowedByMe
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
            className="flex items-center space-x-3 truncate"
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
        <button
          className="font-bold text-neutral-500 dark:text-neutral-200"
          onClick={() => setShowMore(true)}
          type="button"
        >
          Show more
        </button>
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
