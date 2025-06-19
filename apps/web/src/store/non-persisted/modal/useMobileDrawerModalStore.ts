import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showMobileDrawer: boolean;
  setShowMobileDrawer: (showMobileDrawer: boolean) => void;
}

const { useStore: useMobileDrawerModalStore } = createTrackedStore<State>(
  (set) => ({
    showMobileDrawer: false,
    setShowMobileDrawer: (showMobileDrawer) => set(() => ({ showMobileDrawer }))
  })
);

export { useMobileDrawerModalStore };
