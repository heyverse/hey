import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import ProFeatureNotice from "@/components/Shared/ProFeatureNotice";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SuperFollow from "./SuperFollow";

const MonetizeSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Monetize settings">
      {currentAccount?.hasSubscribed ? (
        <SuperFollow />
      ) : (
        <Card>
          <CardHeader
            icon={<BackButton path="/settings" />}
            title="Super Follow"
          />
          <ProFeatureNotice className="m-5" feature="super follow settings" />
        </Card>
      )}
    </PageLayout>
  );
};

export default MonetizeSettings;
