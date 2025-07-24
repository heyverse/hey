import logger from "@hey/helpers/logger";
import type { Context, Next } from "hono";

const infoLogger = async (c: Context, next: Next) => {
  const start = performance.now();
  const startMem = process.memoryUsage().heapUsed;

  await next();

  const end = performance.now();
  const endMem = process.memoryUsage().heapUsed;
  const timeTakenMs = (end - start).toFixed(2);
  const memoryUsedMb = ((endMem - startMem) / 1024 / 1024).toFixed(2);
  const message = `[${c.req.method} ${c.req.path}] ➜ ${timeTakenMs}ms, ${memoryUsedMb}mb`;

  logger.info(message);
};

export default infoLogger;
