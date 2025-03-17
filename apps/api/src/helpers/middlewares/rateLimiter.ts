import redisClient from "@hey/db/redisClient";
import getIp from "@hey/helpers/getIp";
import sha256 from "@hey/helpers/sha256";
import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import catchedError from "../catchedError";

const ERROR_MESSAGE = (path: string, ip: string) =>
  `Too many requests - ${path} - ${ip}`;

const hashedIp = (req: Request): string => sha256(getIp(req)).slice(0, 25);

const createRateLimiter = (window: number, max: number) => {
  return rateLimit({
    handler: (req, res) =>
      catchedError(res, new Error(ERROR_MESSAGE(req.path, getIp(req))), 429),
    keyGenerator: (req) => `${sha256(req.path).slice(0, 25)}:${hashedIp(req)}`,
    legacyHeaders: false,
    max,
    skip: () => !redisClient?.isReady,
    standardHeaders: true,
    store: redisClient
      ? new RedisStore({
          prefix: "rate-limit:",
          sendCommand: (...args: string[]) =>
            redisClient?.sendCommand(args) as any
        })
      : undefined,
    windowMs: window * 60 * 1000
  });
};

export const rateLimiter = ({
  requests,
  within
}: {
  requests: number;
  within: number;
}) => {
  const rateLimiter = createRateLimiter(within, requests);

  return (req: Request, res: Response, next: NextFunction) => {
    rateLimiter(req, res, next);
  };
};
