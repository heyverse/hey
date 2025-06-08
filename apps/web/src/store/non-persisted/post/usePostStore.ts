import type { PostFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  postContent: string;
  quotedPost?: PostFragment;
  editingPost?: PostFragment;
  setPostContent: (postContent: string) => void;
  setQuotedPost: (quotedPost?: PostFragment) => void;
  setEditingPost: (editingPost?: PostFragment) => void;
}

const store = create<State>((set) => ({
  postContent: "",
  quotedPost: undefined,
  editingPost: undefined,
  setPostContent: (postContent) => set(() => ({ postContent })),
  setQuotedPost: (quotedPost) => set(() => ({ quotedPost })),
  setEditingPost: (editingPost) => set(() => ({ editingPost }))
}));

export const usePostStore = createTrackedSelector(store);
