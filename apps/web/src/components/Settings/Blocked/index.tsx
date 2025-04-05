import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
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
    <SettingsPageLayout title="Blocked accounts" sidebar={<SettingsSidebar />}>
      <Card>
        <CardHeader
          body="This is a list of blocked accounts. You can unblock them at any time."
          title="Blocked accounts"
        />
        <List />
      </Card>
    </SettingsPageLayout>
  );
};

export default BlockedSettings;
