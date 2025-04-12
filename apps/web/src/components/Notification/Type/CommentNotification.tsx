import Markup from "@/components/Shared/Markup";
import PostLink from "@/components/Shared/Post/PostLink";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import type { CommentNotificationFragment } from "@hey/indexer";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface CommentNotificationProps {
  notification: CommentNotificationFragment;
}

const CommentNotification = ({ notification }: CommentNotificationProps) => {
  const metadata = notification.comment.metadata;
  const filteredContent = getPostData(metadata)?.content || "";
  const firstAccount = notification.comment.author;

  const text = "commented on your";
  const type = notification.comment.commentOn?.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ChatBubbleLeftIcon className="size-6" />
        <div className="flex items-center space-x-1">
          <NotificationAccountAvatar account={firstAccount} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstAccount={firstAccount}
          linkToType={`/posts/${notification.comment.slug}`}
          text={text}
          type={type}
        />
        <PostLink
          className="linkify mt-2 line-clamp-2 text-gray-500 dark:text-gray-200"
          post={notification.comment}
        >
          <Markup mentions={notification.comment.mentions}>
            {filteredContent}
          </Markup>
        </PostLink>
      </div>
    </div>
  );
};

export default CommentNotification;
