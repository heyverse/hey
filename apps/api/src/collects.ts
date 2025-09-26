import { Status } from "@hey/data/enums";
import { withPrefix } from "@hey/helpers/logger";
import type { Context } from "hono";
import enqueueDiscordWebhook from "./utils/discordQueue";

const log = withPrefix("[API]");

interface CollectsBody {
  slug?: string;
}

const collects = async (ctx: Context) => {
  let body: CollectsBody = {};
  try {
    body = (await ctx.req.json()) as CollectsBody;
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
      kind: "collect" as const,
      payload: { slug: body.slug },
      retries: 0
    };

    void enqueueDiscordWebhook(item);
  } catch (err) {
    log.error("Failed to enqueue collect webhook", err as Error);
  }

  return ctx.json({ data: { ok: true }, status: Status.Success });
};

export default collects;
