import imageCompression, { type Options } from "browser-image-compression";

const compressImage = (file: File, opts: Options): Promise<File> => {
  return imageCompression(file, {
    exifOrientation: 1,
    useWebWorker: true,
    ...opts
  });
};

export default compressImage;
