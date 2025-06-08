import { EVER_BUCKET } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import { getS3 } from "./s3Client";

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

    const client = await getS3();
    const result = await client.CompleteMultipartUpload({
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

    const head = await client.HeadObject({ Bucket: EVER_BUCKET, Key: key });
    const cid = head.Metadata?.["ipfs-hash"];

    return ctx.json({ success: true, data: { uri: `ipfs://${cid}` } });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default completeUpload;
