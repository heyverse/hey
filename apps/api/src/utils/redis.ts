import dotenv from "dotenv";
import type { RedisClientType } from "redis";
import { createClient } from "redis";

dotenv.config({ override: true });

const noRedisError = () =>
  console.error("[Redis] Redis client not initialized");

let redisClient: null | RedisClientType = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on("connect", () => console.info("[Redis] Redis connect"));
  redisClient.on("ready", () => console.info("[Redis] Redis ready"));
  redisClient.on("reconnecting", (err) =>
    console.error("[Redis] Redis reconnecting", err)
  );
  redisClient.on("error", (err) => console.error("[Redis] Redis error", err));
  redisClient.on("end", (err) => console.error("[Redis] Redis end", err));

  const connectRedis = async () => {
    console.info("[Redis] Connecting to Redis");
    await redisClient?.connect();
  };

  connectRedis().catch((error) =>
    console.error("[Redis] Connection error", error)
  );
} else {
  console.info("[Redis] REDIS_URL not set");
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
  value: boolean | number | Record<string, any> | string,
  expiry = generateSmallExpiry()
) => {
  if (!redisClient) {
    noRedisError();
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
    noRedisError();
    return null;
  }

  return await redisClient.get(key);
};

export const delRedis = async (key: string) => {
  if (!redisClient) {
    noRedisError();
    return null;
  }

  return await redisClient.del(key);
};

export default redisClient;
