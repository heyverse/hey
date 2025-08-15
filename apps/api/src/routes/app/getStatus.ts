import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import prisma from "@/prisma/client";
import handleApiError from "@/utils/handleApiError";
import { getRedis, setRedis } from "@/utils/redis";

const getStatus = async (ctx: Context) => {
  try {
    const account = ctx.get("account");

    const cacheKey = `app-request:${account}`;
    const cachedValue = await getRedis(cacheKey);

    if (cachedValue) {
      return ctx.json({
        cached: true,
        data: JSON.parse(cachedValue),
        status: Status.Success
      });
    }

    const appRequest = await prisma.appRequest.findUnique({
      where: { accountAddress: account as string }
    });

    const data = {
      requested: Boolean(appRequest?.email),
      requestedAt: appRequest?.createdAt
    };

    await setRedis(cacheKey, data);

    return ctx.json({ data, status: Status.Success });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default getStatus;
