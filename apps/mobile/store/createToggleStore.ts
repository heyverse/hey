import { createTrackedStore } from "./createTrackedStore";

interface ToggleStore {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const createToggleStore = (initial = false) =>
  createTrackedStore<ToggleStore>((set) => ({
    setShow: (show) => set({ show }),
    show: initial
  }));
