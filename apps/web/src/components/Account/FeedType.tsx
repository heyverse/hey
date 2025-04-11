import { Tabs } from "@/components/Shared/UI";
import { AccountFeedType } from "@hey/data/enums";
import type { Dispatch, SetStateAction } from "react";

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
      tabs={tabs}
      active={feedType}
      setActive={(type) => setFeedType(type as AccountFeedType)}
      className="mx-5 mb-5 md:mx-0"
      layoutId="account-tabs"
    />
  );
};

export default FeedType;
