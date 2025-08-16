import { useSearchParams } from "react-router";
import { Tabs } from "@/components/Shared/UI";

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
      active={feedType}
      className="mx-5 mb-5 md:mx-0"
      layoutId="search_tab"
      setActive={updateQuery}
      tabs={tabs}
    />
  );
};

export default FeedType;
