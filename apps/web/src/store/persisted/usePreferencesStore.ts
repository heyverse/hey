import { createPersistedTrackedStore } from "@/store/createTrackedStore";
import { Localstorage } from "@hey/data/storage";

interface State {
  appIcon: number;
  includeLowScore: boolean;
  resetPreferences: () => void;
  setAppIcon: (appIcon: number) => void;
  setIncludeLowScore: (includeLowScore: boolean) => void;
}

const { useStore: usePreferencesStore } = createPersistedTrackedStore<State>(
  (set) => ({
    appIcon: 0,
    includeLowScore: false,
    resetPreferences: () => set(() => ({ includeLowScore: false })),
    setAppIcon: (appIcon) => set(() => ({ appIcon })),
    setIncludeLowScore: (includeLowScore) => set(() => ({ includeLowScore }))
  }),
  { name: Localstorage.PreferencesStore }
);

export { usePreferencesStore };
