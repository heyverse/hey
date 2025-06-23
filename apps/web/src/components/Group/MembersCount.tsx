import { PERMISSIONS } from "@hey/data/constants";
import { type GroupFragment, useGroupStatsQuery } from "@hey/indexer";
import { useState } from "react";
import Members from "@/components/Shared/Modal/Members";
import GraphStatsShimmer from "@/components/Shared/Shimmer/GraphStatsShimmer";
import { Modal } from "@/components/Shared/UI";
import humanize from "@/helpers/humanize";
import { useAccountStore } from "@/store/persisted/useAccountStore";

interface MembersCountProps {
  group: GroupFragment;
}

const MembersCount = ({ group }: MembersCountProps) => {
  const { currentAccount } = useAccountStore();
  const [showMembersModal, setShowMembersModal] = useState(false);
  const hideCount = Object.values(
    currentAccount?.isStaff ? [] : PERMISSIONS
  ).includes(group.address);

  const { data, loading } = useGroupStatsQuery({
    skip: hideCount,
    variables: { request: { group: group.address } }
  });

  if (hideCount) {
    return null;
  }

  if (loading) {
    return <GraphStatsShimmer count={1} />;
  }

  if (!data) {
    return null;
  }

  const stats = data.groupStats;

  return (
    <div className="flex gap-8">
      <button
        className="flex gap-x-1"
        onClick={() => setShowMembersModal(true)}
        type="button"
      >
        <b>{humanize(stats?.totalMembers)}</b>
        <span className="text-gray-500 dark:text-gray-200">Members</span>
      </button>
      <Modal
        onClose={() => setShowMembersModal(false)}
        show={showMembersModal}
        title="Members"
      >
        <Members group={group} />
      </Modal>
    </div>
  );
};

export default MembersCount;
