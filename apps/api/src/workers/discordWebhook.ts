import { withPrefix } from "@hey/helpers/logger";
import type IORedis from "ioredis";
import type { DiscordQueueItem } from "../utils/discordQueue";
import {
  DISCORD_QUEUE_COLLECTS,
  DISCORD_QUEUE_LIKES,
  DISCORD_QUEUE_POSTS,
  getRedis
} from "../utils/redis";
import {
  getWaitMs,
  promoteDue,
  schedule,
  setNextIn,
  updateFromHeaders
} from "./discord/rateLimit";
import { resolveWebhook } from "./discord/webhook";

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
    return item && "kind" in item ? item : null;
  } catch (e) {
    log.error("Failed to parse queue item", e as Error);
    return null;
  }
};

const dispatch = async (item: DiscordQueueItem) => {
  const { webhookUrl, body } = resolveWebhook(item);
  if (!webhookUrl) {
    log.warn(`Skipping ${item.kind} webhook: missing webhook URL env`);
    return { status: 0, webhookUrl: undefined as string | undefined };
  }
  const res = await fetch(webhookUrl, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST"
  });
  return { res, status: res.status, webhookUrl } as const;
};

const startQueueWorker = async (queueKey: string, label: string) => {
  let redis: IORedis;
  try {
    redis = getRedis();
  } catch {
    log.warn(`Discord worker (${label}) disabled: Redis not configured`);
    return;
  }

  log.info(`Discord worker started (${label}). Queue: ${queueKey}`);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const delayedKey = `${queueKey}:delayed`;
      await promoteDue(redis, delayedKey, 100);

      const res = (await redis.brpop(queueKey, 5)) as [string, string] | null;
      if (!res) continue;

      const [, raw] = res;
      const item = parseItem(raw);
      if (!item) continue;

      const { webhookUrl } = resolveWebhook(item);
      if (!webhookUrl) {
        log.warn(`Skipping ${item.kind} webhook: missing webhook URL env`);
        continue;
      }

      // If this webhook has a pending cooldown, re-schedule it individually
      const waitMs = getWaitMs(webhookUrl);
      if (waitMs > 0) {
        await schedule(redis, delayedKey, item, waitMs);
        log.warn(
          `Cooldown for ${item.kind}. Scheduled after ${Math.ceil(waitMs / 1000)}s`
        );
        continue;
      }
      // Reserve 1 req/s slot pre-dispatch to avoid concurrent sends for same URL
      setNextIn(webhookUrl, 1000);

      try {
        const result = await dispatch(item);
        const { webhookUrl: url, status, res } = result;

        if (!url) continue;

        if (status === 429) {
          // Parse retry-after headers/body; fallback to 10s min
          const resetAfter = Number.parseFloat(
            res?.headers.get("x-ratelimit-reset-after") ?? "NaN"
          );
          const retryAfterHeader = Number.parseFloat(
            res?.headers.get("retry-after") ?? "NaN"
          );
          let retryAfterSec = Number.isFinite(resetAfter)
            ? resetAfter
            : Number.isFinite(retryAfterHeader)
              ? retryAfterHeader
              : Number.NaN;
          if (!Number.isFinite(retryAfterSec)) {
            const payload = (await res?.json().catch(() => null)) as {
              retry_after?: number | string;
            } | null;
            const bodyRetry = payload?.retry_after;
            retryAfterSec =
              typeof bodyRetry === "number"
                ? bodyRetry
                : Number.parseFloat(String(bodyRetry ?? "NaN"));
          }
          if (!Number.isFinite(retryAfterSec)) retryAfterSec = 10;
          retryAfterSec = Math.max(10, retryAfterSec);

          const until = setNextIn(url, retryAfterSec * 1000);
          const ms = Math.max(0, until - Date.now());
          await schedule(redis, delayedKey, item, ms);
          log.warn(
            `Rate limited for ${item.kind}. Scheduled after ${Math.ceil(ms / 1000)}s`
          );
          continue;
        }

        if (!res?.ok) {
          const text = await res?.text().catch(() => "");
          throw new Error(`Discord webhook failed (${status}): ${text}`);
        }

        // Success: update from headers if provided
        updateFromHeaders(url, res);
        log.info(`Dispatched Discord webhook: ${item.kind}`);
      } catch (_err) {
        const retries = (item.retries ?? 0) + 1;
        if (retries <= 3) {
          item.retries = retries;
          await redis.rpush(queueKey, JSON.stringify(item));
          log.warn(`Requeued ${item.kind} webhook (attempt ${retries})`);
        } else {
          log.error(`Dropped ${item.kind} webhook after ${retries} attempts`);
        }
      }
    } catch (e) {
      log.error("Discord worker loop error", e as Error);
      await sleep(1000);
    }
  }
};

export const startDiscordWebhookWorkerPosts = async () =>
  startQueueWorker(DISCORD_QUEUE_POSTS, "posts");
export const startDiscordWebhookWorkerLikes = async () =>
  startQueueWorker(DISCORD_QUEUE_LIKES, "likes");
export const startDiscordWebhookWorkerCollects = async () =>
  startQueueWorker(DISCORD_QUEUE_COLLECTS, "collects");
