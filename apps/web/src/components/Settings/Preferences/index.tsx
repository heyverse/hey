import BackButton from "@/components/Shared/BackButton";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import AppIcon from "./AppIcon";
import IncludeLowScore from "./IncludeLowScore";

const PreferencesSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Preferences settings">
      <Card>
        <CardHeader
          icon={<BackButton path="/settings" />}
          title="Preferences"
        />
        <IncludeLowScore />
        <div className="divider" />
        <AppIcon />
      </Card>
    </PageLayout>
  );
};

export default PreferencesSettings;
