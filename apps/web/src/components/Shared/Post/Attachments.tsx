import Audio from "@/components/Shared/Audio";
import { Image, LightBox } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { TRANSFORMS } from "@hey/data/constants";
import imageKit from "@hey/helpers/imageKit";
import type { MetadataAsset } from "@hey/types/misc";
import { getSrc } from "@livepeer/react/external";
import { memo, useState } from "react";
import Video from "./Video";

const getClass = (attachments: number) => {
  const aspect = "aspect-w-16 aspect-h-12";
  if (attachments === 1) return { aspect: "", row: "grid-cols-1 grid-rows-1" };
  if (attachments === 2) return { aspect, row: "grid-cols-2 grid-rows-1" };
  if (attachments <= 4) return { aspect, row: "grid-cols-2 grid-rows-2" };
  if (attachments <= 6) return { aspect, row: "grid-cols-3 grid-rows-2" };
  if (attachments <= 8) return { aspect, row: "grid-cols-4 grid-rows-2" };
  return { aspect, row: "grid-cols-5 grid-rows-2" };
};

interface MetadataAttachment {
  type: "Audio" | "Image" | "Video";
  uri: string;
}

interface AttachmentsProps {
  asset?: MetadataAsset;
  attachments: MetadataAttachment[];
}

const Attachments = ({ asset, attachments }: AttachmentsProps) => {
  const [expandedImageIndex, setExpandedImageIndex] = useState<number>(0);
  const [showLightBox, setShowLightBox] = useState<boolean>(false);
  const processedAttachments = attachments.slice(0, 10);

  const assetType = asset?.type;
  const hasImageAttachment =
    processedAttachments.some((attachment) => attachment.type === "Image") ||
    assetType === "Image";

  const determineDisplay = () => {
    if (assetType === "Video") return "displayVideoAsset";
    if (assetType === "Audio") return "displayAudioAsset";
    if (hasImageAttachment) {
      const imageAttachments = processedAttachments
        .filter((attachment) => attachment.type === "Image")
        .map((attachment) => attachment.uri);
      if (asset?.uri) imageAttachments.unshift(asset.uri);
      return [...new Set(imageAttachments)];
    }
    return null;
  };

  const displayDecision = determineDisplay();

  const ImageComponent = ({ uri, index }: { uri: string; index: number }) => (
    <Image
      alt={imageKit(uri, TRANSFORMS.ATTACHMENT)}
      className="max-h-[300px] cursor-pointer rounded-lg border border-gray-200 bg-gray-100 object-cover md:max-h-[500px] dark:border-gray-700 dark:bg-gray-800"
      height={1000}
      loading="lazy"
      onClick={() => {
        setExpandedImageIndex(index);
        setShowLightBox(true);
      }}
      onError={({ currentTarget }) => (currentTarget.src = uri)}
      src={imageKit(uri, TRANSFORMS.ATTACHMENT)}
      width={1000}
    />
  );

  return (
    <div className="mt-3">
      {Array.isArray(displayDecision) && (
        <div
          className={cn("grid gap-2", getClass(displayDecision.length)?.row)}
        >
          {displayDecision.map((attachment, index) => (
            <div
              className={cn(
                getClass(displayDecision.length)?.aspect,
                { "row-span-2": displayDecision.length === 3 && index === 0 },
                { "w-2/3": displayDecision.length === 1 }
              )}
              key={attachment}
              onClick={stopEventPropagation}
            >
              <ImageComponent uri={attachment} index={index} />
            </div>
          ))}
          <LightBox
            show={showLightBox}
            onClose={() => {
              setShowLightBox(false);
              setExpandedImageIndex(0);
            }}
            initialIndex={expandedImageIndex}
            images={displayDecision?.map((attachment) => attachment)}
          />
        </div>
      )}
      {displayDecision === "displayVideoAsset" && (
        <Video
          src={
            getSrc(asset?.uri) || [{ src: asset?.uri, type: "video" } as any]
          }
          poster={asset?.cover as string}
        />
      )}
      {displayDecision === "displayAudioAsset" && (
        <Audio
          artist={asset?.artist}
          poster={asset?.cover as string}
          src={asset?.uri as string}
          title={asset?.title}
        />
      )}
    </div>
  );
};

export default memo(Attachments);
