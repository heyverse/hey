import FeedFocusType from "@/components/Shared/FeedFocusType";
import Footer from "@/components/Shared/Footer";
import WhoToFollow from "@/components/Shared/Sidebar/WhoToFollow";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {} from "@headlessui/react";
import { MainContentFocus } from "@hey/indexer";
import { useState } from "react";
import { GeneralPageLayout } from "../Shared/PageLayout";
import ExploreFeed from "./ExploreFeed";
import ImageFeed from "./ImageFeed";

const Explore = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  return (
    <GeneralPageLayout
      title="Explore"
      sidebar={
        <>
          {/* <Gitcoin /> */}
          {currentAccount ? <WhoToFollow /> : null}
          <Footer />
        </>
      }
    >
      <FeedFocusType focus={focus} setFocus={setFocus} />
      {focus === MainContentFocus.Image ? (
        <ImageFeed />
      ) : (
        <ExploreFeed focus={focus} />
      )}
    </GeneralPageLayout>
  );
};

export default Explore;
