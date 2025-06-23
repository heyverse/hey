import { TRANSFORMS } from "@hey/data/constants";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { SyntheticEvent } from "react";
import Cropper from "react-easy-crop";
import ChooseFile from "@/components/Shared/ChooseFile";
import { Button, Image, Modal } from "@/components/Shared/UI";
import cn from "@/helpers/cn";
import useImageCropUpload from "@/hooks/useImageCropUpload";

interface AvatarUploadProps {
  src: string;
  setSrc: (src: string) => void;
  isSmall?: boolean;
}

const AvatarUpload = ({ src, setSrc, isSmall = false }: AvatarUploadProps) => {
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
    aspect: 1,
    label: "avatar",
    setSrc,
    src,
    transform: TRANSFORMS.AVATAR_BIG
  });

  return (
    <>
      <div className="space-y-1.5">
        <div className="label">Avatar</div>
        <div className="space-y-3">
          <Image
            alt="Account picture crop preview"
            className={cn("rounded-lg", isSmall ? "max-w-44" : "size-56")}
            onError={(event: SyntheticEvent<HTMLImageElement>) => {
              const target = event.currentTarget;
              target.src = sanitizeDStorageUrl(src);
            }}
            src={uploadedPicture || renderPictureUrl}
          />
          <ChooseFile onChange={(event) => onFileChange(event)} />
        </div>
      </div>
      <Modal
        onClose={handleModalClose}
        show={showModal}
        size="xs"
        title="Crop picture"
      >
        <div className="space-y-5 p-5">
          <div className="relative flex size-64 w-full">
            <Cropper
              aspect={1}
              crop={crop}
              cropShape="round"
              image={pictureSrc}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoom={zoom}
            />
          </div>
          <Button
            className="w-full"
            disabled={uploading || !pictureSrc}
            loading={uploading}
            onClick={handleUploadAndSave}
            type="submit"
          >
            Upload
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AvatarUpload;
