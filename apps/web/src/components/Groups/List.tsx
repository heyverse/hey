import GroupListShimmer from "@/components/Shared/Shimmer/GroupListShimmer";
import SingleGroup from "@/components/Shared/SingleGroup";
import { EmptyState, ErrorMessage } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import {
  GroupsOrderBy,
  type GroupsRequest,
  PageSize,
  useGroupsQuery
} from "@hey/indexer";
import { Virtuoso } from "react-virtuoso";
import { GroupsTabFocus } from ".";

interface ListProps {
  focus: GroupsTabFocus;
}

const List = ({ focus }: ListProps) => {
  const { currentAccount } = useAccountStore();

  const request: GroupsRequest = {
    filter: {
      ...(focus === GroupsTabFocus.Member && {
        member: currentAccount?.address
      }),
      ...(focus === GroupsTabFocus.Managed && {
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

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

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
    <Virtuoso
      className="virtual-divider-list-window"
      data={groups}
      endReached={onEndReached}
      itemContent={(_, group) => (
        <div className="p-5">
          <SingleGroup group={group} showDescription isBig />
        </div>
      )}
      useWindowScroll
    />
  );
};

export default List;
