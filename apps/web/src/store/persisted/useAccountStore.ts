import { Localstorage } from "@hey/data/storage";
import type { AccountFragment } from "@hey/indexer";
import { createPersistedTrackedStore } from "@/store/createTrackedStore";

interface State {
  currentAccount?: AccountFragment;
  setCurrentAccount: (currentAccount?: AccountFragment) => void;
  hydrateAccount: () => AccountFragment | undefined;
}

const { useStore: useAccountStore, store } = createPersistedTrackedStore<State>(
  (set, get) => ({
    currentAccount: undefined,
    hydrateAccount: () => get().currentAccount,
    setCurrentAccount: (currentAccount?: AccountFragment) =>
      set(() => ({ currentAccount }))
  }),
  { name: Localstorage.AccountStore }
);

export { useAccountStore };
export const hydrateAccount = () => store.getState().hydrateAccount();
