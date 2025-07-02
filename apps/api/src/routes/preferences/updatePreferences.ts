import { Status } from "@hey/data/enums";
import type { Context } from "hono";
import prisma from "../../prisma/client";
import handleApiError from "../../utils/handleApiError";
import { delRedis } from "../../utils/redis";

const updatePreferences = async (ctx: Context) => {
  try {
    const { appIcon, includeLowScore } = await ctx.req.json();
    const account = ctx.get("account");

    const preference = await prisma.preference.upsert({
      create: { accountAddress: account as string, appIcon, includeLowScore },
      update: { appIcon, includeLowScore },
      where: { accountAddress: account as string }
    });

    await delRedis(`preferences:${account}`);

    return ctx.json({
      data: {
        appIcon: preference.appIcon ?? 0,
        includeLowScore: preference.includeLowScore ?? false
      },
      status: Status.Success
    });
  } catch (error) {
    return handleApiError(ctx, error);
  }
};

export default updatePreferences;
