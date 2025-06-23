import type { AccountFragment } from "@hey/indexer";
import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  cachedAccount: AccountFragment | null;
  setCachedAccount: (account: AccountFragment | null) => void;
}

const { useStore: useAccountLinkStore } = createTrackedStore<State>((set) => ({
  cachedAccount: null,
  setCachedAccount: (account) => set(() => ({ cachedAccount: account }))
}));

export { useAccountLinkStore };
