import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  showProModal: boolean;
  setShowProModal: (showProModal: boolean) => void;
}

const store = create<State>((set) => ({
  showProModal: false,
  setShowProModal: (showProModal) => set(() => ({ showProModal }))
}));

export const useProModalStore = createTrackedSelector(store);
