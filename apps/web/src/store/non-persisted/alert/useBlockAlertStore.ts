import type { AccountFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  blockingOrUnblockingAccount?: AccountFragment;
  showBlockOrUnblockAlert: boolean;
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert: boolean,
    blockingOrUnblockingAccount?: AccountFragment
  ) => void;
}

const store = create<State>((set) => ({
  blockingOrUnblockingAccount: undefined,
  showBlockOrUnblockAlert: false,
  setShowBlockOrUnblockAlert: (
    showBlockOrUnblockAlert,
    blockingOrUnblockingAccount
  ) => set(() => ({ blockingOrUnblockingAccount, showBlockOrUnblockAlert }))
}));

export const useBlockAlertStore = createTrackedSelector(store);
