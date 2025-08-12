import { HomeFeedType } from "@hey/data/enums";
import { lazy, Suspense } from "react";
import Loader from "@/components/Shared/Loader";
import PageLayout from "@/components/Shared/PageLayout";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useHomeTabStore } from "@/store/persisted/useHomeTabStore";
import FeedType from "./FeedType";
import Hero from "./Hero";

const NewPost = lazy(() => import("@/components/Composer/NewPost"));
const ExploreFeed = lazy(() => import("@/components/Explore/ExploreFeed"));
const ForYou = lazy(() => import("./ForYou"));
const Highlights = lazy(() => import("./Highlights"));
const Timeline = lazy(() => import("./Timeline"));

const Home = () => {
  const { currentAccount } = useAccountStore();
  const { feedType } = useHomeTabStore();
  const loggedInWithAccount = Boolean(currentAccount);

  return (
    <PageLayout>
      {loggedInWithAccount ? (
        <>
          <FeedType />
          <Suspense
            fallback={<Loader className="my-10" message="Loading composer" />}
          >
            <NewPost />
          </Suspense>
          <Suspense
            fallback={<Loader className="my-10" message="Loading feed" />}
          >
            {feedType === HomeFeedType.FOLLOWING ? (
              <Timeline />
            ) : feedType === HomeFeedType.HIGHLIGHTS ? (
              <Highlights />
            ) : feedType === HomeFeedType.FORYOU ? (
              <ForYou />
            ) : null}
          </Suspense>
        </>
      ) : (
        <>
          <Hero />
          <Suspense
            fallback={<Loader className="my-10" message="Loading posts" />}
          >
            <ExploreFeed />
          </Suspense>
        </>
      )}
    </PageLayout>
  );
};

export default Home;
