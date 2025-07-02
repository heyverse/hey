import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import prisma from "../../prisma/client";
import handleApiError from "../../utils/handleApiError";
import { getRedis, setRedis } from "../../utils/redis";

const getPreferences = async (ctx: Context) => {
  try {
    const account = ctx.get("account");

    const cacheKey = `preferences:${account}`;
    const cachedValue = await getRedis(cacheKey);

    if (cachedValue) {
      return ctx.json({
        cached: true,
        data: JSON.parse(cachedValue),
        status: Status.Success
      });
    }

    const preference = await prisma.preference.findUnique({
      where: { accountAddress: account as string }
    });

    const data = {
      appIcon: preference?.appIcon || 0,
      includeLowScore: Boolean(preference?.includeLowScore)
    };

    await setRedis(cacheKey, data);

    return ctx.json({ data, status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default getPreferences;
