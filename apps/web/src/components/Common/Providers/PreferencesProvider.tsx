import { hono } from "@/helpers/fetcher";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface PreferencesProviderProps {
  children: ReactNode;
}

const PreferencesProvider = ({ children }: PreferencesProviderProps) => {
  const { currentAccount } = useAccountStore();
  const { setAppIcon, setIncludeLowScore } = usePreferencesStore();

  const { data: preferences } = useQuery({
    queryFn: () => hono.preferences.get(),
    queryKey: ["preferences", currentAccount?.address],
    enabled: Boolean(currentAccount?.address)
  });

  useEffect(() => {
    if (preferences) {
      setIncludeLowScore(preferences.includeLowScore);
      setAppIcon(preferences.appIcon);
    }
  }, [preferences]);

  return <>{children}</>;
};

export default PreferencesProvider;
