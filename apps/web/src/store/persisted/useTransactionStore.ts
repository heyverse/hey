import { Localstorage } from "@hey/data/storage";
import type { OptimisticTxType } from "@hey/types/enums";
import type { OptimisticTransaction } from "@hey/types/misc";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  addTransaction: (txn: OptimisticTransaction) => void;
  indexedPostHash: null | string;
  isFollowPending: (profileAddress: string) => boolean;
  isUnfollowPending: (profileAddress: string) => boolean;
  isBlockOrUnblockPending: (profileAddress: string) => boolean;
  hasOptimisticallyCollected: (collectOn: string) => boolean;
  removeTransaction: (hash: string) => void;
  reset: () => void;
  setIndexedPostHash: (hash: string) => void;
  txnQueue: OptimisticTransaction[];
}

const store = create(
  persist<State>(
    (set, get) => ({
      addTransaction: (txn) =>
        set((state) => ({ txnQueue: [...state.txnQueue, txn] })),
      indexedPostHash: null,
      isFollowPending: (profileAddress) =>
        get().txnQueue.some((txn) => txn.followOn === profileAddress),
      isUnfollowPending: (profileAddress) =>
        get().txnQueue.some((txn) => txn.unfollowOn === profileAddress),
      isBlockOrUnblockPending: (profileAddress) =>
        get().txnQueue.some(
          (txn) =>
            txn.blockOn === profileAddress || txn.unblockOn === profileAddress
        ),
      hasOptimisticallyCollected: (collectOn) =>
        get().txnQueue.some((txn) => txn.collectOn === collectOn),
      removeTransaction: (hash) =>
        set((state) => ({
          txnQueue: state.txnQueue.filter((txn) => txn.txHash !== hash)
        })),
      reset: () => set({ txnQueue: [] }),
      setIndexedPostHash: (hash) => set({ indexedPostHash: hash }),
      txnQueue: []
    }),
    { name: Localstorage.TransactionStore }
  )
);

export const addOptimisticTransaction = store.getState().addTransaction;
export const addSimpleOptimisticTransaction = (
  hash: string,
  type: OptimisticTxType
) => store.getState().addTransaction({ txHash: hash, type });
export const useTransactionStore = store;
