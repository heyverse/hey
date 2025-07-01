import { HomeIcon } from "@heroicons/react/24/outline";
import getAvatar from "@hey/helpers/getAvatar";
import {
  type GroupFragment,
  GroupsOrderBy,
  type GroupsRequest,
  PageSize,
  useGroupsQuery
} from "@hey/indexer";
import { useMemo, useState } from "react";
import { Modal, Tooltip } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import GroupSelector from "../GroupSelector";

interface GroupFeedSelectorProps {
  selected?: string;
  onChange: (feed: string) => void;
}

const GroupFeedSelector = ({ selected, onChange }: GroupFeedSelectorProps) => {
  const { currentAccount } = useAccountStore();
  const [showModal, setShowModal] = useState(false);

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

  const selectedGroup = useMemo(
    () =>
      groups.find((group: GroupFragment) => group.feed?.address === selected),
    [groups, selected]
  );

  const handleChange = (feed: string) => {
    onChange(feed);
    setShowModal(false);
  };

  return (
    <>
      <Tooltip content="Post to" placement="top" withDelay>
        <button
          aria-label="Select group"
          className="rounded-full outline-offset-8"
          disabled={!groups.length}
          onClick={() => setShowModal(true)}
          type="button"
        >
          {selectedGroup ? (
            <img
              alt={selectedGroup.metadata?.name ?? selectedGroup.address}
              className="size-5 rounded-md"
              src={getAvatar(selectedGroup)}
            />
          ) : (
            <HomeIcon className="size-5" />
          )}
        </button>
      </Tooltip>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title="Select group"
      >
        <div className="p-5">
          <GroupSelector onChange={handleChange} selected={selected} />
        </div>
      </Modal>
    </>
  );
};

export default GroupFeedSelector;
