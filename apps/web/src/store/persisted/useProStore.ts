import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  proBannerDismissed: boolean;
  setProBannerDismissed: (proBannerDismissed: boolean) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      proBannerDismissed: false,
      setProBannerDismissed: (proBannerDismissed: boolean) =>
        set(() => ({ proBannerDismissed }))
    }),
    { name: Localstorage.ProStore }
  )
);

export const useProStore = createTrackedSelector(store);
