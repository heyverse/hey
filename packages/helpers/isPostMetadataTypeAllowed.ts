const allowedTypes = [
  "ArticleMetadata",
  "AudioMetadata",
  "ImageMetadata",
  "TextOnlyMetadata",
  "LinkMetadata",
  "VideoMetadata",
  "MintMetadata",
  "LivestreamMetadata",
  "CheckingInMetadata"
];

/**
 * Retrieves whether a post metadata type is allowed.
 *
 * @param type The post metadata type to check.
 * @returns A boolean indicating whether the post metadata type is allowed.
 */
const isPostMetadataTypeAllowed = (type?: string): boolean => {
  if (!type) {
    return false;
  }

  return allowedTypes.includes(type);
};

export default isPostMetadataTypeAllowed;
