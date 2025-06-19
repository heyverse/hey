import { createTrackedStore } from "@/store/createTrackedStore";
import type { PostFragment } from "@hey/indexer";

interface State {
  deletingPost?: PostFragment;
  showPostDeleteAlert: boolean;
  setShowPostDeleteAlert: (
    showPostDeleteAlert: boolean,
    deletingPost?: PostFragment
  ) => void;
}

const { useStore: useDeletePostAlertStore } = createTrackedStore<State>(
  (set) => ({
    deletingPost: undefined,
    showPostDeleteAlert: false,
    setShowPostDeleteAlert: (showPostDeleteAlert, deletingPost) =>
      set(() => ({ deletingPost, showPostDeleteAlert }))
  })
);

export { useDeletePostAlertStore };
