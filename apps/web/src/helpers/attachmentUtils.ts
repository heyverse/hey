import generateUUID from "@hey/helpers/generateUUID";
import type { NewAttachment } from "@hey/types/misc";
import {
  MediaAudioMimeType,
  MediaImageMimeType,
  MediaVideoMimeType
} from "@lens-protocol/metadata";
import { toast } from "sonner";
import { z } from "zod";
import compressImage from "./compressImage";

const IMAGE_UPLOAD_LIMIT = 50000000;
const VIDEO_UPLOAD_LIMIT = 2000000000;
const AUDIO_UPLOAD_LIMIT = 600000000;

const ImageFileSchema = z.object({
  size: z.number().max(IMAGE_UPLOAD_LIMIT, {
    message: `Image size should be less than ${IMAGE_UPLOAD_LIMIT / 1000000}MB`
  }),
  type: z.nativeEnum(MediaImageMimeType)
});

const VideoFileSchema = z.object({
  size: z.number().max(VIDEO_UPLOAD_LIMIT, {
    message: `Video size should be less than ${VIDEO_UPLOAD_LIMIT / 1000000}MB`
  }),
  type: z.nativeEnum(MediaVideoMimeType)
});

const AudioFileSchema = z.object({
  size: z.number().max(AUDIO_UPLOAD_LIMIT, {
    message: `Audio size should be less than ${AUDIO_UPLOAD_LIMIT / 1000000}MB`
  }),
  type: z.nativeEnum(MediaAudioMimeType)
});

const FileSchema = z.union([ImageFileSchema, VideoFileSchema, AudioFileSchema]);

export const validateFileSize = (file: File): boolean => {
  const result = FileSchema.safeParse({ size: file.size, type: file.type });

  if (!result.success) {
    const issue = result.error.issues[0];

    if (issue.code === "invalid_union") {
      toast.error("File format not allowed.");
    } else {
      toast.error(issue.message);
    }

    return false;
  }

  return true;
};

export const compressFiles = async (files: File[]): Promise<File[]> => {
  return Promise.all(
    files.map(async (file) => {
      if (file.type.includes("image") && !file.type.includes("gif")) {
        return await compressImage(file, {
          maxSizeMB: 9,
          maxWidthOrHeight: 6000
        });
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
