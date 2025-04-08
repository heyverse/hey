import Footer from "@/components/Shared/Footer";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { Card } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useState } from "react";
import { PageLayout } from "../Shared/PageLayout";
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
    <PageLayout
      title="Groups"
      sidebar={
        <>
          <CreateGroup />
          <Footer />
        </>
      }
      sidebarPosition="right"
      showSearch
    >
      <ListFocusType focus={focus} setFocus={setFocus} />
      <Card>
        <List focus={focus} />
      </Card>
    </PageLayout>
  );
};

export default Groups;
