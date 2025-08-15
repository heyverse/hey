import type { MarkupLinkProps } from "@hey/types/misc";
import { Text } from "react-native";

const ExternalLink = ({ title }: MarkupLinkProps) => {
  let href = title;

  if (!href) {
    return null;
  }

  if (!href.includes("://")) {
    href = `https://${href}`;
  }

  return <Text>{title}</Text>;
};

export default ExternalLink;
