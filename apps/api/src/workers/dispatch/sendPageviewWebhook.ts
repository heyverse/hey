import logger from "@hey/helpers/logger";
import { getLimiter } from "./limiter";

export interface PageviewPayload {
  embeds: any[];
}

export const sendPageviewWebhook = async (payload: PageviewPayload) => {
  const webhookUrl = process.env.PAGEVIEWS_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) throw new Error("Missing PAGEVIEWS_DISCORD_WEBHOOK_URL");

  const limiter = getLimiter(webhookUrl);
  await limiter.waitIfNeeded();

  const res = await fetch(webhookUrl, {
    body: JSON.stringify({ embeds: payload.embeds }),
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
    logger.error(`Discord pageview webhook failed (${res.status}): ${text}`);
    throw new Error(`Discord webhook failed (${res.status})`);
  }
};

export default sendPageviewWebhook;
