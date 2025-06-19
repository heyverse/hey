import { createPersistedTrackedStore } from "@/store/createTrackedStore";
import { Localstorage } from "@hey/data/storage";
import type { AccountFragment } from "@hey/indexer";

interface State {
  currentAccount?: AccountFragment;
  setCurrentAccount: (currentAccount?: AccountFragment) => void;
  hydrateAccount: () => AccountFragment | undefined;
}

const { useStore: useAccountStore, store } = createPersistedTrackedStore<State>(
  (set, get) => ({
    currentAccount: undefined,
    setCurrentAccount: (currentAccount?: AccountFragment) =>
      set(() => ({ currentAccount })),
    hydrateAccount: () => get().currentAccount
  }),
  { name: Localstorage.AccountStore }
);

export { useAccountStore };
export const hydrateAccount = () => store.getState().hydrateAccount();
