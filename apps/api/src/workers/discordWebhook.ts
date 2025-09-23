import { withPrefix } from "@hey/helpers/logger";
import type IORedis from "ioredis";
import type {
  DiscordQueueItem,
  PageviewQueueItem,
  PostQueueItem
} from "../utils/discordQueue";
import { DISCORD_QUEUE_KEY, getRedis } from "../utils/redis";

const log = withPrefix("[Worker]");

const sleep = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

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
    log.error("Failed to parse queue item", e as Error);
    return null;
  }
};

const postContent = (payload: PostQueueItem["payload"]) => {
  const postUrl = payload.slug ? `https://hey.xyz/posts/${payload.slug}` : "";
  const type = payload.type ?? "post";
  return { content: `New ${type} on Hey ${postUrl}`.trim() };
};

const dispatch = async (item: DiscordQueueItem) => {
  let webhookUrl: string | undefined;
  let body: unknown;

  if (item.kind === "post") {
    webhookUrl = process.env.EVENTS_DISCORD_WEBHOOK_URL;
    body = postContent(item.payload);
  } else if (item.kind === "pageview") {
    webhookUrl = process.env.PAGEVIEWS_DISCORD_WEBHOOK_URL;
    body = { embeds: (item as PageviewQueueItem).payload.embeds };
  }

  if (!webhookUrl) {
    log.warn(`Skipping ${item.kind} webhook: missing webhook URL env`);
    return;
  }

  const res = await fetch(webhookUrl, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST"
  });

  if (res.status === 429) {
    const retryAfter = Number.parseFloat(res.headers.get("retry-after") ?? "1");
    const delay = Number.isFinite(retryAfter)
      ? Math.ceil(retryAfter * 1000)
      : 1000;
    await sleep(delay);
    throw new Error(`429 rate limited, retry after ${retryAfter}s`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Discord webhook failed (${res.status}): ${text}`);
  }
};

export const startDiscordWebhookWorker = async () => {
  let redis: IORedis;
  try {
    redis = getRedis();
  } catch (_e) {
    log.warn("Discord worker disabled: Redis not configured");
    return;
  }

  log.info(`Discord worker started. Queue: ${DISCORD_QUEUE_KEY}`);

  // Blocking pop loop using BRPOP with small timeout
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = (await redis.brpop(DISCORD_QUEUE_KEY, 5)) as
        | [string, string]
        | null;
      if (!res) continue;

      const [, raw] = res;
      const item = parseItem(raw);
      if (!item) continue;

      try {
        await dispatch(item);
        log.info(`Dispatched Discord webhook: ${item.kind}`);
      } catch (_err) {
        const retries = (item.retries ?? 0) + 1;
        if (retries <= 3) {
          item.retries = retries;
          await redis.rpush(DISCORD_QUEUE_KEY, JSON.stringify(item));
          log.warn(`Requeued ${item.kind} webhook (attempt ${retries})`);
        } else {
          log.error(`Dropped ${item.kind} webhook after ${retries} attempts`);
        }
      }
    } catch (loopErr) {
      log.error("Discord worker loop error", loopErr as Error);
      await sleep(1000);
    }
  }
};

export default startDiscordWebhookWorker;
