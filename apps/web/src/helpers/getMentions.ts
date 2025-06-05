import { Regex } from "@hey/data/regex";
import type { AccountMentionFragment, PostMentionFragment } from "@hey/indexer";

const getMentions = (text: string): PostMentionFragment[] => {
  if (!text) return [];

  const mentions = text.match(Regex.mention) ?? [];

  return mentions.map((mention) => {
    const handle = mention
      .substring(mention.lastIndexOf("/") + 1)
      .toLowerCase();

    return {
      account: "",
      namespace: "",
      replace: { from: handle, to: handle }
    } as AccountMentionFragment;
  });
};

export default getMentions;
