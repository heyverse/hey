import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import type { PostMetadataFragment } from "@hey/indexer";
import type { MetadataAsset } from "@hey/types/misc";
import getAttachmentsData from "./getAttachmentsData";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

const getPostData = (
  metadata: PostMetadataFragment
): {
  asset?: MetadataAsset;
  attachments?: {
    type: "Audio" | "Image" | "Video";
    uri: string;
  }[];
  content?: string;
} | null => {
  const { content } = metadata;

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
      return {
        attachments: getAttachmentsData(metadata.attachments),
        content
      };
    case "TextOnlyMetadata":
    case "StoryMetadata":
      return { content };
    case "ImageMetadata":
      return {
        asset: {
          type: "Image",
          uri: sanitizeDStorageUrl(metadata.image.item)
        },
        attachments: getAttachmentsData(metadata.attachments),
        content
      };
    case "AudioMetadata": {
      const audioAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        asset: {
          artist: metadata.audio.artist || audioAttachments?.artist,
          cover: sanitizeDStorageUrl(
            metadata.audio.cover ||
              audioAttachments?.coverUri ||
              PLACEHOLDER_IMAGE
          ),
          license: metadata.audio.license,
          title: metadata.title || "Untitled",
          type: "Audio",
          uri: metadata.audio.item || audioAttachments?.uri
        },
        content
      };
    }
    case "VideoMetadata": {
      const videoAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        asset: {
          cover: sanitizeDStorageUrl(
            metadata.video.cover || videoAttachments?.coverUri
          ),
          license: metadata.video.license,
          type: "Video",
          uri: sanitizeDStorageUrl(metadata.video.item || videoAttachments?.uri)
        },
        content
      };
    }
    default:
      return null;
  }
};

export default getPostData;
