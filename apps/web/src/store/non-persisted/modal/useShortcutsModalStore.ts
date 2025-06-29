import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showShortcutsModal: boolean;
  setShowShortcutsModal: (showShortcutsModal: boolean) => void;
}

const { useStore: useShortcutsModalStore } = createTrackedStore<State>(
  (set) => ({
    setShowShortcutsModal: (showShortcutsModal) =>
      set(() => ({ showShortcutsModal })),
    showShortcutsModal: false
  })
);

export { useShortcutsModalStore };
