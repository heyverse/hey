import type { PostFragment } from "@hey/indexer";
import { createTrackedStore } from "@/store/createTrackedStore";

interface State {
  postContent: string;
  quotedPost?: PostFragment;
  editingPost?: PostFragment;
  setPostContent: (postContent: string) => void;
  setQuotedPost: (quotedPost?: PostFragment) => void;
  setEditingPost: (editingPost?: PostFragment) => void;
}

const { useStore: usePostStore } = createTrackedStore<State>((set) => ({
  editingPost: undefined,
  postContent: "",
  quotedPost: undefined,
  setEditingPost: (editingPost) => set(() => ({ editingPost })),
  setPostContent: (postContent) => set(() => ({ postContent })),
  setQuotedPost: (quotedPost) => set(() => ({ quotedPost }))
}));

export { usePostStore };
