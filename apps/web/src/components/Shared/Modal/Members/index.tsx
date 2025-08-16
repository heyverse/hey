import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type GroupFragment,
  type GroupMembersRequest,
  PageSize,
  useGroupMembersQuery
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

interface MembersProps {
  group: GroupFragment;
}

const Members = ({ group }: MembersProps) => {
  const { currentAccount } = useAccountStore();

  const request: GroupMembersRequest = {
    group: group.address,
    pageSize: PageSize.Fifty
  };

  const { data, loading, error, fetchMore } = useGroupMembersQuery({
    skip: !group.address,
    variables: { request }
  });

  const groupMembers = data?.groupMembers?.items;
  const pageInfo = data?.groupMembers?.pageInfo;
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

  if (!groupMembers?.length) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="size-8" />}
        message="Group doesn't have any members."
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load members"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtualizer>
        {groupMembers.map((member, index) => (
          <motion.div
            animate="visible"
            className={cn(
              "divider p-5",
              index === groupMembers.length - 1 && "border-b-0"
            )}
            initial="hidden"
            key={member.account.address}
            variants={accountsList}
          >
            <SingleAccount
              account={member.account}
              hideFollowButton={
                currentAccount?.address === member.account.address
              }
              hideUnfollowButton={
                currentAccount?.address === member.account.address
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

export default Members;
