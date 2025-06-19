import { createTrackedStore } from "@/store/createTrackedStore";
import type { AccountFragment } from "@hey/indexer";

interface State {
  blockingOrUnblockingAccount?: AccountFragment;
  showBlockOrUnblockAlert: boolean;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingOrUnblockingAccount?: AccountFragment
  ) => void;
}

const { useStore: useBlockAlertStore } = createTrackedStore<State>((set) => ({
  blockingOrUnblockingAccount: undefined,
  showBlockOrUnblockAlert: false,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingOrUnblockingAccount
  ) => set(() => ({ blockingOrUnblockingAccount, showBlockOrUnblockAlert }))
}));

export { useBlockAlertStore };
