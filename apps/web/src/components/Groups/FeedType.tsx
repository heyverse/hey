import { GroupsFeedType } from "@hey/data/enums";
import type { Dispatch, SetStateAction } from "react";
import { Tabs } from "@/components/Shared/UI";

interface FeedTypeProps {
  feedType: GroupsFeedType;
  setFeedType: Dispatch<SetStateAction<GroupsFeedType>>;
}

const FeedType = ({ feedType, setFeedType }: FeedTypeProps) => {
  const tabs = [
    { name: "Managed groups", type: GroupsFeedType.Managed },
    { name: "Your groups", type: GroupsFeedType.Member }
  ];

  return (
    <Tabs
      active={feedType}
      className="mx-5 mb-5 md:mx-0"
      layoutId="groups_tab"
      setActive={(type) => setFeedType(type as GroupsFeedType)}
      tabs={tabs}
    />
  );
};

export default FeedType;
