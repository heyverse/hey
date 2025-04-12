import Followers from "@/components/Shared/Modal/Followers";
import Following from "@/components/Shared/Modal/Following";
import GraphStatsShimmer from "@/components/Shared/Shimmer/GraphStatsShimmer";
import { Modal } from "@/components/Shared/UI";
import getAccount from "@hey/helpers/getAccount";
import humanize from "@hey/helpers/humanize";
import { type AccountFragment, useAccountStatsQuery } from "@hey/indexer";
import plur from "plur";
import { type FC, useEffect, useState } from "react";
import { useLocation } from "react-router";

interface FolloweringsProps {
  account: AccountFragment;
}

const Followerings = ({ account }: FolloweringsProps) => {
  const location = useLocation();
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  useEffect(() => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
  }, [location.key]);

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
    <Modal onClose={() => setShow(false)} show={show} title={title}>
      <Content
        username={getAccount(account).username}
        address={String(account.address)}
      />
    </Modal>
  );

  return (
    <div className="flex gap-8">
      <button
        className="flex gap-x-1"
        onClick={() => setShowFollowingModal(true)}
        type="button"
      >
        <b>{humanize(stats?.following)}</b>
        <span className="text-gray-500 dark:text-gray-200">Following</span>
      </button>
      <button
        className="flex gap-x-1"
        onClick={() => setShowFollowersModal(true)}
        type="button"
      >
        <b>{humanize(stats?.followers)}</b>
        <span className="text-gray-500 dark:text-gray-200">
          {plur("Follower", stats?.followers)}
        </span>
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
