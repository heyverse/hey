import { createTrackedStore } from "@/store/createTrackedStore";
import type { Address } from "viem";

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
  showFundModal: false,
  token: undefined,
  amountToTopUp: undefined,
  setShowFundModal: ({ showFundModal, token, amountToTopUp }) =>
    set(() => ({ showFundModal, token, amountToTopUp }))
}));

export { useFundModalStore };
