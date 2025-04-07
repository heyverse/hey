import Followers from "@/components/Shared/Modal/Followers";
import Following from "@/components/Shared/Modal/Following";
import GraphStatsShimmer from "@/components/Shared/Shimmer/GraphStatsShimmer";
import { H4, Modal } from "@/components/Shared/UI";
import getAccount from "@hey/helpers/getAccount";
import humanize from "@hey/helpers/humanize";
import { type AccountFragment, useAccountStatsQuery } from "@hey/indexer";
import plur from "plur";
import { type FC, useState } from "react";

interface FolloweringsProps {
  account: AccountFragment;
}

const Followerings = ({ account }: FolloweringsProps) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  const { data, loading } = useAccountStatsQuery({
    variables: { request: { account: account.address } }
  });

  if (loading) {
    return <GraphStatsShimmer count={2} />;
  }

  if (!data) {
    return null;
  }

  const stats = data.accountStats.graphFollowStats;

  type ModalContentProps = {
    username: string;
    address: string;
  };

  const renderModal = (
    show: boolean,
    setShow: (value: boolean) => void,
    title: string,
    Content: FC<ModalContentProps>
  ) => (
    <Modal onClose={() => setShow(false)} show={show} title={title} size="md">
      <Content
        username={getAccount(account).username}
        address={String(account.address)}
      />
    </Modal>
  );

  return (
    <div className="flex gap-8">
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowingModal(true)}
        type="button"
      >
        <H4>{humanize(stats?.following)}</H4>
        <div className="text-gray-500 dark:text-gray-200">Following</div>
      </button>
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowersModal(true)}
        type="button"
      >
        <H4>{humanize(stats?.followers)}</H4>
        <div className="text-gray-500 dark:text-gray-200">
          {plur("Follower", stats?.followers)}
        </div>
      </button>
      {renderModal(
        showFollowingModal,
        setShowFollowingModal,
        "Following",
        Following
      )}
      {renderModal(
        showFollowersModal,
        setShowFollowersModal,
        "Followers",
        Followers
      )}
    </div>
  );
};

export default Followerings;
