import { Tabs } from "@/components/Shared/UI";
import { NotificationFeedType } from "@hey/data/enums";
import type { Dispatch, SetStateAction } from "react";

interface FeedTypeProps {
  feedType: NotificationFeedType;
  setFeedType: Dispatch<SetStateAction<NotificationFeedType>>;
}

const FeedType = ({ feedType, setFeedType }: FeedTypeProps) => {
  const tabs = [
    { name: "All", type: NotificationFeedType.All },
    { name: "Mentions", type: NotificationFeedType.Mentions },
    { name: "Comments", type: NotificationFeedType.Comments },
    { name: "Likes", type: NotificationFeedType.Likes },
    { name: "Actions", type: NotificationFeedType.PostActions }
  ];

  return (
    <Tabs
      tabs={tabs}
      active={feedType}
      setActive={(type) => setFeedType(type as NotificationFeedType)}
      className="mx-5 mb-5 md:mx-0"
      layoutId="notification-tabs"
    />
  );
};

export default FeedType;
