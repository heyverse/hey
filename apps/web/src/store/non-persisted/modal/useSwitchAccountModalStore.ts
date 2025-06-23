import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showSwitchAccountModal: boolean;
  setShowSwitchAccountModal: (showSwitchAccountModal: boolean) => void;
}

const { useStore: useSwitchAccountModalStore } = createTrackedStore<State>(
  (set) => ({
    setShowSwitchAccountModal: (showSwitchAccountModal) =>
      set(() => ({ showSwitchAccountModal })),
    showSwitchAccountModal: false
  })
);

export { useSwitchAccountModalStore };
