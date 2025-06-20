import WalletSelector from "@/components/Shared/Auth/WalletSelector";
import { createTrackedSelector } from "react-tracked";
import { useAccount } from "wagmi";
import { create } from "zustand";
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
  chosenUsername: "",
  accountAddress: "",
  screen: "choose",
  transactionHash: "",
  onboardingToken: "",
  setChosenUsername: (username) => set({ chosenUsername: username }),
  setAccountAddress: (accountAddress) => set({ accountAddress }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  setOnboardingToken: (token) => set({ onboardingToken: token })
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
