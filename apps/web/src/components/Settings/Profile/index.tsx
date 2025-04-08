import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
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
    <PageLayout
      title="Profile settings"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      <AccountSettingsForm />
    </PageLayout>
  );
};

export default ProfileSettings;
