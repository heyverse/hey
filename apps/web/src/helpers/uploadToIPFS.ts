import { CHAIN } from "@hey/data/constants";
import generateUUID from "@hey/helpers/generateUUID";
import { immutable } from "@lens-chain/storage-client";
import { hono } from "./fetcher";
import { storageClient } from "./storageClient";

const FALLBACK_TYPE = "image/jpeg";
const FILE_SIZE_LIMIT_MB = 8 * 1024 * 1024; // 8MB in bytes
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const uploadLargeFile = async (file: File): Promise<string> => {
  const currentDate = new Date()
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");
  const key = `${currentDate}/${generateUUID()}`;

  const { uploadId } = await hono.upload.init(key, file.type);
  const parts: Array<{ partNumber: number; etag: string }> = [];

  let partNumber = 1;
  for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    const chunk = file.slice(start, start + CHUNK_SIZE);
    const { etag } = await hono.upload.part(uploadId, key, partNumber, chunk);
    parts.push({ partNumber, etag });
    partNumber += 1;
  }

  const { uri } = await hono.upload.complete(uploadId, key, parts);

  return uri;
};

const uploadToIPFS = async (
  data: FileList | File[]
): Promise<{ mimeType: string; uri: string }[]> => {
  try {
    const files = Array.from(data) as File[];

    const attachments = await Promise.all(
      files.map(async (file: File) => {
        if (file.size <= FILE_SIZE_LIMIT_MB) {
          const storageNodeResponse = await storageClient.uploadFile(file, {
            acl: immutable(CHAIN.id)
          });

          return {
            mimeType: file.type || FALLBACK_TYPE,
            uri: storageNodeResponse.uri
          };
        }

        const uri = await uploadLargeFile(file);
        return { mimeType: file.type || FALLBACK_TYPE, uri };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

export const uploadFileToIPFS = async (
  file: File
): Promise<{ mimeType: string; uri: string }> => {
  try {
    const ipfsResponse = await uploadToIPFS([file]);
    const metadata = ipfsResponse[0];

    return { mimeType: file.type || FALLBACK_TYPE, uri: metadata.uri };
  } catch {
    return { mimeType: file.type || FALLBACK_TYPE, uri: "" };
  }
};

export default uploadToIPFS;
