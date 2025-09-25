import { Status } from "@hey/data/enums";
import { withPrefix } from "@hey/helpers/logger";
import type { Context } from "hono";
import enqueueDiscordWebhook from "./utils/discordQueue";

const log = withPrefix("[API]");

interface LikesBody {
  slug?: string;
}

const likes = async (ctx: Context) => {
  let body: LikesBody = {};
  try {
    body = (await ctx.req.json()) as LikesBody;
  } catch {
    body = {};
  }

  const host = ctx.req.header("host") ?? "";

  if (host.includes("localhost")) {
    return ctx.json({
      data: { ok: true, skipped: true },
      status: Status.Success
    });
  }

  try {
    const item = {
      createdAt: Date.now(),
      kind: "like" as const,
      payload: { slug: body.slug },
      retries: 0
    };

    void enqueueDiscordWebhook(item);
  } catch (err) {
    log.error("Failed to enqueue like webhook", err as Error);
  }

  return ctx.json({ data: { ok: true }, status: Status.Success });
};

export default likes;
