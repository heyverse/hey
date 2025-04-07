import Markup from "@/components/Shared/Markup";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import getPostData from "@hey/helpers/getPostData";
import type { QuoteNotificationFragment } from "@hey/indexer";
import { Link } from "react-router";
import { NotificationAccountAvatar } from "../Account";
import AggregatedNotificationTitle from "../AggregatedNotificationTitle";

interface QuoteNotificationProps {
  notification: QuoteNotificationFragment;
}

const QuoteNotification = ({ notification }: QuoteNotificationProps) => {
  const metadata = notification.quote.metadata;
  const filteredContent = getPostData(metadata)?.content || "";
  const firstAccount = notification.quote.author;

  const text = "quoted your";
  const type = notification.quote.quoteOf?.__typename;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <ChatBubbleBottomCenterTextIcon className="size-6" />
        <div className="flex items-center space-x-1">
          <NotificationAccountAvatar account={firstAccount} />
        </div>
      </div>
      <div className="ml-9">
        <AggregatedNotificationTitle
          firstAccount={firstAccount}
          linkToType={`/posts/${notification.quote.slug}`}
          text={text}
          type={type}
        />
        <Link
          className="linkify mt-2 line-clamp-2 text-gray-500 dark:text-gray-200"
          to={`/posts/${notification.quote.slug}`}
        >
          <Markup mentions={notification.quote.mentions}>
            {filteredContent}
          </Markup>
        </Link>
      </div>
    </div>
  );
};

export default QuoteNotification;
