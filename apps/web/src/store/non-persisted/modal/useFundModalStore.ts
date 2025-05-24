import { createTrackedSelector } from "react-tracked";
import type { Address } from "viem";
import { create } from "zustand";

interface State {
  showFundModal: boolean;
  token?: Address;
  setShowFundModal: (showFundModal: boolean, token?: Address) => void;
}

const store = create<State>((set) => ({
  showFundModal: false,
  token: undefined,
  setShowFundModal: (showFundModal, token) =>
    set(() => ({ showFundModal, token }))
}));

export const useFundModalStore = createTrackedSelector(store);
