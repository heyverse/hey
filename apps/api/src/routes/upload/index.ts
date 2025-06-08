import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import completeUpload from "./complete";
import initUpload from "./init";
import uploadPart from "./uploadPart";

const app = new Hono();

app.post(
  "/init",
  zValidator(
    "json",
    z.object({ key: z.string(), contentType: z.string().optional() })
  ),
  initUpload
);
app.put("/part", uploadPart);
app.post(
  "/complete",
  zValidator(
    "json",
    z.object({
      uploadId: z.string(),
      key: z.string(),
      parts: z.array(z.object({ partNumber: z.number(), etag: z.string() }))
    })
  ),
  completeUpload
);

export default app;
