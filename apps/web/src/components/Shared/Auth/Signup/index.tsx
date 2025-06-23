import { createTrackedSelector } from "react-tracked";
import { useAccount } from "wagmi";
import { create } from "zustand";
import WalletSelector from "@/components/Shared/Auth/WalletSelector";
import ChooseUsername from "./ChooseUsername";
import Minting from "./Minting";
import Success from "./Success";

interface SignupState {
  chosenUsername: string;
  accountAddress: string;
  screen: "choose" | "minting" | "success";
  transactionHash: string;
  onboardingToken: string;
  setChosenUsername: (username: string) => void;
  setAccountAddress: (accountAddress: string) => void;
  setScreen: (screen: "choose" | "minting" | "success") => void;
  setTransactionHash: (hash: string) => void;
  setOnboardingToken: (token: string) => void;
}

const store = create<SignupState>((set) => ({
  accountAddress: "",
  chosenUsername: "",
  onboardingToken: "",
  screen: "choose",
  setAccountAddress: (accountAddress) => set({ accountAddress }),
  setChosenUsername: (username) => set({ chosenUsername: username }),
  setOnboardingToken: (token) => set({ onboardingToken: token }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  transactionHash: ""
}));

export const useSignupStore = createTrackedSelector(store);

const Signup = () => {
  const { screen } = useSignupStore();
  const { connector: activeConnector } = useAccount();

  return activeConnector?.id ? (
    <div className="space-y-2.5">
      {screen === "choose" ? (
        <ChooseUsername />
      ) : screen === "minting" ? (
        <Minting />
      ) : (
        <Success />
      )}
    </div>
  ) : (
    <WalletSelector />
  );
};

export default Signup;
