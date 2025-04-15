import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";
import { HeartIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  type PostReactionsRequest,
  usePostReactionsQuery
} from "@hey/indexer";
import { motion } from "motion/react";
import { Virtuoso } from "react-virtuoso";

interface LikesProps {
  postId: string;
}

const Likes = ({ postId }: LikesProps) => {
  const { currentAccount } = useAccountStore();

  const request: PostReactionsRequest = {
    post: postId,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = usePostReactionsQuery({
    skip: !postId,
    variables: { request }
  });

  const accounts = data?.postReactions?.items;
  const pageInfo = data?.postReactions?.pageInfo;
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

  if (!accounts?.length) {
    return (
      <div className="p-5">
        <EmptyState
          icon={<HeartIcon className="size-8" />}
          message="No likes."
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
        title="Failed to load likes"
      />
    );
  }

  return (
    <Virtuoso
      className="!h-[80vh]"
      data={accounts}
      endReached={onEndReached}
      itemContent={(index, like) => (
        <motion.div
          className={cn(
            "divider p-5",
            index === accounts.length - 1 && "border-b-0"
          )}
          variants={accountsList}
          initial="hidden"
          animate="visible"
        >
          <SingleAccount
            hideFollowButton={currentAccount?.address === like.account.address}
            hideUnfollowButton={
              currentAccount?.address === like.account.address
            }
            account={like.account}
            showBio
            showUserPreview={false}
          />
        </motion.div>
      )}
    />
  );
};

export default Likes;
