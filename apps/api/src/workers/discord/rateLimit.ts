import type IORedis from "ioredis";

export const DELAYED_QUEUE_KEY = "hey:discord:webhooks:delayed" as const;
export const RATE_LIMIT_ERROR = "DiscordRateLimitError" as const;

export type RateLimitError = Error & {
  name: string;
  retryAfterSec: number;
  webhookUrl: string;
  isGlobal?: boolean;
  bucket?: string | null;
};

declare global {
  // In-memory per-process cooldown map keyed by webhook URL
  // eslint-disable-next-line no-var
  var __heyDiscordCooldowns: Map<string, number> | undefined;
  // Global rate limit cooldown until timestamp (ms)
  // eslint-disable-next-line no-var
  var __heyDiscordGlobalUntil: number | undefined;
}

export const jitterMs = (base: number): number => {
  const jitter = Math.floor(Math.random() * 250) + 50; // 50-300ms
  return Math.max(0, base + jitter);
};

export const getCooldownUntil = (webhookUrl: string): number | undefined => {
  const map = (globalThis.__heyDiscordCooldowns ??= new Map<string, number>());
  const perUrl = map.get(webhookUrl);
  const globalUntil = globalThis.__heyDiscordGlobalUntil;
  return Math.max(perUrl ?? 0, globalUntil ?? 0) || undefined;
};

export const setCooldown = (
  webhookUrl: string,
  retryAfterSec: number,
  isGlobal?: boolean
): number => {
  const untilTs = Date.now() + Math.ceil(retryAfterSec * 1000);
  if (isGlobal) {
    globalThis.__heyDiscordGlobalUntil = untilTs;
  } else {
    const map = (globalThis.__heyDiscordCooldowns ??= new Map<
      string,
      number
    >());
    map.set(webhookUrl, untilTs);
  }
  return untilTs;
};

export const getActiveDelayMs = (
  webhookUrl: string,
  now = Date.now()
): number => {
  const until = getCooldownUntil(webhookUrl);
  if (!until) return 0;
  if (until <= now) return 0;
  return until - now;
};

export const promoteDue = async (
  r: IORedis,
  key: string,
  limit = 100
): Promise<number> => {
  const now = Date.now();
  const due = await r.zrangebyscore(key, 0, now, "LIMIT", 0, limit);
  if (due.length === 0) return 0;
  const multi = r.multi();
  for (const value of due) {
    multi.zrem(key, value);
    multi.rpush(key.replace(":delayed", ""), value);
  }
  await multi.exec();
  return due.length;
};

export const schedule = async (
  r: IORedis,
  key: string,
  item: unknown,
  delayMs: number
): Promise<void> => {
  const ts = Date.now() + jitterMs(delayMs);
  await r.zadd(key, String(ts), JSON.stringify(item));
};

export const updateCooldownFromHeaders = (
  webhookUrl: string,
  res: Response
): void => {
  const remaining = Number.parseInt(
    res.headers.get("x-ratelimit-remaining") ?? "NaN",
    10
  );
  const resetAfter = Number.parseFloat(
    res.headers.get("x-ratelimit-reset-after") ?? "NaN"
  );
  if (
    Number.isFinite(remaining) &&
    remaining <= 0 &&
    Number.isFinite(resetAfter)
  ) {
    const untilTs = Date.now() + Math.ceil(resetAfter * 1000);
    const map = (globalThis.__heyDiscordCooldowns ??= new Map<
      string,
      number
    >());
    map.set(webhookUrl, untilTs);
  }
};

export const buildRateLimitError = async (
  res: Response,
  webhookUrl: string,
  kind: string
): Promise<RateLimitError> => {
  const resetAfter = Number.parseFloat(
    res.headers.get("x-ratelimit-reset-after") ?? "NaN"
  );
  const retryAfterHeader = Number.parseFloat(
    res.headers.get("retry-after") ?? "NaN"
  );
  const isGlobalHeader =
    (res.headers.get("x-ratelimit-global") ?? "").toLowerCase() === "true";

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
  if (!Number.isFinite(retryAfter)) retryAfter = 1;

  const err = new Error(
    `429 rate limited for ${kind}, retry after ${retryAfter}s`
  ) as RateLimitError;
  err.name = RATE_LIMIT_ERROR;
  err.retryAfterSec = retryAfter;
  err.webhookUrl = webhookUrl;
  if (isGlobalHeader) err.isGlobal = true;
  err.bucket = res.headers.get("x-ratelimit-bucket");
  return err;
};

export const isRateLimitError = (e: unknown): e is RateLimitError => {
  return !!e && typeof e === "object" && (e as any).name === RATE_LIMIT_ERROR;
};
