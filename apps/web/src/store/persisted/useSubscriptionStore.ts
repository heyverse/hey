import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  hasSubscribed: boolean;
  expiresAt?: Date;
  setSubscriptionStatus: ({
    hasSubscribed,
    expiresAt
  }: { hasSubscribed: boolean; expiresAt?: Date }) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      hasSubscribed: false,
      expiresAt: undefined,
      setSubscriptionStatus: ({
        hasSubscribed,
        expiresAt
      }: { hasSubscribed: boolean; expiresAt?: Date }) =>
        set(() => ({ hasSubscribed, expiresAt }))
    }),
    { name: Localstorage.SubscriptionStore }
  )
);

export const useSubscriptionStore = createTrackedSelector(store);
