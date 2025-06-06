import type { AnyMediaFragment, Maybe } from "@hey/indexer";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

interface AttachmentData {
  artist?: string;
  coverUri?: string;
  type: "Audio" | "Image" | "Video";
  uri: string;
}

const getAttachmentsData = (
  attachments?: Maybe<AnyMediaFragment[]>
): AttachmentData[] => {
  if (!attachments) {
    return [];
  }

  return attachments.reduce<AttachmentData[]>((acc, attachment) => {
    switch (attachment.__typename) {
      case "MediaImage":
        acc.push({
          type: "Image",
          uri: sanitizeDStorageUrl(attachment.item)
        });
        break;
      case "MediaVideo":
        acc.push({
          coverUri: sanitizeDStorageUrl(attachment.cover),
          type: "Video",
          uri: sanitizeDStorageUrl(attachment.item)
        });
        break;
      case "MediaAudio":
        acc.push({
          artist: attachment.artist ?? undefined,
          coverUri: sanitizeDStorageUrl(attachment.cover),
          type: "Audio",
          uri: sanitizeDStorageUrl(attachment.item)
        });
        break;
      default:
        break;
    }

    return acc;
  }, []);
};

export default getAttachmentsData;
