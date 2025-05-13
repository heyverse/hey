import Footer from "@/components/Shared/Footer";
import { PageLayout } from "@/components/Shared/PageLayout";
import ContentFeedType from "@/components/Shared/Post/ContentFeedType";
import WhoToFollow from "@/components/Shared/Sidebar/WhoToFollow";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { MainContentFocus } from "@hey/indexer";
import { useState } from "react";
import ExploreFeed from "./ExploreFeed";

const Explore = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  return (
    <PageLayout
      title="Explore"
      sidebar={
        <>
          {currentAccount ? <WhoToFollow /> : null}
          <Footer />
        </>
      }
    >
      <ContentFeedType
        focus={focus}
        setFocus={setFocus}
        layoutId="explore_tab"
      />
      <ExploreFeed focus={focus} />
    </PageLayout>
  );
};

export default Explore;
