import New from "@/components/Shared/Badges/New";
import { Tabs } from "@/components/Shared/UI";
import { useHomeTabStore } from "@/store/persisted/useHomeTabStore";
import { HomeFeedType } from "@hey/data/enums";

const FeedType = () => {
  const { feedType, setFeedType } = useHomeTabStore();

  const tabs = [
    { name: "Following", type: HomeFeedType.FOLLOWING },
    { name: "Highlights", type: HomeFeedType.HIGHLIGHTS },
    { name: "For You", type: HomeFeedType.FORYOU, suffix: <New /> }
  ];

  return (
    <Tabs
      tabs={tabs}
      active={feedType}
      setActive={(type) => setFeedType(type as HomeFeedType)}
      className="mx-5 mb-5 md:mx-0"
      layoutId="home_tab"
    />
  );
};

export default FeedType;
