import compressImage from "./compressImage";
import generateUUID from "@hey/helpers/generateUUID";
import type { NewAttachment } from "@hey/types/misc";
import { toast } from "sonner";

const IMAGE_UPLOAD_LIMIT = 50000000;
const VIDEO_UPLOAD_LIMIT = 2000000000;
const AUDIO_UPLOAD_LIMIT = 600000000;

export const validateFileSize = (file: File): boolean => {
  const isImage = file.type.includes("image");
  const isVideo = file.type.includes("video");
  const isAudio = file.type.includes("audio");

  if (isImage && file.size > IMAGE_UPLOAD_LIMIT) {
    toast.error(`Image size should be less than ${IMAGE_UPLOAD_LIMIT / 1000000}MB`);
    return false;
  }

  if (isVideo && file.size > VIDEO_UPLOAD_LIMIT) {
    toast.error(`Video size should be less than ${VIDEO_UPLOAD_LIMIT / 1000000}MB`);
    return false;
  }

  if (isAudio && file.size > AUDIO_UPLOAD_LIMIT) {
    toast.error(`Audio size should be less than ${AUDIO_UPLOAD_LIMIT / 1000000}MB`);
    return false;
  }

  return true;
};

export const compressFiles = async (files: File[]): Promise<File[]> => {
  return Promise.all(
    files.map(async (file) => {
      if (file.type.includes("image") && !file.type.includes("gif")) {
        return await compressImage(file, { maxSizeMB: 9, maxWidthOrHeight: 6000 });
      }
      return file;
    })
  );
};

export const createPreviewAttachments = (files: File[]): NewAttachment[] => {
  return files.map((file) => ({
    file,
    id: generateUUID(),
    mimeType: file.type,
    previewUri: URL.createObjectURL(file),
    type: file.type.includes("image")
      ? "Image"
      : file.type.includes("video")
        ? "Video"
        : "Audio"
  }));
};
