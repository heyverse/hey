import logger from "@hey/helpers/logger";
import dotenv from "dotenv";
import { type QueueJobData, QueueManager } from "./QueueManager";

dotenv.config({ override: true });

const redisConnection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : undefined;

if (!redisConnection) {
  logger.warn(
    "[Queue] REDIS_URL not set, queue functionality will be disabled"
  );
}

export const createQueue = <T extends QueueJobData = QueueJobData>(
  queueName: string
) => {
  if (!redisConnection) {
    throw new Error("Redis connection not available for queue");
  }

  return new QueueManager<T>(queueName, redisConnection);
};
