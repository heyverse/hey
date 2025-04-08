import FeedFocusType from "@/components/Shared/FeedFocusType";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import {} from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import type { MainContentFocus } from "@hey/indexer";
import { useState } from "react";
import { PageLayout } from "../Shared/PageLayout";
import Sidebar from "../Shared/Sidebar";
import BookmarksFeed from "./BookmarksFeed";

const Bookmarks = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<MainContentFocus>();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout
      title="Bookmarks"
      sidebar={<Sidebar />}
      sidebarPosition="right"
      showSearch
    >
      <FeedFocusType focus={focus} setFocus={setFocus} />
      <BookmarksFeed focus={focus} />
    </PageLayout>
  );
};

export default Bookmarks;
