import { AccountFeedType } from "@hey/data/enums";
import generateUUID from "@hey/helpers/generateUUID";
import type { Dispatch, SetStateAction } from "react";
import { Tabs } from "@/components/Shared/UI";
import logEvent from "@/helpers/logEvent";

interface FeedTypeProps {
  feedType: AccountFeedType;
  setFeedType: Dispatch<SetStateAction<AccountFeedType>>;
}

const FeedType = ({ feedType, setFeedType }: FeedTypeProps) => {
  const tabs = [
    { name: "Feed", type: AccountFeedType.Feed },
    { name: "Replies", type: AccountFeedType.Replies },
    { name: "Media", type: AccountFeedType.Media },
    { name: "Collected", type: AccountFeedType.Collects }
  ];

  return (
    <Tabs
      active={feedType}
      className="mx-5 mb-5 md:mx-0"
      key={generateUUID()}
      layoutId="account_tab"
      setActive={(type) => {
        const nextType = type as AccountFeedType;
        setFeedType(nextType);
        const tab = tabs.find((tabItem) => tabItem.type === nextType);
        if (tab) {
          void logEvent(`Profile Tab: ${tab.name}`);
        }
      }}
      tabs={tabs}
    />
  );
};

export default FeedType;
