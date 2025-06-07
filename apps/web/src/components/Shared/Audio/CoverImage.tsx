import { Image, Spinner } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import errorToast from "@/helpers/errorToast";
import { uploadFileToIPFS } from "@/helpers/uploadToIPFS";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { TRANSFORMS } from "@hey/data/constants";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { ApolloClientError } from "@hey/types/errors";
import type { ChangeEvent, Ref } from "react";
import { useState } from "react";

interface CoverImageProps {
  cover: string;
  imageRef: Ref<HTMLImageElement>;
  isNew: boolean;
  setCover: (previewUri: string, url: string, mimeType: string) => void;
}

const CoverImage = ({
  cover,
  imageRef,
  isNew = false,
  setCover
}: CoverImageProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      try {
        setIsSubmitting(true);
        const file = event.target.files[0];
        const attachment = await uploadFileToIPFS(file);
        setCover(
          URL.createObjectURL(file),
          attachment.uri,
          file.type || "image/jpeg"
        );
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="group relative flex-none overflow-hidden">
      <button className="flex focus:outline-hidden" type="button">
        <Image
          alt={`attachment-audio-cover-${cover}`}
          className="size-24 rounded-xl object-cover md:size-40 md:rounded-none"
          draggable={false}
          onError={({ currentTarget }) => {
            currentTarget.src = cover ? sanitizeDStorageUrl(cover) : cover;
          }}
          ref={imageRef}
          src={
            cover
              ? imageKit(sanitizeDStorageUrl(cover), TRANSFORMS.ATTACHMENT)
              : cover
          }
        />
      </button>
      {isNew && (
        <label
          className={cn(
            { invisible: cover, visible: isSubmitting && !cover },
            "absolute top-0 grid size-24 cursor-pointer place-items-center bg-gray-100 backdrop-blur-lg group-hover:visible md:size-40 dark:bg-gray-900"
          )}
        >
          {isSubmitting && !cover ? (
            <Spinner size="sm" />
          ) : (
            <div className="flex flex-col items-center text-sm opacity-60">
              <PhotoIcon className="size-5" />
              <span>Add cover</span>
            </div>
          )}
          <input
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={onChange}
            type="file"
          />
        </label>
      )}
    </div>
  );
};

export default CoverImage;
