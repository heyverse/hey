import type { AccountFragment } from "@hey/indexer";
import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  showSuperFollowModal: boolean;
  superFollowingAccount?: AccountFragment;
  setShowSuperFollowModal: (
    showSuperFollowModal: boolean,
    superFollowingAccount?: AccountFragment
  ) => void;
}

const { useStore: useSuperFollowModalStore } = createTrackedStore<State>(
  (set) => ({
    setShowSuperFollowModal: (showSuperFollowModal, superFollowingAccount) =>
      set(() => ({ showSuperFollowModal, superFollowingAccount })),
    showSuperFollowModal: false,
    superFollowingAccount: undefined
  })
);

export { useSuperFollowModalStore };
