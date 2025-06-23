import type { AccountFragment } from "@hey/indexer";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import FollowWithRulesCheck from "./FollowWithRulesCheck";
import Unfollow from "./Unfollow";

interface FollowUnfollowButtonProps {
  buttonClassName?: string;
  hideFollowButton?: boolean;
  hideUnfollowButton?: boolean;
  account: AccountFragment;
  small?: boolean;
  unfollowTitle?: string;
}

const FollowUnfollowButton = ({
  buttonClassName = "",
  hideFollowButton = false,
  hideUnfollowButton = false,
  account,
  small = false,
  unfollowTitle = "Following"
}: FollowUnfollowButtonProps) => {
  const { currentAccount } = useAccountStore();

  if (currentAccount?.address === account.address) {
    return null;
  }

  return (
    <div className="contents" onClick={stopEventPropagation}>
      {!hideFollowButton &&
        (account.operations?.isFollowedByMe ? null : (
          <FollowWithRulesCheck
            buttonClassName={buttonClassName}
            account={account}
            small={small}
          />
        ))}
      {!hideUnfollowButton &&
        (account.operations?.isFollowedByMe ? (
          <Unfollow
            buttonClassName={buttonClassName}
            account={account}
            small={small}
            title={unfollowTitle}
          />
        ) : null)}
    </div>
  );
};

export default FollowUnfollowButton;
