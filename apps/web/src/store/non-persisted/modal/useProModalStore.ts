import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showProModal: boolean;
  setShowProModal: (showProModal: boolean) => void;
}

const { useStore: useProModalStore } = createTrackedStore<State>((set) => ({
  setShowProModal: (showProModal) => set(() => ({ showProModal })),
  showProModal: false
}));

export { useProModalStore };
