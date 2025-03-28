import MetaTags from "@/components/Common/MetaTags";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import {
  Card,
  CardHeader,
  GridItemEight,
  GridItemFour,
  GridLayout
} from "@/components/Shared/UI";
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
    <GridLayout>
      <MetaTags title={`Preferences settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
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
      </GridItemEight>
    </GridLayout>
  );
};

export default PreferencesSettings;
