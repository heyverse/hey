import ChooseFile from "@/components/Shared/ChooseFile";
import { Button, Image, Modal } from "@/components/Shared/UI";
import uploadCroppedImage, { readFile } from "@/helpers/accountPictureUtils";
import getCroppedImg from "@/helpers/cropUtils";
import errorToast from "@/helpers/errorToast";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { COVER, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { ChangeEvent } from "react";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import toast from "react-hot-toast";

interface CoverUploadProps {
  src: string;
  setSrc: (src: string) => void;
}

const CoverUpload = ({ src, setSrc }: CoverUploadProps) => {
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

  const pictureUrl = pictureSrc || `${STATIC_IMAGES_URL}/patterns/2.svg`;
  const renderPictureUrl = pictureUrl
    ? imageKit(sanitizeDStorageUrl(pictureUrl), COVER)
    : "";

  return (
    <>
      <div className="space-y-1.5">
        <div className="label">Cover</div>
        <div className="space-y-3">
          <div>
            <Image
              alt="Cover picture crop preview"
              className="h-[175px] w-[675px] rounded-lg object-cover"
              onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
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
        onClose={
          isSubmitting
            ? undefined
            : () => {
                setPictureSrc("");
                setShowModal(false);
              }
        }
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
