import FullPageLoader from "@/components/Shared/FullPageLoader";
import GlobalAlerts from "@/components/Shared/GlobalAlerts";
import GlobalModals from "@/components/Shared/GlobalModals";
import Navbar from "@/components/Shared/Navbar";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
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
import { Outlet, useLocation } from "react-router";

const Layout = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { resetPreferences } = usePreferencesStore();
  const { resetStatus } = useAccountStatus();
  const isMounted = useIsClient();
  const { address: sessionAccountAddress } = getCurrentSession();

  // Disable scroll restoration on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
    <>
      <Toaster
        containerStyle={{ wordBreak: "break-word" }}
        position="bottom-right"
        toastOptions={getToastOptions(theme)}
      />
      <GlobalModals />
      <GlobalAlerts />
      <div className="mx-auto flex w-full max-w-6xl items-start gap-x-8 px-0 md:px-5">
        <Navbar />
        <Outlet />
        <BottomNavigation />
      </div>
    </>
  );
};

export default Layout;
