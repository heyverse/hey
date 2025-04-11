import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { NotificationFeedType } from "@hey/data/enums";
import { useState } from "react";
import FeedType from "./FeedType";
import List from "./List";

const Notification = () => {
  const { currentAccount } = useAccountStore();
  const [feedType, setFeedType] = useState<NotificationFeedType>(
    NotificationFeedType.All
  );

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Notifications">
      <FeedType feedType={feedType} setFeedType={setFeedType} />
      <List feedType={feedType} />
    </PageLayout>
  );
};

export default Notification;
