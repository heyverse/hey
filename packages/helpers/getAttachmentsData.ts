import type { AnyMediaFragment, Maybe } from "@hey/indexer";
import type { AttachmentData } from "@hey/types/misc";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

const getAttachmentsData = (
  attachments?: Maybe<AnyMediaFragment[]>
): AttachmentData[] => {
  if (!attachments) {
    return [];
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case "MediaImage":
        return {
          type: "Image",
          uri: sanitizeDStorageUrl(attachment.item)
        } satisfies AttachmentData;
      case "MediaVideo":
        return {
          coverUri: sanitizeDStorageUrl(attachment.cover),
          type: "Video",
          uri: sanitizeDStorageUrl(attachment.item)
        } satisfies AttachmentData;
      case "MediaAudio":
        return {
          artist: attachment.artist,
          coverUri: sanitizeDStorageUrl(attachment.cover),
          type: "Audio",
          uri: sanitizeDStorageUrl(attachment.item)
        } satisfies AttachmentData;
      default:
        return {} as AttachmentData;
    }
  });
};

export default getAttachmentsData;
