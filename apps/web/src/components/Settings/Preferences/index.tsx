import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
import { Card, CardHeader } from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { APP_NAME } from "@hey/data/constants";
import SettingsSidebar from "../Sidebar";
import AppIcon from "./AppIcon";
import IncludeLowScore from "./IncludeLowScore";

const PreferencesSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <SettingsPageLayout
      title="Preferences settings"
      sidebar={<SettingsSidebar />}
    >
      <div className="space-y-5">
        <Card>
          <CardHeader
            body={`Update your preferences to control how you can change your
            experience on ${APP_NAME}.`}
            title="Your Preferences"
          />
          <div className="m-5 space-y-5">
            <IncludeLowScore />
          </div>
        </Card>
        <AppIcon />
      </div>
    </SettingsPageLayout>
  );
};

export default PreferencesSettings;
