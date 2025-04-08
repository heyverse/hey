import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
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
    <PageLayout
      title="Account settings"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      <SuperFollow />
    </PageLayout>
  );
};

export default AccountSettings;
