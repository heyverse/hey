import type { AnyMediaFragment, Maybe } from "@hey/indexer";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

type AttachmentHandler = (attachment: any) => Record<string, any>;

const ATTACHMENT_HANDLERS: Record<string, AttachmentHandler> = {
  MediaImage: (attachment) => ({
    type: "Image",
    uri: sanitizeDStorageUrl(attachment.item)
  }),
  MediaVideo: (attachment) => ({
    coverUri: sanitizeDStorageUrl(attachment.cover),
    type: "Video",
    uri: sanitizeDStorageUrl(attachment.item)
  }),
  MediaAudio: (attachment) => ({
    artist: attachment.artist,
    coverUri: sanitizeDStorageUrl(attachment.cover),
    type: "Audio",
    uri: sanitizeDStorageUrl(attachment.item)
  })
};

const getAttachmentsData = (attachments?: Maybe<AnyMediaFragment[]>): any => {
  if (!attachments) {
    return [];
  }

  return attachments.map((attachment) => {
    const handler = ATTACHMENT_HANDLERS[attachment.__typename ?? ""];
    return handler ? handler(attachment) : [];
  });
};

export default getAttachmentsData;
