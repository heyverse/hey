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

declare global {
  // In-memory per-process cooldown map keyed by webhook URL
  // eslint-disable-next-line no-var
  var __heyDiscordCooldowns: Map<string, number> | undefined;
}

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

const likeContent = (payload: { slug?: string }) => {
  const postUrl = payload.slug ? `https://hey.xyz/posts/${payload.slug}` : "";
  return { content: `New like on Hey ${postUrl}`.trim() };
};

type WebhookDetails = { webhookUrl?: string; body: unknown };

const resolveWebhook = (item: DiscordQueueItem): WebhookDetails => {
  if (item.kind === "post") {
    return {
      body: postContent(item.payload),
      webhookUrl: process.env.EVENTS_DISCORD_WEBHOOK_URL
    };
  }
  if (item.kind === "pageview") {
    return {
      body: { embeds: (item as PageviewQueueItem).payload.embeds },
      webhookUrl: process.env.PAGEVIEWS_DISCORD_WEBHOOK_URL
    };
  }
  if (item.kind === "like") {
    return {
      body: likeContent((item as any).payload),
      webhookUrl: process.env.LIKES_DISCORD_WEBHOOK_URL
    };
  }
  return { body: {}, webhookUrl: undefined };
};

const RATE_LIMIT_ERROR = "DiscordRateLimitError" as const;

const dispatch = async (item: DiscordQueueItem) => {
  const { webhookUrl, body } = resolveWebhook(item);

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
    // Prefer reset-after, then Retry-After, then JSON retry_after. All are seconds.
    const resetAfter = Number.parseFloat(
      res.headers.get("x-ratelimit-reset-after") ?? "NaN"
    );
    const retryAfterHeader = Number.parseFloat(
      res.headers.get("retry-after") ?? "NaN"
    );
    let retryAfter = Number.isFinite(resetAfter)
      ? resetAfter
      : Number.isFinite(retryAfterHeader)
        ? retryAfterHeader
        : Number.NaN;
    if (!Number.isFinite(retryAfter)) {
      const payload = (await res.json().catch(() => null)) as {
        retry_after?: number | string;
      } | null;
      const bodyRetry = payload?.retry_after;
      retryAfter =
        typeof bodyRetry === "number"
          ? bodyRetry
          : Number.parseFloat(String(bodyRetry ?? "NaN"));
    }
    if (!Number.isFinite(retryAfter)) retryAfter = 1; // sensible fallback

    const rateHeaders = {
      bucket: res.headers.get("x-ratelimit-bucket"),
      global: res.headers.get("x-ratelimit-global"),
      limit: res.headers.get("x-ratelimit-limit"),
      remaining: res.headers.get("x-ratelimit-remaining")
    } as const;

    const err: Error & {
      name: string;
      retryAfterSec: number;
      webhookUrl: string;
      bucket?: string | null;
    } = new Error(
      `429 rate limited for ${item.kind}, retry after ${retryAfter}s`
    ) as any;
    err.name = RATE_LIMIT_ERROR;
    err.retryAfterSec = retryAfter;
    err.webhookUrl = webhookUrl;
    err.bucket = rateHeaders.bucket;
    throw err;
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

      // Respect per-URL cooldowns so one URL doesn't block others
      const { webhookUrl } = resolveWebhook(item);
      if (!webhookUrl) {
        log.warn(`Skipping ${item.kind} webhook: missing webhook URL env`);
        continue;
      }

      const now = Date.now();
      // in-memory cooldowns keyed by URL
      // note: intentionally module-level to persist across loop iterations
      if (!globalThis.__heyDiscordCooldowns) {
        (globalThis as any).__heyDiscordCooldowns = new Map<string, number>();
      }
      const cooldowns: Map<string, number> = (globalThis as any)
        .__heyDiscordCooldowns;
      const until = cooldowns.get(webhookUrl);
      if (typeof until === "number" && until > now) {
        const waitSec = Math.ceil((until - now) / 1000);
        await redis.rpush(DISCORD_QUEUE_KEY, JSON.stringify(item));
        log.warn(
          `Cooldown active for ${item.kind} (${waitSec}s remaining), requeued`
        );
        // small yield to avoid hot loop; do not block long
        await sleep(Math.min(250, until - now));
        continue;
      }

      try {
        await dispatch(item);
        log.info(`Dispatched Discord webhook: ${item.kind}`);
      } catch (err) {
        const e = err as Error & {
          name?: string;
          retryAfterSec?: number;
          webhookUrl?: string;
        };
        if (e?.name === RATE_LIMIT_ERROR && e.retryAfterSec && e.webhookUrl) {
          const untilTs = Date.now() + Math.ceil(e.retryAfterSec * 1000);
          cooldowns.set(e.webhookUrl, untilTs);
          await redis.rpush(DISCORD_QUEUE_KEY, JSON.stringify(item));
          log.warn(
            `Rate limited for ${item.kind}. Retry after ${Math.ceil(
              e.retryAfterSec
            )}s`
          );
          // continue without counting as a failure
          continue;
        }

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
