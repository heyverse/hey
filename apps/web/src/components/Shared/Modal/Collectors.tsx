import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import {
  type WhoExecutedActionOnPostRequest,
  useWhoExecutedActionOnPostQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Virtualizer } from "virtua";

interface CollectorsProps {
  postId: string;
}

const Collectors = ({ postId }: CollectorsProps) => {
  const { currentAccount } = useAccountStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

  const request: WhoExecutedActionOnPostRequest = {
    post: postId,
    filter: { anyOf: [{ simpleCollect: true }] }
  };

  const { data, error, fetchMore, loading } = useWhoExecutedActionOnPostQuery({
    skip: !postId,
    variables: { request }
  });

  const accounts = data?.whoExecutedActionOnPost?.items;
  const pageInfo = data?.whoExecutedActionOnPost?.pageInfo;
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

  if (!accounts?.length) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<ShoppingBagIcon className="size-8" />}
          message="No collectors."
          hideCard
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load collectors"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {accounts.map((action, index) => (
          <motion.div
            key={action.account.address}
            className={cn(
              "divider p-5",
              index === accounts.length - 1 && "border-b-0"
            )}
            variants={accountsList}
            initial="hidden"
            animate="visible"
          >
            <SingleAccount
              hideFollowButton={
                currentAccount?.address === action.account.address
              }
              hideUnfollowButton={
                currentAccount?.address === action.account.address
              }
              account={action.account}
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

export default Collectors;
