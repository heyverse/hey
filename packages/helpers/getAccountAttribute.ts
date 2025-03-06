import type { Maybe, MetadataAttributeFragment } from "@hey/indexer";

type Key = "location" | "website" | "x";

const getAccountAttribute = (
  key: Key,
  attributes: Maybe<MetadataAttributeFragment[]> = []
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value || "";
};

export default getAccountAttribute;
