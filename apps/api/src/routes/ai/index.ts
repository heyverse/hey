import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import translate from "./translate";

const app = new Hono();

app.post(
  "/translate",
  zValidator("json", z.object({ post: z.string() })),
  translate
);

export default app;
