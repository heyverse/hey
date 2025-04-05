import FeedFocusType from "@/components/Shared/FeedFocusType";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import {} from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { MainContentFocus } from "@hey/indexer";
import { useState } from "react";
import Sidebar from "../Home/Sidebar";
import { GeneralPageLayout } from "../Shared/PageLayout";
import BookmarksFeed from "./BookmarksFeed";

const Bookmarks = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GeneralPageLayout title="Bookmarks" sidebar={<Sidebar />}>
      <FeedFocusType focus={focus} setFocus={setFocus} />
      <BookmarksFeed focus={focus} />
    </GeneralPageLayout>
  );
};

export default Bookmarks;
