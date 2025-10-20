import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import createConversation from "./createConversation";
import getConversation from "./getConversation";
import sendMessage from "./sendMessage";

const app = new Hono();

app.post(
  "/",
  zValidator(
    "json",
    z.object({ receiverId: z.string().min(1), senderId: z.string().min(1) })
  ),
  createConversation
);

app.get(
  "/:conversationId",
  zValidator("param", z.object({ conversationId: z.string().min(1) })),
  getConversation
);

app.post(
  "/:conversationId/messages",
  zValidator("param", z.object({ conversationId: z.string().min(1) })),
  zValidator(
    "json",
    z.object({ content: z.string().min(1), senderId: z.string().min(1) })
  ),
  sendMessage
);

export default app;
