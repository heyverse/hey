import type { AnyMediaFragment, Maybe } from "@hey/indexer";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

export interface AttachmentData {
  type: "Audio" | "Image" | "Video";
  uri: string;
  artist?: string;
  coverUri?: string;
}

const getAttachmentsData = (
  attachments?: Maybe<AnyMediaFragment[]>
): AttachmentData[] => {
  if (!attachments) {
    return [];
  }

  return attachments
    .map((attachment) => {
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
          return null;
      }
    })
    .filter(Boolean) as AttachmentData[];
};

export default getAttachmentsData;
