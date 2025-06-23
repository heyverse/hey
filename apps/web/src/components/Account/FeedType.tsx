import { AccountFeedType } from "@hey/data/enums";
import generateUUID from "@hey/helpers/generateUUID";
import type { Dispatch, SetStateAction } from "react";
import { Tabs } from "@/components/Shared/UI";

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
      setActive={(type) => setFeedType(type as AccountFeedType)}
      tabs={tabs}
    />
  );
};

export default FeedType;
