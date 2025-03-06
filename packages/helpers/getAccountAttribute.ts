import type { Maybe, MetadataAttributeFragment } from "@hey/indexer";

type Key = "location" | "website" | "x";

/**
 * Retrieves the attribute value for a given trait type from an array of post attributes.
 *
 * @param {Key} key - The key of the attribute to find.
 * @param {Maybe<MetadataAttributeFragment[]>} [attributes] - The array of post attributes to search through.
 * @returns {string} The attribute value.
 */
const getAccountAttribute = (
  key: Key,
  attributes: Maybe<MetadataAttributeFragment[]> = []
): string => {
  const attribute = attributes?.find((attr) => attr.key === key);
  return attribute?.value || "";
};

export default getAccountAttribute;
