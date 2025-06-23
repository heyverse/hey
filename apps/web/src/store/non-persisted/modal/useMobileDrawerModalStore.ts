import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showMobileDrawer: boolean;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
}

const { useStore: useMobileDrawerModalStore } = createTrackedStore<State>(
  (set) => ({
    setShowMobileDrawer: (showMobileDrawer) =>
      set(() => ({ showMobileDrawer })),
    showMobileDrawer: false
  })
);

export { useMobileDrawerModalStore };
