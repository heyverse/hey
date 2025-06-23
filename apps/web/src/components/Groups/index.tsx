import { GroupsFeedType } from "@hey/data/enums";
import { useState } from "react";
import CreateGroup from "@/components/Groups/Sidebar/Create/CreateGroup";
import Footer from "@/components/Shared/Footer";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { Card } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import FeedType from "./FeedType";
import List from "./List";

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
      sidebar={
        <>
          <CreateGroup />
          <Footer />
        </>
      }
      title="Groups"
    >
      <FeedType feedType={feedType} setFeedType={setFeedType} />
      <Card>
        <List feedType={feedType} />
      </Card>
    </PageLayout>
  );
};

export default Groups;
