import { withPrefix } from "@hey/helpers/logger";
import type IORedis from "ioredis";
import type { DiscordQueueItem } from "../utils/discordQueue";
import { DISCORD_QUEUE_KEY, getRedis } from "../utils/redis";
import {
  buildRateLimitError,
  DELAYED_QUEUE_KEY,
  getActiveDelayMs,
  isRateLimitError,
  promoteDue,
  schedule,
  setCooldown,
  updateCooldownFromHeaders
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
    return;
  }
  const res = await fetch(webhookUrl, {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
    method: "POST"
  });
  if (res.status === 429)
    throw await buildRateLimitError(res, webhookUrl, item.kind);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Discord webhook failed (${res.status}): ${text}`);
  }
  updateCooldownFromHeaders(webhookUrl, res);
};

export const startDiscordWebhookWorker = async () => {
  let redis: IORedis;
  try {
    redis = getRedis();
  } catch {
    log.warn("Discord worker disabled: Redis not configured");
    return;
  }

  log.info(`Discord worker started. Queue: ${DISCORD_QUEUE_KEY}`);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await promoteDue(redis, DELAYED_QUEUE_KEY, 100);

      const res = (await redis.brpop(DISCORD_QUEUE_KEY, 5)) as
        | [string, string]
        | null;
      if (!res) continue;

      const [, raw] = res;
      const item = parseItem(raw);
      if (!item) continue;

      const { webhookUrl } = resolveWebhook(item);
      if (!webhookUrl) {
        log.warn(`Skipping ${item.kind} webhook: missing webhook URL env`);
        continue;
      }

      const delayMs = getActiveDelayMs(webhookUrl);
      if (delayMs > 0) {
        await schedule(redis, DELAYED_QUEUE_KEY, item, delayMs);
        log.warn(
          `Cooldown active for ${item.kind}. Scheduled after ${Math.ceil(delayMs / 1000)}s`
        );
        continue;
      }

      try {
        await dispatch(item);
        log.info(`Dispatched Discord webhook: ${item.kind}`);
      } catch (err) {
        if (isRateLimitError(err)) {
          const untilTs = setCooldown(
            err.webhookUrl,
            err.retryAfterSec,
            err.isGlobal
          );
          const ms = Math.max(0, untilTs - Date.now());
          await schedule(redis, DELAYED_QUEUE_KEY, item, ms);
          const label = err.isGlobal
            ? "Global rate limit"
            : `Rate limited for ${item.kind}`;
          log.warn(`${label}. Scheduled after ${Math.ceil(ms / 1000)}s`);
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
    } catch (e) {
      log.error("Discord worker loop error", e as Error);
      await sleep(1000);
    }
  }
};

export default startDiscordWebhookWorker;
