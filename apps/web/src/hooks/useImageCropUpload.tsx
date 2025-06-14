import uploadCroppedImage, { readFile } from "@/helpers/accountPictureUtils";
import getCroppedImg from "@/helpers/cropUtils";
import errorToast from "@/helpers/errorToast";
import {
  DEFAULT_AVATAR,
  STATIC_IMAGES_URL,
  type TRANSFORMS
} from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { ApolloClientError } from "@hey/types/errors";
import type { ChangeEvent } from "react";
import { useState } from "react";
import type { Area } from "react-easy-crop";
import { toast } from "sonner";

interface UseImageCropUploadProps {
  src: string;
  setSrc: (src: string) => void;
  aspect: number;
  transform: TRANSFORMS;
  label: "avatar" | "cover";
}

const useImageCropUpload = ({
  src,
  setSrc,
  aspect,
  transform,
  label
}: UseImageCropUploadProps) => {
  const [pictureSrc, setPictureSrc] = useState(src);
  const [showModal, setShowModal] = useState(false);
  const [uploadedPicture, setUploadedPicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [area, setArea] = useState<Area | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onError = (error: ApolloClientError) => {
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

  const pictureUrl =
    pictureSrc ||
    (label === "avatar"
      ? DEFAULT_AVATAR
      : `${STATIC_IMAGES_URL}/patterns/2.svg`);
  const renderPictureUrl = pictureUrl
    ? imageKit(sanitizeDStorageUrl(pictureUrl), transform)
    : "";

  const handleModalClose = () => {
    setPictureSrc("");
    setShowModal(false);
  };

  return {
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
    handleModalClose,
    aspect
  };
};

export default useImageCropUpload;
