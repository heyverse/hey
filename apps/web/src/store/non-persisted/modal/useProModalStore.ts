import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showProModal: boolean;
  setShowProModal: (showProModal: boolean) => void;
}

const { useStore: useProModalStore } = createTrackedStore<State>((set) => ({
  showProModal: false,
  setShowProModal: (showProModal) => set(() => ({ showProModal }))
}));

export { useProModalStore };
