import FullPageLoader from "@/components/Shared/FullPageLoader";
import GlobalAlerts from "@/components/Shared/GlobalAlerts";
import GlobalModals from "@/components/Shared/GlobalModals";
import GlobalShortcuts from "@/components/Shared/GlobalShortcuts";
import Navbar from "@/components/Shared/Navbar";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import { Spinner } from "@/components/Shared/UI";
import checkProStatus from "@/helpers/checkProStatus";
import { useTheme } from "@/hooks/useTheme";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { hydrateAuthTokens, signOut } from "@/store/persisted/useAuthStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { useProStore } from "@/store/persisted/useProStore";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { PRO_POST_ID } from "@hey/data/constants";
import { type ProFragment, useMeQuery } from "@hey/indexer";
import { useIsClient } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Toaster, type ToasterProps } from "sonner";

const Layout = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { setProStatus } = useProStore();
  const { resetPreferences } = usePreferencesStore();
  const isMounted = useIsClient();
  const { accessToken } = hydrateAuthTokens();

  // Disable scroll restoration on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const onError = () => {
    resetPreferences();
    signOut();
    location.reload();
  };

  const { loading } = useMeQuery({
    variables: { request: { post: PRO_POST_ID } },
    onCompleted: ({ me, pro }) => {
      setCurrentAccount(me.loggedInAs.account);
      setProStatus(checkProStatus(pro as ProFragment));
    },
    onError,
    skip: !accessToken
  });

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
      <GlobalShortcuts />
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
