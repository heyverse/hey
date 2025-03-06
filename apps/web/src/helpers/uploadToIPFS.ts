import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  EVER_API,
  EVER_BUCKET,
  EVER_REGION,
  HEY_API_URL
} from "@hey/data/constants";
import { immutable } from "@lens-chain/storage-client";
import axios from "axios";
import { CHAIN } from "src/constants";
import { v4 as uuid } from "uuid";
import { storageClient } from "./storageClient";

const FALLBACK_TYPE = "image/jpeg";
const FILE_SIZE_LIMIT_MB = 5 * 1024 * 1024; // 5MB in bytes

const getS3Client = async (): Promise<S3> => {
  const { data } = await axios.get(`${HEY_API_URL}/sts/token`);
  const client = new S3({
    credentials: {
      accessKeyId: data?.accessKeyId,
      secretAccessKey: data?.secretAccessKey,
      sessionToken: data?.sessionToken
    },
    endpoint: EVER_API,
    maxAttempts: 10,
    region: EVER_REGION
  });

  return client;
};

const uploadToIPFS = async (
  data: FileList | File[],
  onProgress?: (percentage: number) => void
): Promise<{ mimeType: string; uri: string }[]> => {
  try {
    const files = Array.from(data) as File[];
    const s3Files = files.filter(
      (file: File) => file.size > FILE_SIZE_LIMIT_MB
    );
    const client = s3Files.length > 0 ? await getS3Client() : null;

    const attachments = await Promise.all(
      files.map(async (file: File) => {
        // If the file is less than FILE_SIZE_LIMIT_MB, upload it to the Grove
        if (file.size <= FILE_SIZE_LIMIT_MB) {
          const storageNodeResponse = await storageClient.uploadFile(file, {
            acl: immutable(CHAIN.id)
          });

          return {
            mimeType: file.type || FALLBACK_TYPE,
            uri: storageNodeResponse.uri
          };
        }

        // For files larger than FILE_SIZE_LIMIT_MB, use the S3 client
        if (client) {
          const currentDate = new Date()
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-");

          const params = {
            Body: file,
            Bucket: EVER_BUCKET,
            ContentType: file.type,
            Key: `${currentDate}/${uuid()}`
          };
          const task = new Upload({ client, params });
          task.on("httpUploadProgress", (e) => {
            const loaded = e.loaded || 0;
            const total = e.total || 0;
            const progress = (loaded / total) * 100;
            onProgress?.(Math.round(progress));
          });
          await task.done();
          const result = await client.headObject(params);
          const metadata = result.Metadata;
          const cid = metadata?.["ipfs-hash"];

          return { mimeType: file.type || FALLBACK_TYPE, uri: `ipfs://${cid}` };
        }

        return { mimeType: file.type || FALLBACK_TYPE, uri: "" };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

export const uploadFileToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<{ mimeType: string; uri: string }> => {
  try {
    const ipfsResponse = await uploadToIPFS([file], onProgress);
    const metadata = ipfsResponse[0];

    return { mimeType: file.type || FALLBACK_TYPE, uri: metadata.uri };
  } catch {
    return { mimeType: file.type || FALLBACK_TYPE, uri: "" };
  }
};

export default uploadToIPFS;
