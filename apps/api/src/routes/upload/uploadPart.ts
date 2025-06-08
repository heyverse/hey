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

const uploadPart = async (ctx: Context) => {
  try {
    const uploadId = ctx.req.header("upload-id");
    const key = ctx.req.header("key");
    const part = Number(ctx.req.header("part-number"));

    if (!uploadId || !key || Number.isNaN(part)) {
      return ctx.json(
        { success: false, error: Errors.SomethingWentWrong },
        400
      );
    }

    const arrayBuffer = await ctx.req.arrayBuffer();
    const Body = Buffer.from(arrayBuffer);
    const result = await s3.UploadPart({
      Bucket: EVER_BUCKET,
      Key: key,
      UploadId: uploadId,
      PartNumber: part,
      Body
    });

    return ctx.json({ success: true, data: { etag: result.ETag } });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default uploadPart;
