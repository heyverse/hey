import FollowersYouKnow from "@/components/Shared/Modal/FollowersYouKnow";
import { Modal, StackedAvatars } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { type Follower, useFollowersYouKnowQuery } from "@hey/indexer";
import { type ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";
import FollowersYouKnowShimmer from "../Shared/Shimmer/FollowersYouKnowShimmer";

interface FollowersYouKnowOverviewProps {
  username: string;
  address: string;
}

const FollowersYouKnowOverview = ({
  username,
  address
}: FollowersYouKnowOverviewProps) => {
  const location = useLocation();
  const { currentAccount } = useAccountStore();
  const [showMutualFollowersModal, setShowMutualFollowersModal] =
    useState(false);

  useEffect(() => {
    setShowMutualFollowersModal(false);
  }, [location.key]);

  const { data, error, loading } = useFollowersYouKnowQuery({
    skip: !address || !currentAccount?.address,
    variables: {
      request: { observer: currentAccount?.address, target: address }
    }
  });

  const accounts =
    (data?.followersYouKnow?.items.slice(0, 4) as Follower[]) || [];

  const renderAccountNames = () => {
    const names = accounts.map((account) => getAccount(account.follower).name);
    const count = names.length - 3;

    if (!names.length) return null;
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    if (names.length === 3)
      return `${names[0]}, ${names[1]}${count === 0 ? " and " : ", "}${names[2]}${count ? ` and ${count} other${count === 1 ? "" : "s"}` : ""}`;

    return `${names[0]}, ${names[1]}, ${names[2]} and others`;
  };

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <button
      className="flex cursor-pointer items-center gap-x-2 text-gray-500 text-sm dark:text-gray-200"
      onClick={() => setShowMutualFollowersModal(true)}
      type="button"
    >
      <StackedAvatars
        avatars={accounts.map((account) => getAvatar(account.follower))}
        limit={3}
      />
      <div className="text-left">
        <span>Followed by </span>
        {children}
      </div>
      <Modal
        onClose={() => setShowMutualFollowersModal(false)}
        show={showMutualFollowersModal}
        title="Mutual Followers"
      >
        <FollowersYouKnow username={username} address={address} />
      </Modal>
    </button>
  );

  if (loading) {
    return <FollowersYouKnowShimmer />;
  }

  if (!accounts.length || error) {
    return null;
  }

  return <Wrapper>{renderAccountNames()}</Wrapper>;
};

export default FollowersYouKnowOverview;
