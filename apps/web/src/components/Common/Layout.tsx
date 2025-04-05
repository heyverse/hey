import FullPageLoader from "@/components/Shared/FullPageLoader";
import GlobalAlerts from "@/components/Shared/GlobalAlerts";
import getCurrentSession from "@/helpers/getCurrentSession";
import getToastOptions from "@/helpers/getToastOptions";
import { useTheme } from "@/hooks/useTheme";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { signOut } from "@/store/persisted/useAuthStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { useMeQuery } from "@hey/indexer";
import { useIsClient } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import GlobalModals from "../Shared/GlobalModals";
import Navbar from "../Shared/Navbar";
import BottomNavigation from "../Shared/Navbar/BottomNavigation";

const Layout = () => {
  const { theme } = useTheme();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { resetPreferences } = usePreferencesStore();
  const { resetStatus } = useAccountStatus();
  const isMounted = useIsClient();
  const { address: sessionAccountAddress } = getCurrentSession();

  const logout = (shouldReload = false) => {
    resetPreferences();
    resetStatus();
    signOut();
    if (shouldReload) {
      location.reload();
    }
  };

  const { loading } = useMeQuery({
    onCompleted: ({ me }) => setCurrentAccount(me.loggedInAs.account),
    onError: () => logout(true),
    skip: !sessionAccountAddress
  });

  useEffect(() => {
    if (!sessionAccountAddress) {
      logout();
    }
  }, []);

  const profileLoading = !currentAccount && loading;

  if (profileLoading || !isMounted) {
    return <FullPageLoader />;
  }

  return (
    <main>
      <Toaster
        containerStyle={{ wordBreak: "break-word" }}
        position="bottom-right"
        toastOptions={getToastOptions(theme)}
      />
      <GlobalModals />
      <GlobalAlerts />
      <div className="mx-auto flex w-full max-w-6xl items-start gap-x-8">
        <Navbar />
        <Outlet />
        <BottomNavigation />
      </div>
    </main>
  );
};

export default Layout;
