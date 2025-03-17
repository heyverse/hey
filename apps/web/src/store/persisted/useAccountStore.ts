import { Localstorage } from "@hey/data/storage";
import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  currentAccount?: AccountFragment;
  setCurrentAccount: (currentAccount?: AccountFragment) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      currentAccount: undefined,
      setCurrentAccount: (currentAccount?: AccountFragment) =>
        set(() => ({ currentAccount }))
    }),
    { name: Localstorage.AccountStore }
  )
);

export const useAccountStore = createTrackedSelector(store);
