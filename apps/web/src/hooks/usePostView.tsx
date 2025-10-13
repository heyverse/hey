import { useEffect, useMemo } from "react";
import { hono } from "@/helpers/fetcher";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const sentImpressions = new Set<string>();

interface UsePostViewOptions {
  slug: string;
}

const usePostView = ({ slug }: UsePostViewOptions) => {
  const key = useMemo(() => `${slug}`, [slug]);
  const { currentAccount } = useAccountStore();

  useEffect(() => {
    if (!slug) return;
    if (sentImpressions.has(key)) return;
    sentImpressions.add(key);
    try {
      void hono.impressions.create({
        address: currentAccount?.address,
        post: slug
      });
    } catch {}
  }, [currentAccount?.address, key, slug]);
};

export default usePostView;
