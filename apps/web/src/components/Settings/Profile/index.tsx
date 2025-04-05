import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
import {} from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import SettingsSidebar from "../Sidebar";
import AccountSettingsForm from "./Account";

const ProfileSettings = () => {
  const { currentAccount } = useAccountStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <SettingsPageLayout title="Profile settings" sidebar={<SettingsSidebar />}>
      <AccountSettingsForm />
    </SettingsPageLayout>
  );
};

export default ProfileSettings;
