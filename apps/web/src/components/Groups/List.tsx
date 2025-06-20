import SingleGroup from "@/components/Shared/Group/SingleGroup";
import GroupListShimmer from "@/components/Shared/Shimmer/GroupListShimmer";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import useLoadMoreOnIntersect from "@/hooks/useLoadMoreOnIntersect";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { GroupsFeedType } from "@hey/data/enums";
import {
  GroupsOrderBy,
  type GroupsRequest,
  PageSize,
  useGroupsQuery
} from "@hey/indexer";
import { WindowVirtualizer } from "virtua";

interface ListProps {
  feedType: GroupsFeedType;
}

const List = ({ feedType }: ListProps) => {
  const { currentAccount } = useAccountStore();

  const request: GroupsRequest = {
    filter: {
      ...(feedType === GroupsFeedType.Member && {
        member: currentAccount?.address
      }),
      ...(feedType === GroupsFeedType.Managed && {
        managedBy: { address: currentAccount?.address }
      })
    },
    orderBy: GroupsOrderBy.LatestFirst,
    pageSize: PageSize.Fifty
  };

  const { data, error, fetchMore, loading } = useGroupsQuery({
    variables: { request }
  });

  const groups = data?.groups?.items;
  const pageInfo = data?.groups?.pageInfo;
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
    return <GroupListShimmer />;
  }

  if (!groups?.length) {
    return (
      <EmptyState
        icon={<UserGroupIcon className="size-8" />}
        message="No groups."
        hideCard
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load groups"
      />
    );
  }

  return (
    <div className="virtual-divider-list-window">
      <WindowVirtualizer>
        {groups.map((group) => (
          <div className="p-5" key={group.address}>
            <SingleGroup group={group} showDescription isBig />
          </div>
        ))}
        {hasMore && <span ref={loadMoreRef} />}
      </WindowVirtualizer>
    </div>
  );
};

export default List;
