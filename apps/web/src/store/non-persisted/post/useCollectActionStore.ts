import type { CollectActionType } from "@hey/types/hey";
import { create } from "zustand";

const INITIAL_COLLECT_ACTION: CollectActionType = {
  collectLimit: null,
  enabled: false,
  endsAt: null,
  followerOnly: false,
  payToCollect: undefined
};

interface State {
  collectAction: CollectActionType;
  reset: () => void;
  setCollectAction: (collectAction: CollectActionType) => void;
}

const store = create<State>((set) => ({
  collectAction: INITIAL_COLLECT_ACTION,
  reset: () => set(() => ({ collectAction: INITIAL_COLLECT_ACTION })),
  setCollectAction: (collectAction) => set(() => ({ collectAction }))
}));

export const useCollectActionStore = store;
