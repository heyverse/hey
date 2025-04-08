import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import List from "./List";

const SessionsSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout
      title="Sessions settings"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      <Card>
        <CardHeader
          body="This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize."
          title="Sessions"
        />
        <List />
      </Card>
    </PageLayout>
  );
};

export default SessionsSettings;
