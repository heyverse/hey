import logger from "@hey/helpers/logger";
import { DISCORD_QUEUE_KEY, getRedis } from "./redis";

export interface DiscordQueueItemBase {
  createdAt: number;
  retries?: number;
}

export interface PostQueueItem extends DiscordQueueItemBase {
  kind: "post";
  payload: { slug?: string; type?: string };
}

export interface PageviewQueueItem extends DiscordQueueItemBase {
  kind: "pageview";
  payload: { embeds: any[] };
}

export type DiscordQueueItem = PostQueueItem | PageviewQueueItem;

export const enqueueDiscordWebhook = async (
  item: DiscordQueueItem
): Promise<void> => {
  try {
    const redis = getRedis();
    await redis.rpush(DISCORD_QUEUE_KEY, JSON.stringify(item));
    logger.info(`Enqueued discord webhook: ${item.kind}`);
  } catch (err) {
    logger.error("Failed to enqueue discord webhook", err as Error);
  }
};

export default enqueueDiscordWebhook;
