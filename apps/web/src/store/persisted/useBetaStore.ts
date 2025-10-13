import { Localstorage } from "@hey/data/storage";
import { createPersistedTrackedStore } from "@/store/createTrackedStore";

interface State {
  betaBannerDismissed: boolean;
  setBetaBannerDismissed: (betaBannerDismissed: boolean) => void;
}

const { useStore: useBetaStore } = createPersistedTrackedStore<State>(
  (set) => ({
    betaBannerDismissed: false,
    setBetaBannerDismissed: (betaBannerDismissed: boolean) =>
      set(() => ({ betaBannerDismissed }))
  }),
  { name: Localstorage.BetaStore }
);

export { useBetaStore };
