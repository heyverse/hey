import FeedFocusType from "@/components/Shared/FeedFocusType";
import Footer from "@/components/Shared/Footer";
import WhoToFollow from "@/components/Shared/Sidebar/WhoToFollow";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {} from "@headlessui/react";
import { MainContentFocus } from "@hey/indexer";
import { useState } from "react";
import { PageLayout } from "../Shared/PageLayout";
import ExploreFeed from "./ExploreFeed";
import ImageFeed from "./ImageFeed";

const Explore = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  return (
    <PageLayout
      title="Explore"
      sidebar={
        <>
          {/* <Gitcoin /> */}
          {currentAccount ? <WhoToFollow /> : null}
          <Footer />
        </>
      }
      sidebarPosition="right"
      showSearch
    >
      <FeedFocusType focus={focus} setFocus={setFocus} />
      {focus === MainContentFocus.Image ? (
        <ImageFeed />
      ) : (
        <ExploreFeed focus={focus} />
      )}
    </PageLayout>
  );
};

export default Explore;
