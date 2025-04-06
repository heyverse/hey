import New from "@/components/Shared/Badges/New";
import { TabButton } from "@/components/Shared/UI";
import { useHomeTabStore } from "@/store/persisted/useHomeTabStore";
import { HomeFeedType } from "@hey/data/enums";
import type { JSX } from "react";

const FeedType = () => {
  const { feedType, setFeedType } = useHomeTabStore();

  const tabs = [
    { name: "Following", type: HomeFeedType.FOLLOWING },
    { name: "Highlights", type: HomeFeedType.HIGHLIGHTS },
    { badge: <New />, name: "For You", type: HomeFeedType.FORYOU }
  ].filter(
    (
      tab
    ): tab is {
      badge?: JSX.Element;
      name: string;
      type: HomeFeedType;
    } => Boolean(tab)
  );

  return (
    <div className="flex flex-wrap gap-3 px-5 md:px-0">
      {tabs.map((tab) => (
        <TabButton
          active={feedType === tab.type}
          badge={tab.badge}
          key={tab.type}
          name={tab.name}
          onClick={() => setFeedType(tab.type)}
          showOnSm
        />
      ))}
    </div>
  );
};

export default FeedType;
