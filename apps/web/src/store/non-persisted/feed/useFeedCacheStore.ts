import { createTrackedSelector } from "react-tracked";
import type { CacheSnapshot } from "virtua";
import { create } from "zustand";

interface State {
  caches: Record<string, CacheSnapshot>;
  setCache: (key: string, cache: CacheSnapshot) => void;
  getCache: (key: string) => CacheSnapshot | undefined;
}

const store = create<State>((set, get) => ({
  caches: {},
  setCache: (key, cache) =>
    set((state) => ({ caches: { ...state.caches, [key]: cache } })),
  getCache: (key) => get().caches[key]
}));

export const useFeedCacheStore = createTrackedSelector(store);
