import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useProStore } from "@/store/persisted/useProStore";
import { SparklesIcon } from "@heroicons/react/24/solid";
import SuperFollow from "./SuperFollow";

const MonetizeSettings = () => {
  const { currentAccount } = useAccountStore();
  const { isPro } = useProStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Monetize settings">
      {isPro ? (
        <SuperFollow />
      ) : (
        <Card>
          <CardHeader
            icon={<BackButton path="/settings" />}
            title="Super Follow"
          />
          <div className="m-5 flex items-center gap-x-2 text-gray-500 text-sm">
            <SparklesIcon className="size-4" />
            <span>Upgrade to Pro to unlock super follow settings</span>
          </div>
        </Card>
      )}
    </PageLayout>
  );
};

export default MonetizeSettings;
