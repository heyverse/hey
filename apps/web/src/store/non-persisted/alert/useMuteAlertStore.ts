import { createTrackedStore } from "@/store/createTrackedStore";
import type { AccountFragment } from "@hey/indexer";

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
