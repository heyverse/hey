import { hono } from "@/helpers/fetcher";
import getCurrentSession from "@/helpers/getCurrentSession";
import { useAccountStatus } from "@/store/non-persisted/useAccountStatus";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { Permission } from "@hey/data/permissions";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const PreferencesProvider = () => {
  const { address: sessionAccountAddress } = getCurrentSession();
  const { setAppIcon, setIncludeLowScore } = usePreferencesStore();
  const { setStatus } = useAccountStatus();

  const { data: preferences } = useQuery({
    queryFn: () => hono.preferences.get(),
    queryKey: ["preferences", sessionAccountAddress],
    enabled: Boolean(sessionAccountAddress)
  });

  useEffect(() => {
    if (preferences) {
      setIncludeLowScore(preferences.includeLowScore);
      setAppIcon(preferences.appIcon);
      setStatus({
        isSuspended: preferences.permissions.includes(Permission.Suspended)
      });
    }
  }, [preferences]);

  return null;
};

export default PreferencesProvider;
