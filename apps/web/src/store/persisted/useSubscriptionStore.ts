import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  hasSubscribed: boolean;
  setHasSubscribed: (hasSubscribed: boolean) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      hasSubscribed: false,
      setHasSubscribed: (hasSubscribed: boolean) =>
        set(() => ({ hasSubscribed }))
    }),
    { name: Localstorage.SubscriptionStore }
  )
);

export const useSubscriptionStore = createTrackedSelector(store);
