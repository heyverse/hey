import { UsersIcon } from "@heroicons/react/24/outline";
import type { FollowingRequest } from "@hey/indexer";
import { PageSize, useFollowingQuery } from "@hey/indexer";
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

interface FollowingProps {
  username: string;
  address: string;
}

const Following = ({ username, address }: FollowingProps) => {
  const { currentAccount } = useAccountStore();

  const request: FollowingRequest = {
    account: address,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useFollowingQuery({
    skip: !address,
    variables: { request }
  });

  const followings = data?.following?.items;
  const pageInfo = data?.following?.pageInfo;
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

  if (!followings?.length) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{username}</span>
            <span>doesn't follow anyone.</span>
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
        title="Failed to load following"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {followings.map((following, index) => (
          <motion.div
            animate="visible"
            className={cn(
              "divider p-5",
              index === followings.length - 1 && "border-b-0"
            )}
            initial="hidden"
            key={following.following.address}
            variants={accountsList}
          >
            <SingleAccount
              account={following.following}
              hideFollowButton={
                currentAccount?.address === following.following.address
              }
              hideUnfollowButton={
                currentAccount?.address === following.following.address
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

export default Following;
