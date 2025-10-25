import CreatorCoinForm from "@/components/Settings/CreatorCoin/CreatorCoin";
import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const CreatorCoinSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Creator Coin settings">
      <Card>
        <CardHeader
          icon={<BackButton path="/settings" />}
          title="Creator Coin"
        />
        <div className="p-5">
          <CreatorCoinForm />
        </div>
      </Card>
    </PageLayout>
  );
};

export default CreatorCoinSettings;
