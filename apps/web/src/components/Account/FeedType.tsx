import { TabButton } from "@/components/Shared/UI";
import {} from "@heroicons/react/24/outline";
import { AccountFeedType } from "@hey/data/enums";
import type { JSX } from "react";
import MediaFilter from "./Filters/MediaFilter";

interface FeedTypeProps {
  feedType: AccountFeedType;
}

const FeedType = ({ feedType }: FeedTypeProps) => {
  const tabs = [
    {
      name: "Feed",
      type: AccountFeedType.Feed
    },
    {
      name: "Replies",
      type: AccountFeedType.Replies
    },
    {
      name: "Media",
      type: AccountFeedType.Media
    },
    {
      name: "Collected",
      type: AccountFeedType.Collects
    }
  ].filter(
    (tab): tab is { icon: JSX.Element; name: string; type: AccountFeedType } =>
      Boolean(tab)
  );

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 md:px-0 md:pb-0">
        {tabs.map((tab) => (
          <TabButton
            active={feedType === tab.type}
            key={tab.type}
            name={tab.name}
            type={tab.type.toLowerCase()}
          />
        ))}
      </div>
      {feedType === AccountFeedType.Media && <MediaFilter />}
    </div>
  );
};

export default FeedType;
