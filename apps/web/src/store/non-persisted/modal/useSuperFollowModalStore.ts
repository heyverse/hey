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
    showSuperFollowModal: false,
    superFollowingAccount: undefined,
    setShowSuperFollowModal: (showSuperFollowModal, superFollowingAccount) =>
      set(() => ({ showSuperFollowModal, superFollowingAccount }))
  })
);

export { useSuperFollowModalStore };
