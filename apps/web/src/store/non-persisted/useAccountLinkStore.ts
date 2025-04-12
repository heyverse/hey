import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  cachedAccount: AccountFragment | null;
  setCachedAccount: (account: AccountFragment | null) => void;
}

const store = create<State>((set) => ({
  cachedAccount: null,
  setCachedAccount: (account) => set(() => ({ cachedAccount: account }))
}));

export const useAccountLinkStore = createTrackedSelector(store);
