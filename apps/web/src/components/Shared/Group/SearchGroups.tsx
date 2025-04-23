import { Card, Input } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {
  type GroupFragment,
  type GroupsRequest,
  PageSize,
  useGroupsLazyQuery
} from "@hey/indexer";
import type { ChangeEvent } from "react";
import Loader from "../Loader";
import SingleGroup from "./SingleGroup";

interface SearchGroupsProps {
  error?: boolean;
  hideDropdown?: boolean;
  onGroupSelected: (group: GroupFragment) => void;
  placeholder?: string;
  value: string;
}

const SearchGroups = ({
  error = false,
  hideDropdown = false,
  onGroupSelected,
  placeholder = "Search…",
  value
}: SearchGroupsProps) => {
  const { currentAccount } = useAccountStore();
  const [searchGroups, { data, loading }] = useGroupsLazyQuery();

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    const request: GroupsRequest = {
      pageSize: PageSize.Fifty,
      filter: {
        managedBy: { address: currentAccount?.address },
        searchQuery: keyword
      }
    };

    searchGroups({ variables: { request } });
  };

  const groups = data?.groups?.items;

  return (
    <div className="relative w-full">
      <Input
        error={error}
        onChange={handleSearch}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {!hideDropdown && value.length > 0 && (
        <div className="absolute mt-2 flex w-[94%] max-w-md flex-col">
          <Card className="z-[2] max-h-[80vh] overflow-y-auto py-2">
            {loading ? (
              <Loader className="my-3" message="Searching groups" small />
            ) : groups && groups.length > 0 ? (
              groups.slice(0, 7).map((group) => (
                <div
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  key={group.address}
                  onClick={() => onGroupSelected(group)}
                >
                  <SingleGroup group={group} />
                </div>
              ))
            ) : (
              <div className="px-4 py-2">No matching groups</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchGroups;
