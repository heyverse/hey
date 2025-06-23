import type { Address } from "viem";
import { createTrackedStore } from "@/store/createTrackedStore";

export interface FundingToken {
  contractAddress: Address;
  symbol: string;
}

interface TopUpAmount {
  showFundModal: boolean;
  token?: FundingToken;
  amountToTopUp?: number;
}

interface State {
  showFundModal: boolean;
  token?: FundingToken;
  amountToTopUp?: number;
  setShowFundModal: ({
    showFundModal,
    token,
    amountToTopUp
  }: TopUpAmount) => void;
}

const { useStore: useFundModalStore } = createTrackedStore<State>((set) => ({
  amountToTopUp: undefined,
  setShowFundModal: ({ showFundModal, token, amountToTopUp }) =>
    set(() => ({ amountToTopUp, showFundModal, token })),
  showFundModal: false,
  token: undefined
}));

export { useFundModalStore };
