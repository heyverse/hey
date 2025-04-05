import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import LinkUsername from "./LinkUsername";
import UnlinkUsername from "./UnlinkUsername";

const UsernameSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <SettingsPageLayout title="Username settings" sidebar={<SettingsSidebar />}>
      <div className="space-y-5">
        <UnlinkUsername />
        <LinkUsername />
      </div>
    </SettingsPageLayout>
  );
};

export default UsernameSettings;
