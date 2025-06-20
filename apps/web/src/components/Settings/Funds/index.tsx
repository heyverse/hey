import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import Balances from "./Balances";

const FundsSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Funds settings">
      <Card>
        <CardHeader
          icon={<BackButton path="/settings" />}
          title="Manage account balances"
        />
        <Balances />
      </Card>
    </PageLayout>
  );
};

export default FundsSettings;
