import Markup from "@/components/Shared/Markup";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import Link from "next/link";
import plur from "plur";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface ActedNotificationProps {
  notification: any;
}

const ActedNotification = ({ notification }: ActedNotificationProps) => {
  const post = notification.post;
  const targetPost = isRepost(post) ? post.repostOf : post;
  const { metadata } = targetPost;
  const filteredContent = getPostData(metadata)?.content || "";
  const actions = notification.actions;
  const firstAccount = actions?.[0]?.by;
  const length = actions.length - 1;
  const moreThanOneAccount = length > 1;

  const text = moreThanOneAccount
    ? `and ${length} ${plur("other", length)} acted on your`
    : "acted on your";
  const type = notification.post.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ShoppingBagIcon className="size-6" />
        <div className="flex items-center space-x-1">
          {actions.slice(0, 10).map((action: any) => (
            <div key={action.by.id}>
              <NotificationAccountAvatar account={action.by} />
            </div>
          ))}
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstAccount={firstAccount}
          linkToType={`/posts/${notification.post.id}`}
          text={text}
          type={type}
        />
        <Link
          className="ld-text-gray-500 linkify mt-2 line-clamp-2"
          href={`/posts/${notification.post.id}`}
        >
          <Markup mentions={targetPost.mentions}>{filteredContent}</Markup>
        </Link>
      </div>
    </div>
  );
};

export default ActedNotification;
