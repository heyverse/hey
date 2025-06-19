import { createTrackedStore } from "@/store/createTrackedStore";
import type { AccountFragment } from "@hey/indexer";

interface State {
  cachedAccount: AccountFragment | null;
  setCachedAccount: (account: AccountFragment | null) => void;
}

const { useStore: useAccountLinkStore } = createTrackedStore<State>((set) => ({
  cachedAccount: null,
  setCachedAccount: (account) => set(() => ({ cachedAccount: account }))
}));

export { useAccountLinkStore };
