import ChooseThumbnail from "@/components/Composer/ChooseThumbnail";
import Audio from "@/components/Shared/Audio";
import { Image } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import stopEventPropagation from "@/helpers/stopEventPropagation";
import { usePostAttachmentStore } from "@/store/non-persisted/post/usePostAttachmentStore";
import { usePostVideoStore } from "@/store/non-persisted/post/usePostVideoStore";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { MAX_IMAGE_UPLOAD } from "@hey/data/constants";
import type { NewAttachment } from "@hey/types/misc";
import { useEffect, useRef } from "react";

const getClass = (attachments: number) => {
  const aspect = "aspect-w-16 aspect-h-12";
  if (attachments === 1) return { aspect: "", row: "grid-cols-1 grid-rows-1" };
  if (attachments === 2) return { aspect, row: "grid-cols-2 grid-rows-1" };
  if (attachments <= 4) return { aspect, row: "grid-cols-2 grid-rows-2" };
  if (attachments <= 6) return { aspect, row: "grid-cols-3 grid-rows-2" };
  if (attachments <= 8) return { aspect, row: "grid-cols-4 grid-rows-2" };
  return { aspect, row: "grid-cols-5 grid-rows-2" };
};

interface NewAttachmentsProps {
  attachments: NewAttachment[];
  hideDelete?: boolean;
}

const NewAttachments = ({
  attachments = [],
  hideDelete = false
}: NewAttachmentsProps) => {
  const { setAttachments } = usePostAttachmentStore((state) => state);
  const { setVideoDurationInSeconds } = usePostVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const onDataLoaded = () => {
    if (
      videoRef.current?.duration &&
      videoRef.current?.duration !== Number.POSITIVE_INFINITY
    ) {
      setVideoDurationInSeconds(videoRef.current.duration.toFixed(2));
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = onDataLoaded;
    }
  }, [videoRef, attachments]);

  const handleRemoveAttachment = (attachment: any) => {
    const arr = attachments;
    setAttachments(
      arr.filter((element: any) => {
        return element !== attachment;
      })
    );
  };

  const slicedAttachments = attachments?.some(
    (attachment: NewAttachment) =>
      attachment.type === "Video" || attachment.type === "Audio"
  )
    ? attachments?.slice(0, 1)
    : attachments?.slice(0, MAX_IMAGE_UPLOAD);
  const attachmentsLength = slicedAttachments?.length;

  return attachmentsLength !== 0 ? (
    <div
      className={cn(getClass(attachmentsLength)?.row, "mt-3 grid gap-2", "m-5")}
    >
      {slicedAttachments?.map((attachment: NewAttachment, index: number) => {
        const isImage = attachment.type === "Image";
        const isAudio = attachment.type === "Audio";
        const isVideo = attachment.type === "Video";

        return (
          <div
            className={cn(
              isImage && getClass(attachmentsLength)?.aspect,
              attachmentsLength === 3 && index === 0 && "row-span-2",
              {
                "w-2/3": isImage && attachmentsLength === 1,
                "w-full": isAudio || isVideo
              },
              "relative"
            )}
            key={attachment.id}
            onClick={stopEventPropagation}
          >
            {isVideo ? (
              <>
                <video
                  className="w-full overflow-hidden rounded-xl"
                  controls
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  disableRemotePlayback
                  ref={videoRef}
                  src={attachment.previewUri}
                />
                <ChooseThumbnail />
              </>
            ) : isAudio ? (
              <Audio isNew poster="" src={attachment.previewUri} />
            ) : isImage ? (
              <Image
                alt={attachment.previewUri}
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
                height={1000}
                loading="lazy"
                onError={({ currentTarget }) => {
                  currentTarget.src = attachment.previewUri;
                }}
                src={attachment.previewUri}
                width={1000}
              />
            ) : null}
            {!hideDelete && (
              <div className="absolute top-0 right-0 m-3">
                <button
                  className="rounded-full bg-gray-900 p-1.5 opacity-75"
                  onClick={() => handleRemoveAttachment(attachment)}
                  type="button"
                >
                  <XMarkIcon className="size-4 text-white" />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : null;
};

export default NewAttachments;
