import type { AccountFragment } from "@hey/indexer";
import { createTrackedStore } from "@/store/createTrackedStore";

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
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingOrUnblockingAccount
  ) => set(() => ({ blockingOrUnblockingAccount, showBlockOrUnblockAlert })),
  showBlockOrUnblockAlert: false
}));

export { useBlockAlertStore };
