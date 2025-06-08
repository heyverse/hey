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

const initUpload = async (ctx: Context) => {
  try {
    const { key, contentType } = await ctx.req.json<{
      key: string;
      contentType?: string;
    }>();

    const result = await s3.CreateMultipartUpload({
      Bucket: EVER_BUCKET,
      Key: key,
      ContentType: contentType
    });

    return ctx.json({
      success: true,
      data: { uploadId: result.UploadId, key }
    });
  } catch {
    return ctx.json({ success: false, error: Errors.SomethingWentWrong }, 500);
  }
};

export default initUpload;
