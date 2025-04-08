import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { PageLayout } from "@/components/Shared/PageLayout";
import WrongWallet from "@/components/Shared/Settings/WrongWallet";
import {} from "@/components/Shared/UI";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { useAccount } from "wagmi";
import SettingsSidebar from "../Sidebar";
import AccountManager from "./AccountManager";
import Signless from "./Signless";

const ManagerSettings = () => {
  const { currentAccount } = useAccountStore();
  const { address } = useAccount();
  const disabled = currentAccount?.owner !== address;

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout
      title="Manager settings"
      sidebar={<SettingsSidebar />}
      sidebarPosition="left"
    >
      {disabled ? (
        <WrongWallet />
      ) : (
        <>
          <Signless />
          <AccountManager />
        </>
      )}
    </PageLayout>
  );
};

export default ManagerSettings;
