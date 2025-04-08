import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
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
    <PageLayout
      title="Developer settings"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      <Tokens />
    </PageLayout>
  );
};

export default DeveloperSettings;
