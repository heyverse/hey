import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
import {} from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import SuperFollow from "./SuperFollow";

const AccountSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <SettingsPageLayout title="Account settings" sidebar={<SettingsSidebar />}>
      <SuperFollow />
    </SettingsPageLayout>
  );
};

export default AccountSettings;
