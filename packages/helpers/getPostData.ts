import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import type { PostMetadataFragment } from "@hey/indexer";
import type { AttachmentData, MetadataAsset } from "@hey/types/misc";
import getAttachmentsData from "./getAttachmentsData";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

const getPostData = (
  metadata: PostMetadataFragment
): {
  asset?: MetadataAsset;
  attachments?: AttachmentData[];
  content?: string;
} | null => {
  switch (metadata.__typename) {
    case "ArticleMetadata":
    case "ThreeDMetadata":
    case "LinkMetadata":
    case "EmbedMetadata":
    case "EventMetadata":
    case "TransactionMetadata":
    case "MintMetadata":
    case "LivestreamMetadata":
    case "CheckingInMetadata":
    case "SpaceMetadata":
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content
      };
    case "TextOnlyMetadata":
    case "StoryMetadata":
      return { content: metadata.content };
    case "ImageMetadata":
      return {
        asset: {
          type: "Image",
          uri: sanitizeDStorageUrl(metadata.image.item)
        },
        attachments: getAttachmentsData(metadata.attachments),
        content: metadata.content
      };
    case "AudioMetadata": {
      const audioAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        asset: {
          artist:
            metadata.audio.artist ?? audioAttachments?.artist ?? undefined,
          cover: sanitizeDStorageUrl(
            metadata.audio.cover ||
              audioAttachments?.coverUri ||
              PLACEHOLDER_IMAGE
          ),
          title: metadata.title || "Untitled",
          type: "Audio",
          uri: metadata.audio.item || audioAttachments?.uri
        },
        content: metadata.content
      };
    }
    case "VideoMetadata": {
      const videoAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        asset: {
          cover: sanitizeDStorageUrl(
            metadata.video.cover || videoAttachments?.coverUri
          ),
          type: "Video",
          uri: sanitizeDStorageUrl(metadata.video.item || videoAttachments?.uri)
        },
        content: metadata.content
      };
    }
    default:
      return null;
  }
};

export default getPostData;
