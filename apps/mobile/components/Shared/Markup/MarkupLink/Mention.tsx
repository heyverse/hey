import type { MarkupLinkProps } from "@hey/types/misc";
import { Text } from "react-native";

const Mention = ({ mentions, title }: MarkupLinkProps) => {
  const username = title;

  if (!username) {
    return null;
  }

  const fullUsernames = mentions?.map((mention) => mention.replace.from);

  if (!fullUsernames?.includes(username)) {
    return title;
  }

  const canShowUserPreview = (username: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.replace.from === username
    );

    return Boolean(foundMention?.replace);
  };

  if (canShowUserPreview(username)) {
    return <Text>{username}</Text>;
  }

  return <Text>{username}</Text>;
};

export default Mention;
