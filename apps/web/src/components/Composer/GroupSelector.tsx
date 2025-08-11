import getAvatar from "@hey/helpers/getAvatar";
import {
  type GroupFragment,
  GroupsOrderBy,
  type GroupsRequest,
  PageSize,
  useGroupsQuery
} from "@hey/indexer";
import { useMemo } from "react";
import { Select } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface GroupSelectorProps {
  selected?: string;
  onChange: (groupFeed: string) => void;
}

const GroupSelector = ({ selected, onChange }: GroupSelectorProps) => {
  const { currentAccount } = useAccountStore();

  const request: GroupsRequest = {
    filter: { member: currentAccount?.address },
    orderBy: GroupsOrderBy.LatestFirst,
    pageSize: PageSize.Fifty
  };

  const { data } = useGroupsQuery({
    skip: !currentAccount,
    variables: { request }
  });

  const groups = useMemo(
    () => data?.groups?.items ?? [],
    [data?.groups?.items]
  );

  const options = useMemo(
    () => [
      {
        icon: getAvatar(currentAccount),
        label: "My profile",
        selected: !selected,
        value: ""
      },
      ...groups.map((group: GroupFragment) => ({
        icon: getAvatar(group),
        label: group.metadata?.name ?? group.address,
        selected: group.feed?.address === selected,
        value: group.feed?.address ?? ""
      }))
    ],
    [currentAccount, groups, selected]
  );

  if (!groups.length) {
    return null;
  }

  return (
    <Select
      className="w-full"
      iconClassName="size-5 rounded-md"
      onChange={(value) => onChange(value as string)}
      options={options as any}
      showSearch
    />
  );
};

export default GroupSelector;
