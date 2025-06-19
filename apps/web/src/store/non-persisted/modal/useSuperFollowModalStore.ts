import { createTrackedStore } from "@/store/createTrackedStore";
import type { AccountFragment } from "@hey/indexer";

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
    showSuperFollowModal: false,
    superFollowingAccount: undefined,
    setShowSuperFollowModal: (showSuperFollowModal, superFollowingAccount) =>
      set(() => ({ showSuperFollowModal, superFollowingAccount }))
  })
);

export { useSuperFollowModalStore };
