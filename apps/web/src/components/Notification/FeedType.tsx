import { TabButton } from "@/components/Shared/UI";
import {} from "@heroicons/react/24/outline";
import { NotificationFeedType } from "@hey/data/enums";

interface FeedTypeProps {
  feedType: NotificationFeedType;
}

const FeedType = ({ feedType }: FeedTypeProps) => {
  const tabs = [
    {
      name: "All",
      type: NotificationFeedType.All
    },
    {
      name: "Mentions",
      type: NotificationFeedType.Mentions
    },
    {
      name: "Comments",
      type: NotificationFeedType.Comments
    },
    {
      name: "Likes",
      type: NotificationFeedType.Likes
    },
    {
      name: "Actions",
      type: NotificationFeedType.PostActions
    }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3 overflow-x-auto px-5 sm:mt-0 md:px-0 md:pb-0">
        {tabs.map((tab) => (
          <TabButton
            active={feedType === tab.type}
            key={tab.type}
            name={tab.name}
            type={tab.type.toLowerCase()}
          />
        ))}
      </div>
    </div>
  );
};

export default FeedType;
