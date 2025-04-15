import SingleAccount from "@/components/Shared/Account/SingleAccount";
import AccountListShimmer from "@/components/Shared/Shimmer/AccountListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { accountsList } from "@/variants";
import { UsersIcon } from "@heroicons/react/24/outline";
import {
  type GroupFragment,
  type GroupMembersRequest,
  PageSize,
  useGroupMembersQuery
} from "@hey/indexer";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Virtualizer } from "virtua";

interface MembersProps {
  group: GroupFragment;
}

const Members = ({ group }: MembersProps) => {
  const { currentAccount } = useAccountStore();
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px"
  });

  const request: GroupMembersRequest = {
    pageSize: PageSize.Fifty,
    group: group.address
  };

  const { data, loading, error, fetchMore } = useGroupMembersQuery({
    skip: !group.address,
    variables: { request }
  });

  const groupMembers = data?.groupMembers?.items;
  const pageInfo = data?.groupMembers?.pageInfo;
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

  if (!groupMembers?.length) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message="Group doesn't have any members."
        hideCard
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
            key={member.account.address}
            className={cn(
              "divider p-5",
              index === groupMembers.length - 1 && "border-b-0"
            )}
            variants={accountsList}
            initial="hidden"
            animate="visible"
          >
            <SingleAccount
              hideFollowButton={
                currentAccount?.address === member.account.address
              }
              hideUnfollowButton={
                currentAccount?.address === member.account.address
              }
              account={member.account}
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

export default Members;
