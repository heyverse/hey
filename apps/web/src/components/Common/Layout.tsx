import FullPageLoader from "@/components/Shared/FullPageLoader";
import GlobalAlerts from "@/components/Shared/GlobalAlerts";
import GlobalBanners from "@/components/Shared/GlobalBanners";
import BottomNavigation from "@/components/Shared/Navbar/BottomNavigation";
import getCurrentSession from "@/helpers/getCurrentSession";
import getToastOptions from "@/helpers/getToastOptions";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { signOut } from "@/store/persisted/useAuthStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { useMeQuery } from "@hey/indexer";
import { useIsClient } from "@uidotdev/usehooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import GlobalModals from "../Shared/GlobalModals";
import Navbar from "../Shared/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { reload } = useRouter();
  const { resolvedTheme } = useTheme();
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
      reload();
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
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <GlobalModals />
      <GlobalAlerts />
      <div className="flex min-h-screen flex-col pb-14 md:pb-0">
        <Navbar />
        <GlobalBanners />
        <BottomNavigation />
        {children}
      </div>
    </main>
  );
};

export default Layout;
