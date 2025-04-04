import MetaTags from "@/components/Common/MetaTags";
import Footer from "@/components/Shared/Footer";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import {
  Card,
  GridItemEight,
  GridItemFour,
  GridLayout
} from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { APP_NAME } from "@hey/data/constants";
import { useState } from "react";
import List from "./List";
import ListFocusType from "./ListFocusType";
import CreateGroup from "./Sidebar/Create/CreateGroup";

export enum GroupsTabFocus {
  Member = "MEMBER",
  Managed = "MANAGED"
}

const Groups = () => {
  const { currentAccount } = useAccountStore();
  const [focus, setFocus] = useState<GroupsTabFocus>(GroupsTabFocus.Member);

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Groups • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <ListFocusType focus={focus} setFocus={setFocus} />
        <Card>
          <List focus={focus} />
        </Card>
      </GridItemEight>
      <GridItemFour>
        <CreateGroup />
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Groups;
