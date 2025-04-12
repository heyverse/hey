import type { AnyPostFragment } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface State {
  cachedPost: AnyPostFragment | null;
  setCachedPost: (post: AnyPostFragment | null) => void;
}

const store = create<State>((set) => ({
  cachedPost: null,
  setCachedPost: (post) => set(() => ({ cachedPost: post }))
}));

export const usePostLinkStore = createTrackedSelector(store);
