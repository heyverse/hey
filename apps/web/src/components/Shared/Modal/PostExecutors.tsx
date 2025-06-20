import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import {
  type PostActionFilter,
  type WhoExecutedActionOnPostRequest,
  useWhoExecutedActionOnPostQuery
} from "@hey/indexer";
import { motion } from "motion/react";
import { Virtualizer } from "virtua";

interface PostExecutorsProps {
  postId: string;
  filter: PostActionFilter;
}

const PostExecutors = ({ postId, filter }: PostExecutorsProps) => {
  const { currentAccount } = useAccountStore();

  const request: WhoExecutedActionOnPostRequest = {
    post: postId,
    filter: { anyOf: [filter] }
  };

  const { data, error, fetchMore, loading } = useWhoExecutedActionOnPostQuery({
    skip: !postId,
    variables: { request }
  });

  const accounts = data?.whoExecutedActionOnPost?.items;
  const pageInfo = data?.whoExecutedActionOnPost?.pageInfo;
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

  if (!accounts?.length) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<ShoppingBagIcon className="size-8" />}
          message="No actions."
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
        title="Failed to load actions"
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
            initial="hidden"
            animate="visible"
            variants={accountsList}
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
        {hasMore && <span ref={loadMoreRef} />}
      </Virtualizer>
    </div>
  );
};

export default PostExecutors;
