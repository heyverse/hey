import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
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
    <PageLayout
      title="Username settings"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      <UnlinkUsername />
      <LinkUsername />
    </PageLayout>
  );
};

export default UsernameSettings;
