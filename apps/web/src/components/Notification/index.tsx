import MetaTags from "@/components/Common/MetaTags";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { APP_NAME } from "@hey/data/constants";
import { NotificationFeedType } from "@hey/data/enums";
import { useSearchParams } from "react-router";
import Sidebar from "../Home/Sidebar";
import SidebarWithSearch from "../Shared/SidebarWithSearch/SidebarWithSearch";
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
    <>
      <MetaTags title={`Notifications • ${APP_NAME}`} />
      <div className="mt-10 flex-1 space-y-5">
        <div className="flex flex-wrap justify-between gap-3 pb-2">
          <FeedType feedType={feedType as NotificationFeedType} />
          <Settings />
        </div>
        <List feedType={feedType} />
      </div>
      <SidebarWithSearch>
        <Sidebar />
      </SidebarWithSearch>
    </>
  );
};

export default Notification;
