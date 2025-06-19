import { createTrackedStore } from "@/store/createTrackedStore";
import type { AnyPostFragment } from "@hey/indexer";

interface State {
  cachedPost: AnyPostFragment | null;
  setCachedPost: (post: AnyPostFragment | null) => void;
}

const { useStore: usePostLinkStore } = createTrackedStore<State>((set) => ({
  cachedPost: null,
  setCachedPost: (post) => set(() => ({ cachedPost: post }))
}));

export { usePostLinkStore };
