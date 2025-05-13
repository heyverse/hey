import { Localstorage } from "@hey/data/storage";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  isPro: boolean;
  expiresAt?: Date;
  setProStatus: ({
    isPro,
    expiresAt
  }: { isPro: boolean; expiresAt?: Date }) => void;
}

const store = create(
  persist<State>(
    (set) => ({
      isPro: false,
      expiresAt: undefined,
      setProStatus: ({
        isPro,
        expiresAt
      }: { isPro: boolean; expiresAt?: Date }) =>
        set(() => ({ isPro, expiresAt }))
    }),
    { name: Localstorage.ProStore }
  )
);

export const useProStore = createTrackedSelector(store);
