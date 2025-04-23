import type { GroupFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  group?: GroupFragment;
  setGroup: (group?: GroupFragment) => void;
}

const store = create<State>((set) => ({
  group: undefined,
  setGroup: (group) => set(() => ({ group }))
}));

export const usePostGroupStore = createTrackedSelector(store);
