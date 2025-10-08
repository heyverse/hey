import { HomeFeedType } from "@hey/data/enums";
import New from "@/components/Shared/Badges/New";
import { Tabs } from "@/components/Shared/UI";
import logEvent from "@/helpers/logEvent";
import { useHomeTabStore } from "@/store/persisted/useHomeTabStore";

const FeedType = () => {
  const { feedType, setFeedType } = useHomeTabStore();

  const tabs = [
    { name: "Following", type: HomeFeedType.FOLLOWING },
    { name: "Highlights", type: HomeFeedType.HIGHLIGHTS },
    { name: "For You", suffix: <New />, type: HomeFeedType.FORYOU }
  ];

  return (
    <Tabs
      active={feedType}
      className="mx-5 mb-5 md:mx-0"
      layoutId="home_tab"
      setActive={(type) => {
        const nextType = type as HomeFeedType;
        setFeedType(nextType);
        const tab = tabs.find((tabItem) => tabItem.type === nextType);
        if (tab) {
          void logEvent(`Home Tab: ${tab.name}`);
        }
      }}
      tabs={tabs}
    />
  );
};

export default FeedType;
