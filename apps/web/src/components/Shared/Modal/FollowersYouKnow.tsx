import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@/components/Shared/SingleAccount";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type FollowersYouKnowRequest,
  useFollowersYouKnowQuery
} from "@hey/indexer";
import { Virtuoso } from "react-virtuoso";

interface FollowersYouKnowProps {
  username: string;
  address: string;
}

const FollowersYouKnow = ({ username, address }: FollowersYouKnowProps) => {
  const { currentAccount } = useAccountStore();

  const request: FollowersYouKnowRequest = {
    observer: currentAccount?.address,
    target: address
  };

  const { data, error, fetchMore, loading } = useFollowersYouKnowQuery({
    skip: !address,
    variables: { request }
  });

  const followersYouKnow = data?.followersYouKnow?.items;
  const pageInfo = data?.followersYouKnow?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <AccountListShimmer />;
  }

  if (!followersYouKnow?.length) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">{username}</span>
            <span>doesn't have any mutual followers.</span>
          </div>
        }
        hideCard
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load mutual followers"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-account-list"
      data={followersYouKnow}
      endReached={onEndReached}
      itemContent={(_, follower) => (
        <div className="p-5">
          <SingleAccount
            hideFollowButton={
              currentAccount?.address === follower.follower.address
            }
            hideUnfollowButton={
              currentAccount?.address === follower.follower.address
            }
            account={follower.follower}
            showBio
            showUserPreview={false}
          />
        </div>
      )}
    />
  );
};

export default FollowersYouKnow;
