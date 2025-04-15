import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";
import { UsersIcon } from "@heroicons/react/24/outline";
import type { FollowingRequest } from "@hey/indexer";
import { PageSize, useFollowingQuery } from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Virtualizer } from "virtua";

interface FollowingProps {
  username: string;
  address: string;
}

const Following = ({ username, address }: FollowingProps) => {
  const { currentAccount } = useAccountStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

  const request: FollowingRequest = {
    pageSize: PageSize.Fifty,
    account: address
  };

  const { data, error, fetchMore, loading } = useFollowingQuery({
    skip: !address,
    variables: { request }
  });

  const followings = data?.following?.items;
  const pageInfo = data?.following?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  useEffect(() => {
    if (entry?.isIntersecting) {
      onEndReached();
    }
  }, [entry?.isIntersecting]);

  if (loading) {
    return <AccountListShimmer />;
  }

  if (!followings?.length) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">@{username}</span>
            <span>doesn't follow anyone.</span>
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
        title="Failed to load following"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {followings.map((following, index) => (
          <motion.div
            key={following.following.address}
            className={cn(
              "divider p-5",
              index === followings.length - 1 && "border-b-0"
            )}
            variants={accountsList}
            initial="hidden"
            animate="visible"
          >
            <SingleAccount
              hideFollowButton={
                currentAccount?.address === following.following.address
              }
              hideUnfollowButton={
                currentAccount?.address === following.following.address
              }
              account={following.following}
              showBio
              showUserPreview={false}
            />
          </motion.div>
        ))}
        {hasMore && <span ref={ref} />}
      </Virtualizer>
    </div>
  );
};

export default Following;
