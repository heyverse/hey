import WhoToFollow from "@/components/Home/Sidebar/WhoToFollow";
import FeedFocusType from "@/components/Shared/FeedFocusType";
import Footer from "@/components/Shared/Footer";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import {} from "@headlessui/react";
import { MainContentFocus } from "@hey/indexer";
import { useState } from "react";
import SidebarWithSearch from "../Shared/SidebarWithSearch/SidebarWithSearch";
import ExploreFeed from "./ExploreFeed";
import ImageFeed from "./ImageFeed";

const Explore = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  return (
    <>
      <div className="mt-10 flex-1 space-y-5">
        <FeedFocusType focus={focus} setFocus={setFocus} />
        {focus === MainContentFocus.Image ? (
          <ImageFeed />
        ) : (
          <ExploreFeed focus={focus} />
        )}
      </div>
      <SidebarWithSearch>
        {/* <Gitcoin /> */}
        {currentAccount ? <WhoToFollow /> : null}
        <Footer />
      </SidebarWithSearch>
    </>
  );
};

export default Explore;
