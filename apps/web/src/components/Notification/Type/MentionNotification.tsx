import Markup from "@/components/Shared/Markup";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import type { MentionNotificationFragment } from "@hey/indexer";
import { Link } from "react-router";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface MentionNotificationProps {
  notification: MentionNotificationFragment;
}

const MentionNotification = ({ notification }: MentionNotificationProps) => {
  const metadata = notification.post.metadata;
  const filteredContent = getPostData(metadata)?.content || "";
  const firstAccount = notification.post.author;

  const text = "mentioned you in a";
  const type = notification.post.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <AtSymbolIcon className="size-6" />
        <div className="flex items-center space-x-1">
          <NotificationAccountAvatar account={firstAccount} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstAccount={firstAccount}
          linkToType={`/posts/${notification.post.slug}`}
          text={text}
          type={type}
        />
        <Link
          className="linkify mt-2 line-clamp-2 text-gray-500 dark:text-gray-200"
          to={`/posts/${notification.post.slug}`}
        >
          <Markup mentions={notification.post.mentions}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default MentionNotification;
