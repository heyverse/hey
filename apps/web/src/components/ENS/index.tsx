import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import Choose from "./Choose";
import Minting from "./Minting";
import Success from "./Success";

interface ENSCreateState {
  chosenUsername: string;
  screen: "choose" | "minting" | "success";
  transactionHash: string;
  setChosenUsername: (username: string) => void;
  setScreen: (screen: "choose" | "minting" | "success") => void;
  setTransactionHash: (hash: string) => void;
}

const store = create<ENSCreateState>((set) => ({
  chosenUsername: "",
  screen: "choose",
  setChosenUsername: (username) => set({ chosenUsername: username }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  transactionHash: ""
}));

export const useENSCreateStore = createTrackedSelector(store);

const ENS = () => {
  const { currentAccount } = useAccountStore();
  const { screen } = useENSCreateStore();

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Bookmarks">
      {screen === "choose" && <Choose />}
      {screen === "minting" && <Minting />}
      {screen === "success" && <Success />}
    </PageLayout>
  );
};

export default ENS;
