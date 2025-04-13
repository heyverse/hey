import { createHash } from "node:crypto";

import { rateLimiter as rateLimit } from "hono-rate-limiter";

const getIp = (req: Request): string => {
  const ips = (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "unknown"
  ).split(",");

  return ips[0].trim();
};

const sha256 = (text: string): string => {
  return createHash("sha256").update(text).digest("hex");
};

const hashedIp = (req: Request): string => sha256(getIp(req)).slice(0, 25);

interface RateLimiterOptions {
  requests: number;
}

const rateLimiter = ({ requests }: RateLimiterOptions) => {
  return rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: requests,
    standardHeaders: "draft-6",
    keyGenerator: (c) => {
      const key = `rate-limit:${sha256(c.req.url).slice(0, 25)}:${hashedIp(
        c.req.raw
      )}`;
      return key;
    }
  });
};

export default rateLimiter;
