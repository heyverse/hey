import { getRedis, setRedis } from "@hey/db/redisClient";
import sha256 from "@hey/helpers/sha256";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_1_DAY } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import getMetadata from "src/helpers/oembed/getMetadata";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 500, within: 1 }),
  async (req: Request, res: Response) => {
    const { url } = req.query;

    if (!url) {
      return noBody(res);
    }

    const cacheKey = `oembed:${sha256(url as string).slice(0, 10)}`;

    try {
      const cachedResult = await getRedis(cacheKey);

      if (cachedResult) {
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_1_DAY)
          .json({ oembed: JSON.parse(cachedResult), success: true });
      }

      const oembed = await getMetadata(url as string);

      if (!oembed) {
        return res.status(200).json({ oembed: null, success: false });
      }

      await setRedis(cacheKey, oembed);

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_1_DAY)
        .json({ oembed, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
