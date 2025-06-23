import type { AccountFragment } from "@hey/indexer";
import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  mutingOrUnmutingAccount?: AccountFragment;
  showMuteOrUnmuteAlert: boolean;
  setShowMuteOrUnmuteAlert: (
    showMuteOrUnmuteAlert: boolean,
    mutingOrUnmutingAccount?: AccountFragment
  ) => void;
}

const { useStore: useMuteAlertStore } = createTrackedStore<State>((set) => ({
  mutingOrUnmutingAccount: undefined,
  showMuteOrUnmuteAlert: false,
  setShowMuteOrUnmuteAlert: (showMuteOrUnmuteAlert, mutingOrUnmutingAccount) =>
    set(() => ({ mutingOrUnmutingAccount, showMuteOrUnmuteAlert }))
}));

export { useMuteAlertStore };
