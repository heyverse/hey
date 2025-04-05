import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
import {} from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import Tokens from "./Tokens";

const DeveloperSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <SettingsPageLayout
      title="Developer settings"
      sidebar={<SettingsSidebar />}
    >
      <Tokens />
    </SettingsPageLayout>
  );
};

export default DeveloperSettings;
