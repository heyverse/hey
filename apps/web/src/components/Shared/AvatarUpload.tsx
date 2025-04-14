import ChooseFile from "@/components/Shared/ChooseFile";
import { Button, Image, Modal } from "@/components/Shared/UI";
import uploadCroppedImage, { readFile } from "@/helpers/accountPictureUtils";
import cn from "@/helpers/cn";
import getCroppedImg from "@/helpers/cropUtils";
import errorToast from "@/helpers/errorToast";
import { AVATAR, DEFAULT_AVATAR } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "sonner";

interface AvatarUploadProps {
  src: string;
  setSrc: (src: string) => void;
  isSmall?: boolean;
}

const AvatarUpload = ({ src, setSrc, isSmall = false }: AvatarUploadProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pictureSrc, setPictureSrc] = useState(src);
  const [showModal, setShowModal] = useState(false);
  const [uploadedPicture, setUploadedPicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [area, setArea] = useState<Area | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onError = (error: any) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const handleUploadAndSave = async () => {
    try {
      setUploading(true);
      const croppedImage = await getCroppedImg(pictureSrc, area);

      if (!croppedImage) {
        return toast.error(Errors.SomethingWentWrong);
      }

      const decentralizedUrl = await uploadCroppedImage(croppedImage);
      const dataUrl = croppedImage.toDataURL("image/png");

      setSrc(decentralizedUrl);
      setUploadedPicture(dataUrl);
    } catch (error) {
      onError(error);
    } finally {
      setArea(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setShowModal(false);
      setUploading(false);
    }
  };

  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (file) {
      setPictureSrc(await readFile(file));
      setShowModal(true);
    }
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setArea(croppedAreaPixels);
  };

  const pictureUrl = pictureSrc || DEFAULT_AVATAR;
  const renderPictureUrl = pictureUrl
    ? imageKit(sanitizeDStorageUrl(pictureUrl), AVATAR)
    : "";

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
        onClose={
          isSubmitting
            ? undefined
            : () => {
                setPictureSrc("");
                setShowModal(false);
              }
        }
        show={showModal}
        size="xs"
        title="Crop picture"
      >
        <div className="space-y-5 p-5">
          <div className="relative flex size-64 w-full">
            <Cropper
              cropShape="round"
              image={pictureSrc}
              crop={crop}
              zoom={zoom}
              aspect={5 / 5}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
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
