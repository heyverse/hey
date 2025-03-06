import imageCompression from "browser-image-compression";
import { uploadFileToIPFS } from "./uploadToIPFS";

/**
 * Retrieves a file as a base64 string.
 *
 * @param {Blob} file - The file to read.
 * @returns {Promise<string>} A promise that resolves to the base64 string representation of the file.
 */
export const readFile = (file: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => resolve(reader.result as string),
      false
    );
    reader.readAsDataURL(file);
  });
};

/**
 * Upload cropped image to storage node
 * @param image Image
 * @returns storage node URL
 */
const uploadCroppedImage = async (
  image: HTMLCanvasElement
): Promise<string> => {
  const blob = await new Promise((resolve) => image.toBlob(resolve));
  const file = new File([blob as Blob], "cropped_image.png", {
    type: (blob as Blob).type
  });
  const cleanedFile = await imageCompression(file, {
    exifOrientation: 1,
    maxSizeMB: 5,
    maxWidthOrHeight: 3000,
    useWebWorker: true
  });
  const attachment = await uploadFileToIPFS(cleanedFile);
  const decentralizedUrl = attachment.uri;
  if (!decentralizedUrl) {
    throw new Error("uploadFileToIPFS failed");
  }

  return decentralizedUrl;
};

export default uploadCroppedImage;
