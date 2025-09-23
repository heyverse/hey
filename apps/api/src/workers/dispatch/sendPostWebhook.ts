import logger from "@hey/helpers/logger";
import { getLimiter } from "./limiter";

export interface PostPayload {
  slug?: string;
  type?: string;
}

const getPostContent = (payload: PostPayload) => {
  const postUrl = payload.slug
    ? `https://hey.xyz/posts/${payload.slug}`
    : undefined;
  return { content: `New ${payload.type} on Hey ${postUrl ?? ""}` };
};

export const sendPostWebhook = async (payload: PostPayload) => {
  const webhookUrl = process.env.EVENTS_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("Missing EVENTS_DISCORD_WEBHOOK_URL");

  const limiter = getLimiter(webhookUrl);
  await limiter.waitIfNeeded();

  const res = await fetch(webhookUrl, {
    body: JSON.stringify(getPostContent(payload)),
    headers: { "content-type": "application/json" },
    method: "POST"
  });

  if (res.status === 429) {
    limiter.applyRetryAfter(res.headers);
    const retryAfter = res.headers.get("retry-after") ?? "1";
    throw new Error(`429 rate limited, retry after ${retryAfter}s`);
  }

  limiter.applyHeaders(res.headers);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logger.error(`Discord posts webhook failed (${res.status}): ${text}`);
    throw new Error(`Discord webhook failed (${res.status})`);
  }
};

export default sendPostWebhook;
