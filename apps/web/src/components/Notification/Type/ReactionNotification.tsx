import Markup from "@/components/Shared/Markup";
import PostLink from "@/components/Shared/Post/PostLink";
import { HeartIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import type { ReactionNotificationFragment } from "@hey/indexer";
import plur from "plur";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface ReactionNotificationProps {
  notification: ReactionNotificationFragment;
}

const ReactionNotification = ({ notification }: ReactionNotificationProps) => {
  const metadata = notification.post.metadata;
  const filteredContent = getPostData(metadata)?.content || "";
  const reactions = notification.reactions;
  const firstAccount = reactions?.[0]?.account;
  const length = reactions.length - 1;
  const moreThanOneAccount = length > 1;

  const text = moreThanOneAccount
    ? `and ${length} ${plur("other", length)} liked your`
    : "liked your";
  const type = notification.post.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <HeartIcon className="size-6" />
        <div className="flex items-center space-x-1">
          {reactions.slice(0, 10).map((reaction) => (
            <div key={reaction.account.address}>
              <NotificationAccountAvatar account={reaction.account} />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstAccount={firstAccount}
          linkToType={`/posts/${notification.post.slug}`}
          text={text}
          type={type}
        />
        <PostLink
          className="linkify mt-2 line-clamp-2 text-gray-500 dark:text-gray-200"
          post={notification.post}
        >
          <Markup mentions={notification.post.mentions}>
            {filteredContent}
          </Markup>
        </PostLink>
      </div>
    </div>
  );
};

export default ReactionNotification;
