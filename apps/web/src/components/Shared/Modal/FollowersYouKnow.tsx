import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";
import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type FollowersYouKnowRequest,
  useFollowersYouKnowQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Virtualizer } from "virtua";

interface FollowersYouKnowProps {
  username: string;
  address: string;
}

const FollowersYouKnow = ({ username, address }: FollowersYouKnowProps) => {
  const { currentAccount } = useAccountStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

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

  useEffect(() => {
    if (entry?.isIntersecting) {
      onEndReached();
    }
  }, [entry?.isIntersecting]);

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
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {followersYouKnow.map((follower, index) => (
          <motion.div
            key={follower.follower.address}
            className={cn(
              "divider p-5",
              index === followersYouKnow.length - 1 && "border-b-0"
            )}
            variants={accountsList}
            initial="hidden"
            animate="visible"
          >
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
          </motion.div>
        ))}
        {hasMore && <span ref={ref} />}
      </Virtualizer>
    </div>
  );
};

export default FollowersYouKnow;
