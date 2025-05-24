import { fetchSmartMedia as fetchSmartMediaHelper } from "@/helpers/fetchSmartMedia";
import type { SmartMedia, SmartMediaLight } from "@/types/smart-media";
import type { Post } from "@hey/indexer";
import { createTrackedSelector } from "react-tracked";
import { create } from "zustand";

interface SmartMediaRecord {
  smartMedia: SmartMedia | SmartMediaLight | null;
  isLoading: boolean;
  error: Error | null;
}

interface State {
  records: Record<string, SmartMediaRecord>;
  fetchSmartMedia: (post: Post, resolve?: boolean) => Promise<void>;
}

const store = create<State>((set) => ({
  records: {},
  fetchSmartMedia: async (post: Post, resolve?: boolean) => {
    const slug = post.slug;
    logDebug(`fetchSmartMedia:: ${slug}`);

    try {
      set((state) => ({
        records: {
          ...state.records,
          [slug]: { ...state.records[slug], isLoading: true, error: null }
        }
      }));

      const smartMedia = await fetchSmartMediaHelper(post, resolve);

      set((state) => ({
        records: {
          ...state.records,
          [slug]: { smartMedia, isLoading: false, error: null }
        }
      }));
    } catch (error) {
      set((state) => ({
        records: {
          ...state.records,
          [slug]: {
            ...state.records[slug],
            error: error as Error,
            isLoading: false
          }
        }
      }));
    }
  }
}));

export const useSmartMediaStore = createTrackedSelector(store);

export const usePostSmartMedia = (slug: string) => {
  const store = useSmartMediaStore();
  const record = store.records[slug] ?? {
    smartMedia: null,
    isLoading: false,
    error: null
  };
  return {
    ...record,
    fetchSmartMedia: store.fetchSmartMedia
  };
};
