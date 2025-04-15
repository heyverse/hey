import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import {
  PageSize,
  PostReferenceType,
  type WhoReferencedPostRequest,
  useWhoReferencedPostQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Virtualizer } from "virtua";

interface RepostsProps {
  postId: string;
}

const Reposts = ({ postId }: RepostsProps) => {
  const { currentAccount } = useAccountStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

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
          icon={<ArrowsRightLeftIcon className="size-8" />}
          message="No reposts."
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
        title="Failed to load reposts"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {accounts.map((account, index) => (
          <motion.div
            key={account.address}
            className={cn(
              "divider p-5",
              index === accounts.length - 1 && "border-b-0"
            )}
            variants={accountsList}
            initial="hidden"
            animate="visible"
          >
            <SingleAccount
              hideFollowButton={currentAccount?.address === account.address}
              hideUnfollowButton={currentAccount?.address === account.address}
              account={account}
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

export default Reposts;
