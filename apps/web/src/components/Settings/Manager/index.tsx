import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import { SettingsPageLayout } from "@/components/Shared/PageLayout";
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
    <SettingsPageLayout title="Manager settings" sidebar={<SettingsSidebar />}>
      <div className="space-y-5">
        {disabled ? (
          <WrongWallet />
        ) : (
          <>
            <Signless />
            <AccountManager />
          </>
        )}
      </div>
    </SettingsPageLayout>
  );
};

export default ManagerSettings;
