import Footer from "@/components/Shared/Footer";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { Card } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { GroupsFeedType } from "@hey/data/enums";
import { useState } from "react";
import FeedType from "./FeedType";
import List from "./List";
import CreateGroup from "./Sidebar/Create/CreateGroup";

const Groups = () => {
  const { currentAccount } = useAccountStore();
  const [feedType, setFeedType] = useState<GroupsFeedType>(
    GroupsFeedType.Managed
  );

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout
      title="Groups"
      sidebar={
        <>
          <CreateGroup />
          <Footer />
        </>
      }
    >
      <FeedType feedType={feedType} setFeedType={setFeedType} />
      <Card>
        <List feedType={feedType} />
      </Card>
    </PageLayout>
  );
};

export default Groups;
