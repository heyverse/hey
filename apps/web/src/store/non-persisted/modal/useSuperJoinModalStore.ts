import type { GroupFragment } from "@hey/indexer";
import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showSuperJoinModal: boolean;
  superJoiningGroup?: GroupFragment;
  setShowSuperJoinModal: (
    showSuperJoinModal: boolean,
    superJoiningGroup?: GroupFragment
  ) => void;
}

const { useStore: useSuperJoinModalStore } = createTrackedStore<State>(
  (set) => ({
    setShowSuperJoinModal: (showSuperJoinModal, superJoiningGroup) =>
      set(() => ({ showSuperJoinModal, superJoiningGroup })),
    showSuperJoinModal: false,
    superJoiningGroup: undefined
  })
);

export { useSuperJoinModalStore };
