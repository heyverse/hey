import { useState } from "react";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";
import { Button, Card, H5, Modal } from "@/components/Shared/UI";
import CreateGroupModal from "./CreateGroupModal";
import Minting from "./Minting";
import Success from "./Success";

interface CreateGroupState {
  screen: "details" | "minting" | "success";
  transactionHash: string;
  groupAddress: string;
  setScreen: (screen: "details" | "minting" | "success") => void;
  setTransactionHash: (hash: string) => void;
  setGroupAddress: (address: string) => void;
}

const store = create<CreateGroupState>((set) => ({
  groupAddress: "",
  screen: "details",
  setGroupAddress: (address) => set({ groupAddress: address }),
  setScreen: (screen) => set({ screen }),
  setTransactionHash: (hash) => set({ transactionHash: hash }),
  transactionHash: ""
}));

export const useCreateGroupStore = createTrackedSelector(store);

const CreateGroup = () => {
  const [showModal, setShowModal] = useState(false);
  const { screen } = useCreateGroupStore();

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <div className="space-y-1">
          <H5>Create a group</H5>
          <div>Create a new group on Hey</div>
        </div>
        <Button onClick={() => setShowModal(true)}>Create group</Button>
      </Card>
      <Modal
        onClose={() => setShowModal(false)}
        show={showModal}
        title={screen === "details" ? "Create a group" : undefined}
      >
        {screen === "details" ? (
          <CreateGroupModal />
        ) : screen === "minting" ? (
          <Minting />
        ) : (
          <Success />
        )}
      </Modal>
    </>
  );
};

export default CreateGroup;
