import type { MainContentFocus } from "@hey/indexer";
import { useState } from "react";
import Footer from "@/components/Shared/Footer";
import PageLayout from "@/components/Shared/PageLayout";
import ContentFeedType from "@/components/Shared/Post/ContentFeedType";
import WhoToFollow from "@/components/Shared/Sidebar/WhoToFollow";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import ExploreFeed from "./ExploreFeed";

const Explore = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  return (
    <PageLayout
      sidebar={
        <>
          {currentAccount ? <WhoToFollow /> : null}
          <Footer />
        </>
      }
      title="Explore"
    >
      <ContentFeedType
        focus={focus}
        layoutId="explore_tab"
        setFocus={setFocus}
      />
      <ExploreFeed focus={focus} />
    </PageLayout>
  );
};

export default Explore;
