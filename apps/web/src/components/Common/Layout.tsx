import FullPageLoader from "@/components/Shared/FullPageLoader";
import GlobalAlerts from "@/components/Shared/GlobalAlerts";
import GlobalModals from "@/components/Shared/GlobalModals";
import Navbar from "@/components/Shared/Navbar";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import getCurrentSession from "@/helpers/getCurrentSession";
import { useTheme } from "@/hooks/useTheme";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { signOut } from "@/store/persisted/useAuthStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useMeQuery } from "@hey/indexer";
import { useIsClient } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Toaster, type ToasterProps } from "sonner";
import { Spinner } from "../Shared/UI";

const Layout = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { resetPreferences } = usePreferencesStore();
  const isMounted = useIsClient();
  const { address: sessionAccountAddress } = getCurrentSession();

  // Disable scroll restoration on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const logout = (shouldReload = false) => {
    resetPreferences();
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
  }, [sessionAccountAddress]);

  const accountLoading = !currentAccount && loading;

  if (accountLoading || !isMounted) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        theme={theme as ToasterProps["theme"]}
        toastOptions={{
          className: "font-sofia-pro",
          style: { boxShadow: "none", fontSize: "16px" }
        }}
        icons={{
          success: <CheckCircleIcon className="size-5" />,
          error: <XCircleIcon className="size-5" />,
          loading: <Spinner size="xs" />
        }}
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
