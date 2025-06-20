import imageCompression, { type Options } from "browser-image-compression";

export type ImageCompressionOptions = Options;

const compressImage = (
  file: File,
  opts: ImageCompressionOptions
): Promise<File> => {
  return imageCompression(file, {
    exifOrientation: 1,
    useWebWorker: true,
    ...opts
  });
};

export default compressImage;
