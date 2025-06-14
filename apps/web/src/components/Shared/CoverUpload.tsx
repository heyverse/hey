import ChooseFile from "@/components/Shared/ChooseFile";
import { Button, Image, Modal } from "@/components/Shared/UI";
import useImageCropUpload from "@/hooks/useImageCropUpload";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { TRANSFORMS } from "@hey/data/constants";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { SyntheticEvent } from "react";
import Cropper from "react-easy-crop";

interface CoverUploadProps {
  src: string;
  setSrc: (src: string) => void;
}

const CoverUpload = ({ src, setSrc }: CoverUploadProps) => {
  const {
    pictureSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    showModal,
    uploading,
    uploadedPicture,
    renderPictureUrl,
    onFileChange,
    onCropComplete,
    handleUploadAndSave,
    handleModalClose
  } = useImageCropUpload({
    src,
    setSrc,
    aspect: 1350 / 350,
    transform: TRANSFORMS.COVER,
    label: "cover"
  });

  return (
    <>
      <div className="space-y-1.5">
        <div className="label">Cover</div>
        <div className="space-y-3">
          <div>
            <Image
              alt="Cover picture crop preview"
              className="h-[175px] w-[675px] rounded-lg object-cover"
              onError={(event: SyntheticEvent<HTMLImageElement>) => {
                const target = event.currentTarget;
                target.src = sanitizeDStorageUrl(src);
              }}
              src={uploadedPicture || renderPictureUrl}
            />
          </div>
          <ChooseFile onChange={(event) => onFileChange(event)} />
        </div>
      </div>
      <Modal
        onClose={handleModalClose}
        show={showModal}
        size="lg"
        title="Crop cover picture"
      >
        <div className="space-y-5 p-5">
          <div className="relative flex size-64 w-full">
            <Cropper
              image={pictureSrc}
              crop={crop}
              zoom={zoom}
              aspect={1350 / 350}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-y-3">
            <div className="flex items-center space-x-1 text-left text-gray-500 text-sm dark:text-gray-200">
              <InformationCircleIcon className="size-4" />
              <div>
                Optimal cover picture size is <b>1350x350</b>
              </div>
            </div>
            <Button
              disabled={uploading || !pictureSrc}
              loading={uploading}
              onClick={handleUploadAndSave}
              type="submit"
            >
              Upload
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CoverUpload;
