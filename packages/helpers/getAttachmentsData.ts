import type { AnyMediaFragment, Maybe } from "@hey/indexer";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

/**
 * Processes an array of media attachments and returns an array of objects
 * with sanitized URLs and additional metadata based on the media type.
 *
 * @param {Maybe<AnyMediaFragment[]>} attachments - An optional array of media fragments, which can be images, videos, or audio.
 * @returns {any} An array of objects containing the type and sanitized URI of each media,
 *          and additional properties like coverUri and artist for certain media types.
 */
const getAttachmentsData = (attachments?: Maybe<AnyMediaFragment[]>): any => {
  if (!attachments) {
    return [];
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case "MediaImage":
        return {
          type: "Image",
          uri: sanitizeDStorageUrl(attachment.item)
        };
      case "MediaVideo":
        return {
          coverUri: sanitizeDStorageUrl(attachment.cover),
          type: "Video",
          uri: sanitizeDStorageUrl(attachment.item)
        };
      case "MediaAudio":
        return {
          artist: attachment.artist,
          coverUri: sanitizeDStorageUrl(attachment.cover),
          type: "Audio",
          uri: sanitizeDStorageUrl(attachment.item)
        };
      default:
        return [];
    }
  });
};

export default getAttachmentsData;
