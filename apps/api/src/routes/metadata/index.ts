import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import getSTS from "./getSTS";

const app = new Hono();

app.get("/sts", zValidator("json", z.object({ record: z.boolean() })), getSTS);

export default app;
