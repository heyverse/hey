import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  cachedAccount?: AccountFragment;
  setCachedAccount: (account: AccountFragment) => void;
}

const store = create<State>((set) => ({
  cachedAccount: undefined,
  setCachedAccount: (account) => set(() => ({ cachedAccount: account }))
}));

export const useAccountLinkStore = createTrackedSelector(store);
