import { GroupsFeedType } from "@hey/data/enums";
import type { Dispatch, SetStateAction } from "react";
import { Tabs } from "@/components/Shared/UI";
import logEvent from "@/helpers/logEvent";

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
      setActive={(type) => {
        const nextType = type as GroupsFeedType;
        setFeedType(nextType);
        const tab = tabs.find((tabItem) => tabItem.type === nextType);
        if (tab) {
          void logEvent(`Groups Tab: ${tab.name}`);
        }
      }}
      tabs={tabs}
    />
  );
};

export default FeedType;
