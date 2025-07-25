import logger from "@hey/helpers/logger";
import dotenv from "dotenv";
import type { RedisClientType } from "redis";
import { createClient } from "redis";

dotenv.config({ override: true });

const logNoRedis = () => logger.info("[Redis] No Redis client, using fallback");

let redisClient: null | RedisClientType = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on("connect", () => logger.info("[Redis] Redis connect"));
  redisClient.on("ready", () => logger.info("[Redis] Redis ready"));
  redisClient.on("reconnecting", (err) =>
    logger.error("[Redis] Redis reconnecting", err)
  );
  redisClient.on("error", (err) => logger.error("[Redis] Redis error", err));
  redisClient.on("end", (err) => logger.error("[Redis] Redis end", err));

  const connectRedis = async () => {
    logger.info("[Redis] Connecting to Redis");
    await redisClient?.connect();
  };

  connectRedis().catch((error) =>
    logger.error("[Redis] Connection error", error)
  );
} else {
  logger.info("[Redis] REDIS_URL not set");
}

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const hoursToSeconds = (hours: number): number => {
  return hours * 60 * 60;
};

// Generates a random expiry time between 1 to 2 days
export const generateSmallExpiry = (): number => {
  return randomNumber(hoursToSeconds(1 * 24), hoursToSeconds(2 * 24));
};

// Generates a random expiry time between 8 and 10 days
export const generateExtraLongExpiry = (): number => {
  return randomNumber(hoursToSeconds(8 * 24), hoursToSeconds(10 * 24));
};

export const setRedis = async (
  key: string,
  value: boolean | number | Record<string, unknown> | string,
  expiry = generateSmallExpiry()
) => {
  if (!redisClient) {
    logNoRedis();
    return;
  }

  return await redisClient.set(
    key,
    typeof value !== "string" ? JSON.stringify(value) : value,
    { EX: expiry }
  );
};

export const getRedis = async (key: string) => {
  if (!redisClient) {
    logNoRedis();
    return null;
  }

  return await redisClient.get(key);
};

export const delRedis = async (key: string) => {
  if (!redisClient) {
    logNoRedis();
    return null;
  }

  return await redisClient.del(key);
};
