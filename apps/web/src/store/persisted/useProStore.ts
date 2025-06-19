import { createPersistedTrackedStore } from "@/store/createTrackedStore";
import { Localstorage } from "@hey/data/storage";

interface State {
  proBannerDismissed: boolean;
  setProBannerDismissed: (proBannerDismissed: boolean) => void;
}

const { useStore: useProStore } = createPersistedTrackedStore<State>(
  (set) => ({
    proBannerDismissed: false,
    setProBannerDismissed: (proBannerDismissed: boolean) =>
      set(() => ({ proBannerDismissed }))
  }),
  { name: Localstorage.ProStore }
);

export { useProStore };
