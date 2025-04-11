import New from "@/components/Shared/Badges/New";
import { useHomeTabStore } from "@/store/persisted/useHomeTabStore";
import { HomeFeedType } from "@hey/data/enums";
import { Tabs } from "../Shared/UI";

const FeedType = () => {
  const { feedType, setFeedType } = useHomeTabStore();

  const tabs = [
    { name: "Following", type: HomeFeedType.FOLLOWING },
    { name: "Highlights", type: HomeFeedType.HIGHLIGHTS },
    { name: "For You", type: HomeFeedType.FORYOU, suffix: <New /> }
  ].filter((tab) => Boolean(tab));

  return (
    <Tabs
      tabs={tabs}
      active={feedType}
      setActive={(type) => setFeedType(type as HomeFeedType)}
      className="px-5 md:px-0"
      layoutId="home-tabs"
    />
  );
};

export default FeedType;
