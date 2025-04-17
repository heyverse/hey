import { hono } from "@/helpers/fetcher";
import getCurrentSession from "@/helpers/getCurrentSession";
import { usePreferencesStore } from "@/store/persisted/usePreferencesStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const PreferencesProvider = () => {
  const { address: sessionAccountAddress } = getCurrentSession();
  const { setAppIcon, setIncludeLowScore } = usePreferencesStore();

  const { data: preferences } = useQuery({
    queryFn: () => hono.preferences.get(),
    queryKey: ["preferences", sessionAccountAddress],
    enabled: Boolean(sessionAccountAddress)
  });

  useEffect(() => {
    if (preferences) {
      setIncludeLowScore(preferences.includeLowScore);
      setAppIcon(preferences.appIcon);
    }
  }, [preferences]);

  return null;
};

export default PreferencesProvider;
