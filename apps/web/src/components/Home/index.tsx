import NewPost from "@/components/Composer/NewPost";
import ExploreFeed from "@/components/Explore/ExploreFeed";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useHomeTabStore } from "@/store/persisted/useHomeTabStore";
import { APP_NAME } from "@hey/data/constants";
import { HomeFeedType } from "@hey/data/enums";
import { GeneralPageLayout } from "../Shared/PageLayout";
import Sidebar from "../Shared/Sidebar";
import FeedType from "./FeedType";
import ForYou from "./ForYou";
import Hero from "./Hero";
import Highlights from "./Highlights";
import Timeline from "./Timeline";

const Home = () => {
  const { currentAccount } = useAccountStore();
  const { feedType } = useHomeTabStore();

  const loggedInWithProfile = Boolean(currentAccount);

  return (
    <GeneralPageLayout title={APP_NAME} sidebar={<Sidebar />}>
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
        <>
          <Hero />
          <ExploreFeed />
        </>
      )}
    </GeneralPageLayout>
  );
};

export default Home;
