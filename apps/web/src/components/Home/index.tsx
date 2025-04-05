import NewPost from "@/components/Composer/NewPost";
import ExploreFeed from "@/components/Explore/ExploreFeed";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useHomeTabStore } from "@/store/persisted/useHomeTabStore";
import { APP_NAME } from "@hey/data/constants";
import { HomeFeedType } from "@hey/data/enums";
import MetaTags from "../Common/MetaTags";
import SidebarWithSearch from "../Shared/SidebarWithSearch/SidebarWithSearch";
import FeedType from "./FeedType";
import ForYou from "./ForYou";
import Highlights from "./Highlights";
import Sidebar from "./Sidebar";
import Timeline from "./Timeline";

const Home = () => {
  const { currentAccount } = useAccountStore();
  const { feedType } = useHomeTabStore();

  const loggedInWithProfile = Boolean(currentAccount);

  return (
    <>
      <MetaTags title={APP_NAME} />
      <div className="mt-10 flex-1 space-y-5">
        {loggedInWithProfile ? (
          <>
            <FeedType />
            <NewPost />
            {feedType === HomeFeedType.FOLLOWING ? (
              <Timeline />
            ) : feedType === HomeFeedType.HIGHLIGHTS ? (
              <Highlights />
            ) : feedType === HomeFeedType.FORYOU ? (
              <ForYou />
            ) : null}
          </>
        ) : (
          <ExploreFeed />
        )}
      </div>
      <SidebarWithSearch>
        <Sidebar />
      </SidebarWithSearch>
    </>
  );
};

export default Home;
