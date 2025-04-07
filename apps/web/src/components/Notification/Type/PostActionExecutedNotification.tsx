import Markup from "@/components/Shared/Markup";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import type { PostActionExecutedNotificationFragment } from "@hey/indexer";
import plur from "plur";
import { Link } from "react-router";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface PostActionExecutedNotificationProps {
  notification: PostActionExecutedNotificationFragment;
}

const PostActionExecutedNotification = ({
  notification
}: PostActionExecutedNotificationProps) => {
  const post = notification.post;
  const { metadata } = post;
  const filteredContent = getPostData(metadata)?.content || "";
  const actions = notification.actions;
  const firstAccount =
    actions[0]?.__typename === "SimpleCollectPostActionExecuted"
      ? actions[0].executedBy
      : actions[0].__typename === "TippingPostActionExecuted"
        ? actions[0].executedBy
        : undefined;
  const length = actions.length - 1;
  const moreThanOneAccount = length > 1;
  const type =
    actions[0]?.__typename === "SimpleCollectPostActionExecuted"
      ? "collected"
      : actions[0].__typename === "TippingPostActionExecuted"
        ? "tipped"
        : undefined;

  const text = moreThanOneAccount
    ? `and ${length} ${plur("other", length)} ${type} your`
    : `${type} your`;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ShoppingBagIcon className="size-6" />
        <div className="flex items-center space-x-1">
          {actions.slice(0, 10).map((action, index: number) => {
            const account =
              action.__typename === "SimpleCollectPostActionExecuted"
                ? action.executedBy
                : action.__typename === "TippingPostActionExecuted"
                  ? action.executedBy
                  : undefined;

            if (!account) {
              return null;
            }

            return (
              <div key={index}>
                <NotificationAccountAvatar account={account} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="ml-9">
        {firstAccount && (
          <AggregatedNotificationTitle
            firstAccount={firstAccount}
            linkToType={`/posts/${notification.post.slug}`}
            text={text}
            type="Post"
          />
        )}
        <Link
          className="linkify mt-2 line-clamp-2 text-gray-500 dark:text-gray-200"
          to={`/posts/${notification.post.slug}`}
        >
          <Markup mentions={post.mentions}>{filteredContent}</Markup>
        </Link>
      </div>
    </div>
  );
};

export default PostActionExecutedNotification;
