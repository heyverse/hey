import type { Context, Next } from "hono";

const getReadableUserAgent = (ua: string) => {
  switch (true) {
    case ua.includes("GPTBot"):
      return "GPTBot";
    case ua.includes("Googlebot"):
      return "Googlebot";
    case ua.includes("YandexBot"):
      return "YandexBot";
    default:
      return "Other";
  }
};

const infoLogger = async (c: Context, next: Next) => {
  const start = performance.now();
  const ua = c.req.header("User-Agent") || "unknown";
  const readableUa = getReadableUserAgent(ua);

  const startMem = process.memoryUsage().heapUsed;

  await next();

  const end = performance.now();
  const endMem = process.memoryUsage().heapUsed;
  const timeTakenMs = (end - start).toFixed(2);
  const memoryUsedMb = ((endMem - startMem) / 1024 / 1024).toFixed(2);
  const message = `[${c.req.method} ${c.req.path}] ➜ [${readableUa}] ➜ ${timeTakenMs}ms, ${memoryUsedMb}mb`;

  console.info(message);
};

export default infoLogger;
