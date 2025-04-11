import { Tabs } from "@/components/Shared/UI";
import { GroupsFeedType } from "@hey/data/enums";
import type { Dispatch, SetStateAction } from "react";

interface FocusTypeProps {
  feedType: GroupsFeedType;
  setFeedType: Dispatch<SetStateAction<GroupsFeedType>>;
}

const FeedType = ({ feedType, setFeedType }: FocusTypeProps) => {
  const tabs = [
    { name: "Managed groups", type: GroupsFeedType.Managed },
    { name: "Your groups", type: GroupsFeedType.Member }
  ];

  return (
    <Tabs
      tabs={tabs}
      active={feedType}
      setActive={(type) => setFeedType(type as GroupsFeedType)}
      className="mx-5 mb-5 md:mx-0"
      layoutId="groups-tabs"
    />
  );
};

export default FeedType;
