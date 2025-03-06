import { Regex } from "@hey/data/regex";
import type { AccountMentionFragment, PostMentionFragment } from "@hey/indexer";

/**
 * Retrieves the mentions from a given text.
 *
 * @param text The text to retrieve mentions from.
 * @returns An array of mentions, or an empty array if no mentions are found.
 */
const getMentions = (text: string): [] | PostMentionFragment[] => {
  if (!text) {
    return [];
  }

  const mentions = text.match(Regex.mention);
  const processedMentions = mentions?.map((mention) => {
    const splited = mention.split("/");
    const handleWithoutNameSpace = splited[splited.length - 1];

    return {
      account: "",
      namespace: "",
      replace: {
        from: handleWithoutNameSpace.toLowerCase(),
        to: handleWithoutNameSpace.toLowerCase()
      }
    } as AccountMentionFragment;
  });

  return processedMentions || [];
};

export default getMentions;
