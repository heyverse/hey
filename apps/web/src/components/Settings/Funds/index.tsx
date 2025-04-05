import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import Balances from "./Balances";

const FundsSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <SettingsPageLayout title="Funds settings" sidebar={<SettingsSidebar />}>
      <Card>
        <CardHeader
          title="Manage account balances"
          body="Withdraw or deposit funds from your account."
        />
        <Balances />
      </Card>
    </SettingsPageLayout>
  );
};

export default FundsSettings;
