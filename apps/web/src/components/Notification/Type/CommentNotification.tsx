import Markup from "@components/Shared/Markup";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import type { CommentNotificationFragment } from "@hey/indexer";
import Link from "next/link";
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
          linkToType={`/posts/${notification.comment.id}`}
          text={text}
          type={type}
        />
        <Link
          className="ld-text-gray-500 linkify mt-2 line-clamp-2"
          href={`/posts/${notification.comment.id}`}
        >
          <Markup mentions={notification.comment.mentions}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default CommentNotification;
