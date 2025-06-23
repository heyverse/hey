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
    showSuperJoinModal: false,
    superJoiningGroup: undefined,
    setShowSuperJoinModal: (showSuperJoinModal, superJoiningGroup) =>
      set(() => ({ showSuperJoinModal, superJoiningGroup }))
  })
);

export { useSuperJoinModalStore };
