import logger from "@hey/helpers/logger";
import type IORedis from "ioredis";
import { DISCORD_QUEUE_KEY, getRedis } from "../utils/redis";
import { sendPageviewWebhook } from "./dispatch/sendPageviewWebhook";
import { sendPostWebhook } from "./dispatch/sendPostWebhook";

interface DiscordQueueItemBase {
  createdAt: number;
  retries?: number;
}

interface PostItem extends DiscordQueueItemBase {
  kind: "post";
  payload: { slug?: string; type?: string };
}

interface PageviewItem extends DiscordQueueItemBase {
  kind: "pageview";
  payload: { embeds: any[] };
}

type DiscordQueueItem = PostItem | PageviewItem;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const parseItem = (raw: unknown): DiscordQueueItem | null => {
  if (!raw) return null;
  try {
    const item =
      typeof raw === "string"
        ? (JSON.parse(raw) as DiscordQueueItem)
        : (raw as DiscordQueueItem);
    if (!item || !("kind" in item)) return null;
    return item;
  } catch (e) {
    logger.error("Failed to parse queue item", e as Error);
    return null;
  }
};

export const startDiscordWebhookWorker = async () => {
  let redis: IORedis;
  try {
    redis = getRedis();
  } catch (_e) {
    logger.warn("Discord worker disabled: Redis not configured");
    return;
  }

  logger.info(`Discord worker started. Queue: ${DISCORD_QUEUE_KEY}`);

  // Simple polling loop
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const raw = await redis.lpop(DISCORD_QUEUE_KEY);
      if (!raw) {
        await sleep(750);
        continue;
      }

      const item = parseItem(raw);
      if (!item) {
        continue;
      }

      try {
        if (item.kind === "post") {
          await sendPostWebhook(item.payload);
        } else if (item.kind === "pageview") {
          await sendPageviewWebhook(item.payload);
        }
        logger.info(`Dispatched Discord webhook: ${item.kind}`);
      } catch (err) {
        const e = err as Error;
        const retries = (item.retries ?? 0) + 1;

        // Backoff with jitter
        const base = Math.min(30_000, 1_000 * retries);
        const jitter = Math.floor(Math.random() * 500);

        if (retries <= 5) {
          item.retries = retries;
          await sleep(base + jitter);
          // Requeue to the front to preserve order for rate-limit retries
          await redis.lpush(DISCORD_QUEUE_KEY, JSON.stringify(item));
          logger.warn(
            `Requeued Discord webhook (${item.kind}), attempt ${retries}: ${e.message}`
          );
        } else {
          logger.error(
            `Dropped Discord webhook after retries (${item.kind}): ${e.message}`
          );
        }
      }
    } catch (loopErr) {
      logger.error("Discord worker loop error", loopErr as Error);
      await sleep(1000);
    }
  }
};

export default startDiscordWebhookWorker;
