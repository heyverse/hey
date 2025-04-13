import { STATIC_ASSETS_URL } from "@hey/data/constants";
import type { Emoji } from "@hey/types/misc";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const GET_EMOJIS_QUERY_KEY = "getEmojis";
const DEFAULT_MAX_EMOJI_COUNT = 5;

interface UseEmojisOptions {
  limit?: number;
  query?: string;
  minQueryLength?: number;
}

interface UseEmojisResult {
  emojis: Emoji[];
  error: Error | null;
  isLoading: boolean;
  allEmojis: Emoji[] | undefined;
}

const useEmojis = ({
  limit = DEFAULT_MAX_EMOJI_COUNT,
  query = "",
  minQueryLength = 0
}: UseEmojisOptions = {}): UseEmojisResult => {
  const {
    data: allEmojis,
    error,
    isLoading
  } = useQuery<Emoji[]>({
    queryFn: async () => {
      const response = await fetch(`${STATIC_ASSETS_URL}/emoji.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    },
    queryKey: [GET_EMOJIS_QUERY_KEY]
  });

  const emojis = useMemo(() => {
    if (!allEmojis) {
      return [];
    }

    if (!query || query.length < minQueryLength) {
      return allEmojis.slice(0, limit);
    }

    return allEmojis
      .filter((emoji) => {
        const lowercaseQuery = query.toLowerCase();
        return (
          emoji.aliases.some((alias) =>
            alias.toLowerCase().includes(lowercaseQuery)
          ) ||
          emoji.tags.some((tag) =>
            tag.toLowerCase().includes(lowercaseQuery)
          ) ||
          emoji.description.toLowerCase().includes(lowercaseQuery)
        );
      })
      .slice(0, limit);
  }, [query, allEmojis, limit, minQueryLength]);

  return {
    emojis,
    error: error as Error | null,
    isLoading,
    allEmojis
  };
};

export default useEmojis;
