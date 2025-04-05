import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { NotificationFeedType } from "@hey/data/enums";
import { useSearchParams } from "react-router";
import Sidebar from "../Home/Sidebar";
import { GeneralPageLayout } from "../Shared/PageLayout";
import FeedType from "./FeedType";
import List from "./List";
import Settings from "./Settings";

const Notification = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || NotificationFeedType.All;
  const { currentAccount } = useAccountStore();

  const lowerCaseNotificationFeedType = [
    NotificationFeedType.All.toLowerCase(),
    NotificationFeedType.Mentions.toLowerCase(),
    NotificationFeedType.Comments.toLowerCase(),
    NotificationFeedType.Likes.toLowerCase(),
    NotificationFeedType.PostActions.toLowerCase()
  ];

  const feedType = type
    ? lowerCaseNotificationFeedType.includes(type as string)
      ? type.toString().toUpperCase()
      : NotificationFeedType.All
    : NotificationFeedType.All;

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GeneralPageLayout title="Notifications" sidebar={<Sidebar />}>
      <div className="flex flex-wrap justify-between gap-3 pb-2">
        <FeedType feedType={feedType as NotificationFeedType} />
        <Settings />
      </div>
      <List feedType={feedType} />
    </GeneralPageLayout>
  );
};

export default Notification;
