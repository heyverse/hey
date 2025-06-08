import { EVER_BUCKET } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import { getS3 } from "./s3Client";

const initUpload = async (ctx: Context) => {
  try {
    const { key, contentType } = await ctx.req.json<{
      key: string;
      contentType?: string;
    }>();

    const client = await getS3();
    const result = await client.CreateMultipartUpload({
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
