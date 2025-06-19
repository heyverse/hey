import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showSwitchAccountModal: boolean;
  setShowSwitchAccountModal: (showSwitchAccountModal: boolean) => void;
}

const { useStore: useSwitchAccountModalStore } = createTrackedStore<State>(
  (set) => ({
    showSwitchAccountModal: false,
    setShowSwitchAccountModal: (showSwitchAccountModal) =>
      set(() => ({ showSwitchAccountModal }))
  })
);

export { useSwitchAccountModalStore };
