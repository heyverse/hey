import Followers from "@components/Shared/Modal/Followers";
import Following from "@components/Shared/Modal/Following";
import GraphStatsShimmer from "@components/Shared/Shimmer/GraphStatsShimmer";
import getAccount from "@hey/helpers/getAccount";
import humanize from "@hey/helpers/humanize";
import { type AccountFragment, useAccountStatsQuery } from "@hey/indexer";
import { H4, Modal } from "@hey/ui";
import plur from "plur";
import { type FC, useState } from "react";

interface FolloweringsProps {
  account: AccountFragment;
}

const Followerings: FC<FolloweringsProps> = ({ account }) => {
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
    handle: string;
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
        handle={getAccount(account).username}
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
        <div className="ld-text-gray-500">Following</div>
      </button>
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowersModal(true)}
        type="button"
      >
        <H4>{humanize(stats?.followers)}</H4>
        <div className="ld-text-gray-500">
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
