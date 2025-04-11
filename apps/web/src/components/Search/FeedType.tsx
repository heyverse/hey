import { Tabs } from "@/components/Shared/UI";
import { useSearchParams } from "react-router";

export enum SearchTabFocus {
  Accounts = "ACCOUNTS",
  Posts = "POSTS"
}

interface FeedTypeProps {
  feedType: SearchTabFocus;
}

const FeedType = ({ feedType }: FeedTypeProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = [
    { name: "Accounts", type: SearchTabFocus.Accounts },
    { name: "Posts", type: SearchTabFocus.Posts }
  ];

  const updateQuery = (type?: string) => {
    if (!type) {
      return;
    }

    searchParams.set("type", type);
    setSearchParams(searchParams);
  };

  return (
    <Tabs
      tabs={tabs}
      active={feedType}
      setActive={updateQuery}
      className="mx-5 mb-5 md:mx-0"
      layoutId="notification-tabs"
    />
  );
};

export default FeedType;
