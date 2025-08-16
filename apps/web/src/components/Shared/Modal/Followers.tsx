import { UsersIcon } from "@heroicons/react/24/outline";
import type { FollowersRequest } from "@hey/indexer";
import { PageSize, useFollowersQuery } from "@hey/indexer";
import { motion } from "motion/react";
import { useCallback } from "react";
import { Virtualizer } from "virtua";
import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";

interface FollowersProps {
  username: string;
  address: string;
}

const Followers = ({ username, address }: FollowersProps) => {
  const { currentAccount } = useAccountStore();

  const request: FollowersRequest = {
    account: address,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useFollowersQuery({
    skip: !address,
    variables: { request }
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;
  const hasMore = pageInfo?.next;

  const handleEndReached = useCallback(async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  }, [fetchMore, hasMore, pageInfo?.next, request]);

  const loadMoreRef = useLoadMoreOnIntersect(handleEndReached);

  if (loading) {
    return <AccountListShimmer />;
  }

  if (!followers?.length) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{username}</span>
            <span>doesn't have any followers yet.</span>
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
        title="Failed to load followers"
      />
    );
  }

  return (
    <div className="!h-[80vh] overflow-y-auto">
      <Virtualizer>
        {followers.map((follower, index) => (
          <motion.div
            animate="visible"
            className={cn(
              "divider p-5",
              index === followers.length - 1 && "border-b-0"
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

export default Followers;
