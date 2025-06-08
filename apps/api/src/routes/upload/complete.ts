import { S3 } from "@aws-lite/s3";
import { EVER_API, EVER_BUCKET, EVER_REGION } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { Context } from "hono";

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.EVER_ACCESS_KEY as string,
    secretAccessKey: process.env.EVER_ACCESS_SECRET as string
  },
  endpoint: EVER_API,
  region: EVER_REGION
});

interface Part {
  partNumber: number;
  etag: string;
}

const completeUpload = async (ctx: Context) => {
  try {
    const { uploadId, key, parts } = await ctx.req.json<{
      uploadId: string;
      key: string;
      parts: Part[];
    }>();

    const result = await s3.CompleteMultipartUpload({
      Bucket: EVER_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((p) => ({ PartNumber: p.partNumber, ETag: p.etag }))
      }
    });

    if (!result) {
      return ctx.json(
        { success: false, error: Errors.SomethingWentWrong },
        500
      );
    }

    const head = await s3.HeadObject({ Bucket: EVER_BUCKET, Key: key });
    const cid = head.Metadata?.["ipfs-hash"];

    return ctx.json({ success: true, data: { uri: `ipfs://${cid}` } });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default completeUpload;
