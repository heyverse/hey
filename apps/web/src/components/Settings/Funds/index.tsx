import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
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
    <PageLayout
      title="Funds settings"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      <Card>
        <CardHeader
          title="Manage account balances"
          body="Withdraw or deposit funds from your account."
        />
        <Balances />
      </Card>
    </PageLayout>
  );
};

export default FundsSettings;
