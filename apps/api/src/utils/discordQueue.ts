import { withPrefix } from "@hey/helpers/logger";
import { DISCORD_QUEUE_KEY, getRedis } from "./redis";

export interface DiscordQueueItemBase {
  createdAt: number;
  retries?: number;
}

export interface PostQueueItem extends DiscordQueueItemBase {
  kind: "post";
  payload: { slug?: string; type?: string };
}

export interface LikeQueueItem extends DiscordQueueItemBase {
  kind: "like";
  payload: { slug?: string };
}

export interface CollectQueueItem extends DiscordQueueItemBase {
  kind: "collect";
  payload: { slug?: string };
}

export type DiscordQueueItem = PostQueueItem | LikeQueueItem | CollectQueueItem;

export const enqueueDiscordWebhook = async (
  item: DiscordQueueItem
): Promise<void> => {
  const log = withPrefix("[API]");
  try {
    const redis = getRedis();
    await redis.rpush(DISCORD_QUEUE_KEY, JSON.stringify(item));
    log.info(`Enqueued discord webhook: ${item.kind}`);
  } catch (err) {
    log.error("Failed to enqueue discord webhook", err as Error);
  }
};

export default enqueueDiscordWebhook;
