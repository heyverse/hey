import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  isPro: boolean;
  hasIgnored: boolean;
  shouldShowRenewBanner: boolean;
  setProStatus: ({
    isPro,
    hasIgnored,
    shouldShowRenewBanner
  }: {
    isPro: boolean;
    hasIgnored: boolean;
    shouldShowRenewBanner: boolean;
  }) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      isPro: false,
      hasIgnored: false,
      shouldShowRenewBanner: false,
      setProStatus: ({
        isPro,
        hasIgnored,
        shouldShowRenewBanner
      }: {
        isPro: boolean;
        hasIgnored: boolean;
        shouldShowRenewBanner: boolean;
      }) => set(() => ({ isPro, hasIgnored, shouldShowRenewBanner }))
    }),
    { name: Localstorage.ProStore }
  )
);

export const useProStore = createTrackedSelector(store);
