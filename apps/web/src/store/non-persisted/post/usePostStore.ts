import { createTrackedStore } from "@/store/createTrackedStore";
import type { PostFragment } from "@hey/indexer";

interface State {
  postContent: string;
  quotedPost?: PostFragment;
  editingPost?: PostFragment;
  setPostContent: (postContent: string) => void;
  setQuotedPost: (quotedPost?: PostFragment) => void;
  setEditingPost: (editingPost?: PostFragment) => void;
}

const { useStore: usePostStore } = createTrackedStore<State>((set) => ({
  postContent: "",
  quotedPost: undefined,
  editingPost: undefined,
  setPostContent: (postContent) => set(() => ({ postContent })),
  setQuotedPost: (quotedPost) => set(() => ({ quotedPost })),
  setEditingPost: (editingPost) => set(() => ({ editingPost }))
}));

export { usePostStore };
