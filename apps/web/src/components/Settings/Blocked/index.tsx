import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import List from "./List";

const BlockedSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout
      title="Blocked accounts"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      <Card>
        <CardHeader
          body="This is a list of blocked accounts. You can unblock them at any time."
          title="Blocked accounts"
        />
        <List />
      </Card>
    </PageLayout>
  );
};

export default BlockedSettings;
