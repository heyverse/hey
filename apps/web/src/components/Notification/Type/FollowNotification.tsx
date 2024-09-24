import { UserPlusIcon } from "@heroicons/react/24/outline";
import getProfile from "@hey/helpers/getProfile";
import type { FollowNotification as TFollowNotification } from "@hey/lens";
import plur from "plur";
import type { FC } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";
import { NotificationProfileAvatar } from "../Profile";

interface FollowNotificationProps {
  notification: TFollowNotification;
}

const FollowNotification: FC<FollowNotificationProps> = ({ notification }) => {
  const { currentProfile } = useProfileStore();
  const followers = notification?.followers;
  const firstProfile = followers?.[0];
  const length = followers.length - 1;
  const moreThanOneProfile = length > 1;

  const text = moreThanOneProfile
    ? `and ${length} ${plur("other", length)} followed`
    : "followed";
  const type = "you";

  return (
    <div className="space-y-2 p-5">
      <div className="flex items-center space-x-3">
        <UserPlusIcon className="size-6" />
        <div className="flex items-center space-x-1">
          {followers.slice(0, 10).map((follower) => (
            <div key={follower.id}>
              <NotificationProfileAvatar profile={follower} />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstProfile={firstProfile}
          linkToType={getProfile(currentProfile).link}
          text={text}
          type={type}
        />
      </div>
    </div>
  );
};

export default FollowNotification;
