import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { boolean, number, object, string } from "zod";

interface ExtensionRequest {
  id?: string;
  appIcon?: number;
  includeLowScore?: boolean;
}

const validationSchema = object({
  id: string().optional(),
  appIcon: number().optional(),
  includeLowScore: boolean().optional()
});

export const post = [
  rateLimiter({ requests: 50, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { appIcon, includeLowScore } = body as ExtensionRequest;

    try {
      const idToken = req.headers["x-id-token"] as string;
      const payload = parseJwt(idToken);

      const data = { appIcon, includeLowScore };
      const preference = await prisma.preference.upsert({
        create: { ...data, accountAddress: payload.act.sub },
        update: data,
        where: { accountAddress: payload.act.sub }
      });

      await delRedis(`preference:${payload.act.sub}`);
      logger.info(`Updated preferences for ${payload.act.sub}`);

      return res.status(200).json({ result: preference, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
