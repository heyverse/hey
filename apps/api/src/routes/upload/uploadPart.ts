import { EVER_BUCKET } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import type { Context } from "hono";
import { getS3 } from "./s3Client";

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
    const client = await getS3();
    const result = await client.UploadPart({
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
