import { Status } from "@hey/data/enums";
import logger from "@hey/helpers/logger";
import type { Context } from "hono";
import enqueueDiscordWebhook from "./utils/discordQueue";

interface PostsBody {
  slug?: string;
  type?: string;
}

const posts = async (ctx: Context) => {
  let body: PostsBody = {};
  try {
    body = (await ctx.req.json()) as PostsBody;
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
      kind: "post" as const,
      payload: { slug: body.slug, type: body.type },
      retries: 0
    };

    await enqueueDiscordWebhook(item);
  } catch (err) {
    logger.error("Failed to enqueue post webhook", err as Error);
  }

  return ctx.json({ data: { ok: true }, status: Status.Success });
};

export default posts;
