import SearchGroups from "@/components/Shared/Group/SearchGroups";
import Loader from "@/components/Shared/Loader";
import ToggleWithHelper from "@/components/Shared/ToggleWithHelper";
import { Button, EmptyState } from "@/components/Shared/UI";
import { usePostGroupStore } from "@/store/non-persisted/post/usePostGroupStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { EXPANSION_EASE } from "@/variants";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { GroupsOrderBy, PageSize, useGroupsQuery } from "@hey/indexer";
import { motion } from "motion/react";
import type { Dispatch, SetStateAction } from "react";

interface GroupSelectorProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const GroupSelector = ({ setShowModal }: GroupSelectorProps) => {
  const { currentAccount } = useAccountStore();
  const { group, setGroup } = usePostGroupStore();

  const { data, loading } = useGroupsQuery({
    variables: {
      request: {
        filter: {
          managedBy: { address: currentAccount?.address }
        },
        orderBy: GroupsOrderBy.LatestFirst,
        pageSize: PageSize.Fifty
      }
    }
  });

  if (loading) {
    return <Loader className="my-10" />;
  }

  const groups = data?.groups.items;

  if (!groups?.length) {
    return (
      <EmptyState
        hideCard
        icon={<UserGroupIcon className="size-8" />}
        message="You are not a member of any group!"
      />
    );
  }

  return (
    <>
      <div className="p-5">
        <ToggleWithHelper
          description="Post will be published on the selected group"
          heading="Post on a group"
          on={Boolean(group)}
          setOn={() => setGroup(group ? undefined : groups?.[0])}
        />
      </div>
      <div className="divider" />
      {group ? (
        <>
          <motion.div
            className="m-5 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, height: 0, y: -20 },
              visible: { opacity: 1, height: "auto", y: 0 }
            }}
            transition={{ duration: 0.2, ease: EXPANSION_EASE }}
          >
            <SearchGroups
              onGroupSelected={(group) => setGroup(group)}
              placeholder="Search for groups"
              value={group.metadata?.name ?? ""}
            />
          </motion.div>
          <div className="divider" />
        </>
      ) : null}
      <div className="flex space-x-2 p-5">
        <Button
          className="ml-auto"
          onClick={() => {
            setGroup(undefined);
            setShowModal(false);
          }}
          outline
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setGroup(group);
            setShowModal(false);
          }}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default GroupSelector;
