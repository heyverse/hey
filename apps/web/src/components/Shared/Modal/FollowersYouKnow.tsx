import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type FollowersYouKnowRequest,
  useFollowersYouKnowQuery
} from "@hey/indexer";
import { motion } from "motion/react";
import { Virtualizer } from "virtua";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";

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

  const handleEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

  if (loading) {
    return <AccountListShimmer />;
  }

  if (!followersYouKnow?.length) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">{username}</span>
            <span>doesn't have any mutual followers.</span>
          </div>
        }
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
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {followersYouKnow.map((follower, index) => (
          <motion.div
            animate="visible"
            className={cn(
              "divider p-5",
              index === followersYouKnow.length - 1 && "border-b-0"
            )}
            initial="hidden"
            key={follower.follower.address}
            variants={accountsList}
          >
            <SingleAccount
              account={follower.follower}
              hideFollowButton={
                currentAccount?.address === follower.follower.address
              }
              hideUnfollowButton={
                currentAccount?.address === follower.follower.address
              }
              showBio
              showUserPreview={false}
            />
          </motion.div>
        ))}
        {hasMore && <span ref={loadMoreRef} />}
      </Virtualizer>
    </div>
  );
};

export default FollowersYouKnow;
