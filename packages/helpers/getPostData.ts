import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import type { PostMetadataFragment } from "@hey/indexer";
import type { MetadataAsset } from "@hey/types/misc";
import getAttachmentsData from "./getAttachmentsData";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

interface PostData {
  asset?: MetadataAsset;
  attachments?: {
    type: "Audio" | "Image" | "Video";
    uri: string;
  }[];
  content?: string;
}

type Handler = (metadata: any) => PostData;

const withAttachments: Handler = (meta) => ({
  attachments: getAttachmentsData(meta.attachments),
  content: meta.content
});

const withContent: Handler = (meta) => ({ content: meta.content });

const handlers: Record<string, Handler> = {
  ArticleMetadata: withAttachments,
  ThreeDMetadata: withAttachments,
  LinkMetadata: withAttachments,
  EmbedMetadata: withAttachments,
  EventMetadata: withAttachments,
  TransactionMetadata: withAttachments,
  MintMetadata: withAttachments,
  LivestreamMetadata: withAttachments,
  CheckingInMetadata: withAttachments,
  SpaceMetadata: withAttachments,
  TextOnlyMetadata: withContent,
  StoryMetadata: withContent,
  ImageMetadata(meta) {
    return {
      asset: { type: "Image", uri: sanitizeDStorageUrl(meta.image.item) },
      attachments: getAttachmentsData(meta.attachments),
      content: meta.content
    };
  },
  AudioMetadata(meta) {
    const audioAttachments = getAttachmentsData(meta.attachments)[0];

    return {
      asset: {
        artist: meta.audio.artist || audioAttachments?.artist,
        cover: sanitizeDStorageUrl(
          meta.audio.cover || audioAttachments?.coverUri || PLACEHOLDER_IMAGE
        ),
        title: meta.title || "Untitled",
        type: "Audio",
        uri: meta.audio.item || audioAttachments?.uri
      },
      content: meta.content
    };
  },
  VideoMetadata(meta) {
    const videoAttachments = getAttachmentsData(meta.attachments)[0];

    return {
      asset: {
        cover: sanitizeDStorageUrl(
          meta.video.cover || videoAttachments?.coverUri
        ),
        type: "Video",
        uri: sanitizeDStorageUrl(meta.video.item || videoAttachments?.uri)
      },
      content: meta.content
    };
  }
};

const getPostData = (metadata: PostMetadataFragment): PostData | null => {
  const handler = handlers[metadata.__typename ?? ""];
  return handler ? handler(metadata) : null;
};

export default getPostData;
