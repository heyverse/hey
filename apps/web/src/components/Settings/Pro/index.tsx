import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import ProFeatureNotice from "@/components/Shared/ProFeatureNotice";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import DefaultToNameSetting from "./DefaultToNameSetting";

const ProSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Pro settings">
      <Card>
        <CardHeader icon={<BackButton path="/settings" />} title="Pro" />
        {currentAccount.hasSubscribed ? (
          <div className="space-y-4 p-5">
            <DefaultToNameSetting />
          </div>
        ) : (
          <ProFeatureNotice className="m-5" feature="pro settings" />
        )}
      </Card>
    </PageLayout>
  );
};

export default ProSettings;
