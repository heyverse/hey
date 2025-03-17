import { APP_NAME } from "@hey/data/constants";
import {
  audio,
  image,
  liveStream,
  textOnly,
  video
} from "@lens-protocol/metadata";
import { useCallback } from "react";
import { usePostAttachmentStore } from "src/store/non-persisted/post/usePostAttachmentStore";
import { usePostAttributesStore } from "src/store/non-persisted/post/usePostAttributesStore";
import { usePostLicenseStore } from "src/store/non-persisted/post/usePostLicenseStore";
import { usePostLiveStore } from "src/store/non-persisted/post/usePostLiveStore";
import { usePostVideoStore } from "src/store/non-persisted/post/usePostVideoStore";
import { v4 as uuid } from "uuid";
import { usePostAudioStore } from "../store/non-persisted/post/usePostAudioStore";

interface UsePostMetadataProps {
  baseMetadata: any;
}

const usePostMetadata = () => {
  const { videoDurationInSeconds, videoThumbnail } = usePostVideoStore();
  const { audioPost } = usePostAudioStore();
  const { license } = usePostLicenseStore();
  const { attachments } = usePostAttachmentStore((state) => state);
  const { liveVideoConfig, showLiveVideoEditor } = usePostLiveStore();
  const { attributes } = usePostAttributesStore();

  const createLocalBaseMetadata = (baseMetadata: any) => ({
    appId: APP_NAME,
    attributes:
      (attributes || []).length > 0 || baseMetadata.attributes?.length > 0
        ? [...(baseMetadata.attributes || []), ...(attributes || [])]
        : undefined,
    id: uuid()
  });

  const processAttachments = () =>
    attachments
      .map((attachment) => ({
        item: attachment.uri,
        type: attachment.mimeType
      }))
      .slice(1);

  const getMetadata = useCallback(
    ({ baseMetadata }: UsePostMetadataProps) => {
      const hasAttachments = attachments.length > 0;
      const isImage = attachments[0]?.type === "Image";
      const isAudio = attachments[0]?.type === "Audio";
      const isVideo = attachments[0]?.type === "Video";
      const isLiveStream = Boolean(showLiveVideoEditor && liveVideoConfig.id);

      const localBaseMetadata = createLocalBaseMetadata(baseMetadata);
      const attachmentsToBeUploaded = processAttachments();

      if (isLiveStream) {
        return liveStream({
          ...baseMetadata,
          ...localBaseMetadata,
          liveUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
          playbackUrl: `https://livepeercdn.studio/hls/${liveVideoConfig.playbackId}/index.m3u8`,
          startsAt: new Date().toISOString()
        });
      }

      if (!hasAttachments) {
        return textOnly({
          ...baseMetadata,
          ...localBaseMetadata
        });
      }

      if (isImage) {
        return image({
          ...baseMetadata,
          ...localBaseMetadata,
          ...(attachmentsToBeUploaded.length > 0 && {
            attachments: attachmentsToBeUploaded
          }),
          image: {
            ...(license && { license }),
            item: attachments[0]?.uri,
            type: attachments[0]?.mimeType
          }
        });
      }

      if (isAudio) {
        return audio({
          ...baseMetadata,
          ...localBaseMetadata,
          ...(attachmentsToBeUploaded.length > 0 && {
            attachments: attachmentsToBeUploaded
          }),
          audio: {
            ...(audioPost.artist && {
              artist: audioPost.artist
            }),
            cover: audioPost.cover,
            item: attachments[0]?.uri,
            type: attachments[0]?.mimeType,
            ...(license && { license })
          }
        });
      }

      if (isVideo) {
        return video({
          ...baseMetadata,
          ...localBaseMetadata,
          ...(attachmentsToBeUploaded.length > 0 && {
            attachments: attachmentsToBeUploaded
          }),
          video: {
            cover: videoThumbnail.url,
            duration: Number.parseInt(videoDurationInSeconds),
            item: attachments[0]?.uri,
            type: attachments[0]?.mimeType,
            ...(license && { license })
          }
        });
      }

      return null;
    },
    [
      attributes,
      attachments,
      videoDurationInSeconds,
      audioPost,
      videoThumbnail,
      showLiveVideoEditor,
      liveVideoConfig,
      license
    ]
  );

  return getMetadata;
};

export default usePostMetadata;
