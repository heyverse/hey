import type IORedis from "ioredis";

export const DELAYED_QUEUE_KEY = "hey:discord:webhooks:delayed" as const;

// Per-process, per-webhook (URL) next-available timestamp (ms)
declare global {
  // eslint-disable-next-line no-var
  var __heyWebhookNextAt: Map<string, number> | undefined;
}

const nextAtMap = (): Map<string, number> =>
  (globalThis.__heyWebhookNextAt ??= new Map<string, number>());

export const getWaitMs = (webhookUrl: string, now = Date.now()): number => {
  const until = nextAtMap().get(webhookUrl) ?? 0;
  return until > now ? until - now : 0;
};

export const setNextIn = (webhookUrl: string, delayMs: number): number => {
  const until = Date.now() + Math.max(0, Math.ceil(delayMs));
  const map = nextAtMap();
  const prev = map.get(webhookUrl) ?? 0;
  const value = Math.max(prev, until);
  map.set(webhookUrl, value);
  return value;
};

export const updateFromHeaders = (webhookUrl: string, res: Response): void => {
  const remaining = Number.parseInt(
    res.headers.get("x-ratelimit-remaining") ?? "NaN",
    10
  );
  const resetAfterSec = Number.parseFloat(
    res.headers.get("x-ratelimit-reset-after") ?? "NaN"
  );
  if (
    Number.isFinite(remaining) &&
    remaining <= 0 &&
    Number.isFinite(resetAfterSec)
  ) {
    setNextIn(webhookUrl, resetAfterSec * 1000);
  }
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
  const ts = Date.now() + Math.max(0, Math.ceil(delayMs));
  await r.zadd(key, String(ts), JSON.stringify(item));
};
