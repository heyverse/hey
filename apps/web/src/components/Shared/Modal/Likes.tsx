import { HeartIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostReactionsRequest,
  usePostReactionsQuery
} from "@hey/indexer";
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

interface LikesProps {
  postId: string;
}

const Likes = ({ postId }: LikesProps) => {
  const { currentAccount } = useAccountStore();

  const request: PostReactionsRequest = {
    pageSize: PageSize.Fifty,
    post: postId
  };

  const { data, error, fetchMore, loading } = usePostReactionsQuery({
    skip: !postId,
    variables: { request }
  });

  const accounts = data?.postReactions?.items;
  const pageInfo = data?.postReactions?.pageInfo;
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

  if (!accounts?.length) {
    return (
      <div className="p-5">
        <EmptyState
          hideCard
          icon={<HeartIcon className="size-8" />}
          message="No likes."
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load likes"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {accounts.map((like, index) => (
          <motion.div
            animate="visible"
            className={cn(
              "divider p-5",
              index === accounts.length - 1 && "border-b-0"
            )}
            initial="hidden"
            key={like.account.address}
            variants={accountsList}
          >
            <SingleAccount
              account={like.account}
              hideFollowButton={
                currentAccount?.address === like.account.address
              }
              hideUnfollowButton={
                currentAccount?.address === like.account.address
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

export default Likes;
