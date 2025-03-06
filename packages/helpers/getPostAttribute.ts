import type { Maybe, MetadataAttributeFragment } from "@hey/indexer";

const getPostAttribute = (
  attributes: Maybe<MetadataAttributeFragment[]> | undefined,
  key: string
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value || "";
};

export default getPostAttribute;
