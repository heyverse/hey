import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
import WrongWallet from "@/components/Shared/Settings/WrongWallet";
import {} from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useAccount } from "wagmi";
import SettingsSidebar from "../Sidebar";
import DeleteSettings from "./Delete";

const DangerSettings = () => {
  const { currentAccount } = useAccountStore();
  const { address } = useAccount();
  const disabled = currentAccount?.owner !== address;

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout
      title="Delete account"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      {disabled ? <WrongWallet /> : <DeleteSettings />}
    </PageLayout>
  );
};

export default DangerSettings;
