import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  PostReferenceType,
  useWhoReferencedPostQuery,
  type WhoReferencedPostRequest
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

interface RepostsProps {
  postId: string;
}

const Reposts = ({ postId }: RepostsProps) => {
  const { currentAccount } = useAccountStore();

  const request: WhoReferencedPostRequest = {
    pageSize: PageSize.Fifty,
    post: postId,
    referenceTypes: [PostReferenceType.RepostOf]
  };

  const { data, error, fetchMore, loading } = useWhoReferencedPostQuery({
    skip: !postId,
    variables: { request }
  });

  const accounts = data?.whoReferencedPost?.items;
  const pageInfo = data?.whoReferencedPost?.pageInfo;
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
          icon={<ArrowsRightLeftIcon className="size-8" />}
          message="No reposts."
        />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load reposts"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {accounts.map((account, index) => (
          <motion.div
            animate="visible"
            className={cn(
              "divider p-5",
              index === accounts.length - 1 && "border-b-0"
            )}
            initial="hidden"
            key={account.address}
            variants={accountsList}
          >
            <SingleAccount
              account={account}
              hideFollowButton={currentAccount?.address === account.address}
              hideUnfollowButton={currentAccount?.address === account.address}
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

export default Reposts;
