import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  isPro: boolean;
  setProStatus: ({ isPro }: { isPro: boolean }) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      isPro: false,
      setProStatus: ({ isPro }: { isPro: boolean }) => set(() => ({ isPro }))
    }),
    { name: Localstorage.ProStore }
  )
);

export const useProStore = createTrackedSelector(store);
