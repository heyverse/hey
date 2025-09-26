import IORedis from "ioredis";

let redisClient: IORedis | null = null;

export const DISCORD_QUEUE_POSTS = "hey:discord:webhooks:posts";
export const DISCORD_QUEUE_LIKES = "hey:discord:webhooks:likes";
export const DISCORD_QUEUE_COLLECTS = "hey:discord:webhooks:collects";

export const getRedis = (): IORedis => {
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("Redis not configured. Set REDIS_URL");
  }

  redisClient = new IORedis(url);
  return redisClient;
};
