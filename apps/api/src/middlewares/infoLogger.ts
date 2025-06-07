import type { Context, Next } from "hono";

/**
 * Logs request method, path, user agent and timing. When the environment
 * variable `ENABLE_DETAILED_LOGGING` is set to `true`, the log also includes
 * memory usage.
 */
const isDetailedLoggingEnabled = process.env.ENABLE_DETAILED_LOGGING === "true";

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

  let startMem = 0;
  if (isDetailedLoggingEnabled) {
    startMem = process.memoryUsage().heapUsed;
  }

  await next();

  const end = performance.now();
  let message = `[${c.req.method} ${c.req.path}] ➜ [${readableUa}] ➜ ${(
    end - start
  ).toFixed(2)}ms`;

  if (isDetailedLoggingEnabled) {
    const endMem = process.memoryUsage().heapUsed;
    const memoryUsedMb = ((endMem - startMem) / 1024 / 1024).toFixed(2);
    message += `, ${memoryUsedMb}mb`;
  }

  console.info(message);
};

export default infoLogger;
